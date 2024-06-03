import { MovableItemStatus } from './movable-items.model';

export interface Category {
  id: number;
  title: string;
  icon?: string;
}

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export interface CategoryWithParent extends Category {
  parent?: CategoryWithParent;
}


export interface CategoryWithDetails {
  category: Category;
  itemsAmount: number;
}

export interface CategoryWithDetailsAndChildren extends CategoryWithDetails {
  children?: CategoryWithDetailsAndChildren[];
}