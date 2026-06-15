import request from 'supertest';
import type { Express } from 'express';
import { getDb, getAdminAuth } from '../src/firestore';
import { createApp } from '../src/app';

jest.mock('../src/firestore', () => ({
  ITEMS_COLLECTION: 'items',
  getDb: jest.fn(),
  getAdminAuth: jest.fn(),
}));

const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;
const mockedGetAdminAuth = getAdminAuth as jest.MockedFunction<typeof getAdminAuth>;

describe('API routes', () => {
  let app: Express;
  let collection: jest.Mock;
  let orderBy: jest.Mock;
  let getDocs: jest.Mock;
  let add: jest.Mock;

  beforeEach(() => {
    getDocs = jest.fn();
    orderBy = jest.fn(() => ({ get: getDocs }));
    add = jest.fn();
    collection = jest.fn(() => ({ orderBy, add }));
    mockedGetDb.mockReturnValue({ collection } as unknown as ReturnType<typeof getDb>);

    // Mock the Admin Auth to verify any token and return a decoded token.
    mockedGetAdminAuth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-uid' }),
    } as unknown as ReturnType<typeof getAdminAuth>);

    app = createApp();
  });

  test('GET /healthz returns ok', async () => {
    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('GET /api/items returns items sorted via Firestore', async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: 'abc',
          data: () => ({ name: 'First', createdAt: '2024-01-02T00:00:00.000Z' }),
        },
      ],
    });

    const res = await request(app).get('/api/items');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [{ id: 'abc', name: 'First', createdAt: '2024-01-02T00:00:00.000Z' }],
    });
    expect(collection).toHaveBeenCalledWith('items');
    expect(orderBy).toHaveBeenCalledWith('createdAt', 'desc');
  });

  test('POST /api/items creates and returns an item', async () => {
    add.mockResolvedValue({ id: 'generated-id' });

    const res = await request(app)
      .post('/api/items')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ name: 'Widget' });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 'generated-id', name: 'Widget' });
    expect(typeof res.body.createdAt).toBe('string');
    expect(Number.isNaN(Date.parse(res.body.createdAt))).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Widget',
        createdAt: expect.any(String),
        createdBy: 'test-user-uid',
      }),
    );
  });

  test('POST /api/items returns 401 without auth header', async () => {
    const res = await request(app).post('/api/items').send({ name: 'Widget' });
    expect(res.status).toBe(401);
    expect(add).not.toHaveBeenCalled();
  });

  test('POST /api/items returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', 'Bearer valid-test-token')
      .send({});
    expect(res.status).toBe(400);
    expect(add).not.toHaveBeenCalled();
  });

  test('POST /api/items returns 400 when name is blank', async () => {
    const res = await request(app)
      .post('/api/items')
      .set('Authorization', 'Bearer valid-test-token')
      .send({ name: '   ' });
    expect(res.status).toBe(400);
    expect(add).not.toHaveBeenCalled();
  });
});
