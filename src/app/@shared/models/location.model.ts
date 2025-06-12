export interface Location {
  id: number;
  code: string;
  floor: number;
  name: string;
  department: string;
}

export interface LocationWithDetails extends Location {
  itemsAmount: number;
}