import { useCreateItem, useItems } from '../hooks/useItems';
import { useUiStore } from '../store/uiStore';
import { ItemsView } from './ItemsView';

/** Container: connects React Query data and the zustand store to ItemsView. */
export function ItemsPage() {
  const { data: items = [], isLoading, isError } = useItems();
  const createItem = useCreateItem();
  const incrementAddedCount = useUiStore((s) => s.incrementAddedCount);

  const handleAdd = (name: string) => {
    createItem.mutate(name, {
      onSuccess: () => incrementAddedCount(),
    });
  };

  return (
    <ItemsView
      items={items}
      isLoading={isLoading}
      isError={isError}
      isAdding={createItem.isPending}
      onAdd={handleAdd}
    />
  );
}
