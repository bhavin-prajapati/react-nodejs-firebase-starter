import { useState, type FormEvent } from 'react';
import { Alert, Button, Form, ListGroup, Spinner } from 'react-bootstrap';
import type { Item } from '../types';

export interface ItemsViewProps {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
  isAdding?: boolean;
  onAdd: (name: string) => void;
}

/**
 * Presentational component: renders the items list and an add form.
 * All data and handlers are passed in as props so it is trivial to test.
 */
export function ItemsView({
  items,
  isLoading,
  isError,
  isAdding = false,
  onAdd,
}: ItemsViewProps) {
  const [name, setName] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onAdd(trimmed);
    setName('');
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group controlId="item-name" className="mb-2">
          <Form.Label>New item</Form.Label>
          <Form.Control
            type="text"
            placeholder="Item name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Group>
        <Button type="submit" disabled={isAdding}>
          {isAdding ? 'Adding…' : 'Add item'}
        </Button>
      </Form>

      {isLoading && (
        <Spinner animation="border" role="status" aria-label="Loading" />
      )}
      {isError && <Alert variant="danger">Failed to load items.</Alert>}
      {!isLoading && !isError && (
        <ListGroup>
          {items.length === 0 ? (
            <ListGroup.Item>No items yet.</ListGroup.Item>
          ) : (
            items.map((item) => (
              <ListGroup.Item key={item.id}>{item.name}</ListGroup.Item>
            ))
          )}
        </ListGroup>
      )}
    </div>
  );
}
