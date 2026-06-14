import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createItem, fetchItems } from '../api/items';
import type { Item } from '../types';

export const ITEMS_QUERY_KEY = ['items'] as const;

/** Query hook that loads the list of items. */
export function useItems() {
  return useQuery<Item[]>({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: fetchItems,
  });
}

/** Mutation hook that creates an item and refreshes the list on success. */
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createItem(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ITEMS_QUERY_KEY });
    },
  });
}
