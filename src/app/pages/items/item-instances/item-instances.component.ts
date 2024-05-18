import { Component, Input } from '@angular/core';
import { ItemsDataService } from '../items-data.service';
import { MovableItem, MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { MatDividerModule } from '@angular/material/divider';
import { InstanceRowComponent } from './instance-row/instance-row.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';

@Component({
  selector: 'app-items-item-instances',
  templateUrl: './item-instances.component.html',
  styleUrls: ['./item-instances.component.scss'],
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatDividerModule,
    InstanceRowComponent,
    PageComponent,
    PageContentDirective,
  ],
})
export class ItemsItemInstancesComponent {
  @Input({required: true})
  set itemId(value: number) {
    this.dataSrv.getItem(value).subscribe(item => this.item = item);
    this.dataSrv.getItemInstances(value).subscribe(instances => this.instances = instances);
  }

  get availableCount(): number {
    return this.countByStatus(MovableItemStatus.Available);
  }

  get bookedCount(): number {
    return this.countByStatus(MovableItemStatus.Booked);
  }

  get takenCount(): number {
    return this.countByStatus(MovableItemStatus.Taken);
  }

  item?: MovableItem;
  instances?: MovableItemInstance[];

  constructor(private dataSrv: ItemsDataService) { }

  private countByStatus(status: MovableItemStatus): number {
    return this.instances?.filter(i => i.status === status).length ?? 0;
  }
}
