export interface Location {
  id: number;
  code: string;
  floor: number;
  title: string;
  department: string;
}

export interface LocationWithDetails {
  location: Location;
  itemsAmount: number;
}