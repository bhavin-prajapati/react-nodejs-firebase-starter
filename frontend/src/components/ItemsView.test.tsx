import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemsView } from './ItemsView';
import type { Item } from '../types';

const sampleItems: Item[] = [
  { id: '1', name: 'Alpha', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: '2', name: 'Beta', createdAt: '2026-01-02T00:00:00.000Z' },
];

describe('ItemsView', () => {
  it('renders the list of items', () => {
    render(
      <ItemsView
        items={sampleItems}
        isLoading={false}
        isError={false}
        onAdd={jest.fn()}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('shows a spinner while loading', () => {
    render(
      <ItemsView items={[]} isLoading isError={false} onAdd={jest.fn()} />,
    );
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('shows an error message on failure', () => {
    render(
      <ItemsView items={[]} isLoading={false} isError onAdd={jest.fn()} />,
    );
    expect(screen.getByText('Failed to load items.')).toBeInTheDocument();
  });

  it('calls onAdd with the trimmed name and clears the input', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(
      <ItemsView items={[]} isLoading={false} isError={false} onAdd={onAdd} />,
    );

    const input = screen.getByLabelText('New item');
    await user.type(input, '  Gamma  ');
    await user.click(screen.getByRole('button', { name: /add item/i }));

    expect(onAdd).toHaveBeenCalledWith('Gamma');
    expect(input).toHaveValue('');
  });

  it('does not call onAdd for an empty name', async () => {
    const onAdd = jest.fn();
    const user = userEvent.setup();
    render(
      <ItemsView items={[]} isLoading={false} isError={false} onAdd={onAdd} />,
    );

    await user.click(screen.getByRole('button', { name: /add item/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });
});
