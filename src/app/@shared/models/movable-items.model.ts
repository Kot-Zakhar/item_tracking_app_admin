import { Category } from './category.model';
import { Location } from './location.model';
import { User } from './user.model';

export interface MovableItem {
  id: number;
  name: string;
  description: string;
  category: Category;
  visibility: boolean;
  createdAt: Date;
}

export enum MovableItemStatus {
  Available = 0,
  Booked = 1,
  Taken = 2,
}

export interface MovableItemInstance {
  id: number;
  code: string;
  name: string;
  status: MovableItemStatus;
  user?: User;
  location?: Location;
  createdAt: Date;
}