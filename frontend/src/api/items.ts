import { API_BASE_URL } from './config';
import type { Item, ItemsResponse } from '../types';

/** Fetch all items from the API. */
export async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`${API_BASE_URL}/api/items`);
  if (!res.ok) {
    throw new Error(`Failed to fetch items (${res.status})`);
  }
  const data = (await res.json()) as ItemsResponse;
  return data.items;
}

/** Create a new item with the given name. */
export async function createItem(name: string): Promise<Item> {
  const res = await fetch(`${API_BASE_URL}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create item (${res.status})`);
  }
  return (await res.json()) as Item;
}
