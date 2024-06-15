import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { EmrAvatarModule } from '@elementar/components';
import { filter } from 'rxjs';

import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ItemsDataService } from '../../items-data.service';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { environment } from '../../../../../environments/environment';
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';

@Component({
  selector: 'app-instance-row',
  templateUrl: './instance-row.component.html',
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatBadgeModule,
    RouterLink,
    EmrAvatarModule,
  ]
})
export class InstanceRowComponent {
  @Input({required: true})
  instance!: MovableItemInstance;

  @Output()
  onInstanceDelete = new EventEmitter<void>();

  movableItemStatus = MovableItemStatus;

  constructor(
    private dataService: ItemsDataService,
    private dialog: MatDialog,
  ) { }
  
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
      width: '600px',
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

  move(instance: MovableItemInstance) {
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

  delete(instance: MovableItemInstance) {
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
      this.onInstanceDelete.emit();
    });
  }
}