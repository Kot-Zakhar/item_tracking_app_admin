import { Component, Input, ViewChild, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ThemePalette } from '@angular/material/core';
import { filter, switchMap } from 'rxjs';

import { environment } from '@env/environment';
import { PageComponent } from '@meta/page/page.component';
import { PageContentDirective } from '@meta/page/page-content.directive';
import { MovableItem, MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { CategoryWithParent } from '@shared/models/category.model';
import { ItemsDataService } from '../items-data.service';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { EmrAvatarModule } from '@elementar/components';

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
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    CommonModule,
    
    EmrAvatarModule,
    CreateOrEditItemDialogComponent,
    PageComponent,
    PageContentDirective,
    RouterLink,
  ],
})
export class ItemsItemDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(ItemsDataService);

  readonly movableItemStatus = MovableItemStatus;
  readonly dataSource = new MatTableDataSource<MovableItemInstance>();
  readonly displayedColumns = ['title', 'location', 'status', 'user', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input({required: true})
  set itemId(value: string) {
    this.numericItemId = Number.parseInt(value, 10);
    this.dataService.getItem(this.numericItemId).subscribe(item => this.item = item);
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


  loadInstances() {
    this.dataService.getItemInstances(this.numericItemId)
      .subscribe(instances => this.dataSource.data = instances);
  }

  onQuickAdd() {
    this.dataService.addInstance(this.numericItemId).subscribe(() => this.loadInstances());
  }

  onEdit() {
    const item = this.item!;

    this.dialog.open(CreateOrEditItemDialogComponent, {  
      data: { item },
    })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(value => {
        this.dataService.updateItem(item.id, value)
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
      switchMap(() => this.dataService.deleteItem(item.id))
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

  stringifyStatus(status: MovableItemStatus): string {
    switch (status) {
      case MovableItemStatus.Available:
        return 'Available';
      case MovableItemStatus.Booked:
        return 'Booked';
      case MovableItemStatus.Taken:
        return 'Taken';
    }
  }

  getStatusColor(status: MovableItemStatus): ThemePalette {
    switch (status) {
      case MovableItemStatus.Available:
        return 'primary';
      case MovableItemStatus.Booked:
        return 'accent';
      case MovableItemStatus.Taken:
        return 'warn';
    }
  }

  getInstanceQrCodeUrl(instance: MovableItemInstance): string {
    return `${environment.apiUrl}/qr/instance/${instance.id}`;
  }

  openHistoryModal(instance: MovableItemInstance) {
    this.dialog.open(HistoryDialogComponent, {
      data: instance,
      width: '700px',
    });
  }

  assignInstance(instance: MovableItemInstance) {
    this.dataService.getUsers()
      .subscribe(users => this.dialog
        .open(AssignDialogComponent, { data: users })
        .afterClosed()
        .pipe(filter(user => !!user))
        .subscribe(user => this.dataService
          .assignInstance(instance.id, user.id).subscribe(() => {
            instance.user = user;
            instance.status = MovableItemStatus.Taken;
            instance.location = undefined;
          })
        )
      );
  }

  cancelBooking(instance: MovableItemInstance) {
    // this.materoDialog.confirm(
    //   'Cancel Booking', 
    //   'Are you sure to cancel the booking?',
    //   () => this.dataService.cancelBooking(instance.id).subscribe(() => {
    //     instance.status = MovableItemStatus.Available;
    //     instance.user = undefined;
    //   })
    // );
    this.unassignInstance(instance);
  }

  unassignInstance(instance: MovableItemInstance) {
    this.dataService.getLocations().subscribe(locations => {
      this.dialog
        .open(MoveDialogComponent, { data: locations })
        .afterClosed()
        .subscribe(location => {
          if (location) {
            this.dataService.unassignInstance(instance.id, location.id).subscribe(() => {
              instance.location = location;
              instance.user = undefined;
              instance.status = MovableItemStatus.Available;
            });
          }
        });
    });
  }

  moveInstance(instance: MovableItemInstance) {
    this.dataService.getLocations().subscribe(locations => {
      this.dialog
        .open(MoveDialogComponent, { data: locations })
        .afterClosed()
        .subscribe(location => {
          if (location) {
            this.dataService.moveInstance(instance.id, location.id).subscribe(() => {
              instance.location = location;
            });
          }
        });
    });
  }

  deleteInstance(instance: MovableItemInstance) {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this instance?`,
          message: `Are you sure you want to delete ${instance.name}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
    )
    .subscribe(() => {
      this.dataService.deleteInstance(this.numericItemId, instance.id).subscribe(() => this.loadInstances());
    });
  }

  private countByStatus(status: MovableItemStatus): number {
    return this.dataSource.data?.filter(i => i.status === status).length ?? 0;
  }
}
