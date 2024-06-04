import { Component, Input, inject } from '@angular/core';
import { ItemsDataService } from '../items-data.service';
import { MovableItem, MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { MatDividerModule } from '@angular/material/divider';
import { InstanceRowComponent } from './instance-row/instance-row.component';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategoryWithParent } from '@shared/models/category.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { filter, switchMap } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '@env/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-items-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    CommonModule,
    
    CreateOrEditItemDialogComponent,
    InstanceRowComponent,
    PageComponent,
    PageContentDirective,
    RouterLink,
  ],
})
export class ItemsItemDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataSrv = inject(ItemsDataService);

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

  loadInstances() {
    this.dataSrv.getItemInstances(this.numericItemId).subscribe(instances => this.instances = instances);
  }

  onQuickAdd() {
    this.dataSrv.addInstance(this.numericItemId).subscribe(() => this.loadInstances());
  }

  onEdit() {
    const item = this.item!;

    this.dialog.open(CreateOrEditItemDialogComponent, {  
      data: { item },
    })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(value => {
        this.dataSrv.updateItem(item.id, value)
          .subscribe(() => {
            Object.assign(item, value);
          });
      });
  }

  onDelete() {
    const item = this.item!;
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this item?`,
          message: `Are you sure you want to delete ${item.name}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataSrv.deleteItem(item.id))
    )
    .subscribe(() => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  getCategoryFullTitle(category: CategoryWithParent): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.title}` : category.title;
  }

  getImgSrc(item: MovableItem): string {
    return item.imgSrc ? `${environment.apiUrl}${item.imgSrc}` : '';
  }

  onInstanceDelete(instance: MovableItemInstance) {
    this.dataSrv.deleteInstance(this.numericItemId, instance.id).subscribe(() => this.loadInstances());
  }

  private countByStatus(status: MovableItemStatus): number {
    return this.instances?.filter(i => i.status === status).length ?? 0;
  }
}
