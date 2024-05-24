import { Component, Input } from '@angular/core';
import { ItemsDataService } from '../items-data.service';
import { MovableItem, MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { MatDividerModule } from '@angular/material/divider';
import { InstanceRowComponent } from './instance-row/instance-row.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-items-item-instances',
  templateUrl: './item-instances.component.html',
  styleUrls: ['./item-instances.component.scss'],
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    
    InstanceRowComponent,
    PageComponent,
    PageContentDirective,
    RouterLink,
  ],
})
export class ItemsItemInstancesComponent {
  @Input({required: true})
  set itemId(value: string) {
    this.numericItemId = Number.parseInt(value, 10);
    this.dataSrv.getItem(this.numericItemId).subscribe(item => this.item = item);
    this.loadInstances();
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

  numericItemId: number;
  item?: MovableItem;
  instances?: MovableItemInstance[];

  constructor(private dataSrv: ItemsDataService) { }

  loadInstances() {
    this.dataSrv.getItemInstances(this.numericItemId).subscribe(instances => this.instances = instances);
  }

  onQuickAdd() {
    this.dataSrv.addInstance(this.numericItemId).subscribe(() => this.loadInstances());
  }

  getCategoryFullTitle(category: Category): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.title}` : category.title;
  }

  onInstanceDelete(instance: MovableItemInstance) {
    this.dataSrv.deleteInstance(this.numericItemId, instance.id).subscribe(() => this.loadInstances());
  }

  private countByStatus(status: MovableItemStatus): number {
    return this.instances?.filter(i => i.status === status).length ?? 0;
  }
}
