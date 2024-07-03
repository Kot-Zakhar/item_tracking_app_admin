import { CategoryWithParent } from './category.model';
import { Location } from './location.model';
import { User } from './user.model';

export interface MovableItem {
  id: number;
  name: string;
  description: string;
  category: CategoryWithParent;
  visibility: boolean;
  createdAt: Date;
  imgSrc?: string;
}

export enum MovableItemStatus {
  Available = 0,
  Booked = 1,
  Taken = 2,
}

export const MovableItemStatusTranslationKeys: Record<MovableItemStatus, string> = {
  [MovableItemStatus.Available]: 'domain.statuses.available',
  [MovableItemStatus.Booked]: 'domain.statuses.booked',
  [MovableItemStatus.Taken]: 'domain.statuses.taken',
};

export interface MovableItemInstance {
  id: number;
  movableItemId: number;
  code: string;
  name: string;
  status: MovableItemStatus;
  user?: User;
  location?: Location;
  createdAt: Date;
}

export interface MovableItemWithInstances {
  item: MovableItem;
  instances: MovableItemInstance[];
}

export interface MovableItemInstanceHistoryRecord {
  id: number;
  movableItemInstanceId: number;
  user: User;
  startedAt: Date;
  finishedAt?: Date;
  fromLocation?: Location;
  toLocation?: Location;
}