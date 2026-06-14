// Shape defined by the integration CONTRACT.md.
export interface Item {
  id: string;
  name: string;
  createdAt: string; // ISO-8601
}

export interface ItemsResponse {
  items: Item[];
}
