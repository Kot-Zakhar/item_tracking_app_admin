export interface Category {
  id: number;
  name: string;
  icon?: string;
}

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export interface CategoryWithParent extends Category {
  parent?: CategoryWithParent;
}

export type CategoryWithParentAndChildren = CategoryWithParent & CategoryWithChildren;


export interface CategoryWithItems {
  category: Category;
  itemsAmount: number;
}

export interface CategoryWithDetailsAndChildren extends CategoryWithItems {
  children?: CategoryWithDetailsAndChildren[];
}

export interface CategoryWithDetailsAndParent extends CategoryWithItems {
  parent?: CategoryWithDetailsAndParent[];
}

export type CategoryWithDetails = CategoryWithDetailsAndChildren & CategoryWithDetailsAndParent;