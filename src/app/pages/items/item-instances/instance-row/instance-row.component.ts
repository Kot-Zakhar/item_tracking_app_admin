import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { ItemsDataService } from '../../items-data.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { environment } from '../../../../../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { EmrAvatarModule } from '@elementar/components';

@Component({
    selector: 'app-instance-row',
    templateUrl: './instance-row.component.html',
    styleUrls: ['./instance-row.component.scss'],
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

  assignInstance(instance: MovableItemInstance) {
    this.dataService.getUsers().subscribe(users => {
      this.dialog
        .open(AssignDialogComponent, { data: users })
        .afterClosed()
        .subscribe(user => {
          if (user) {
            this.dataService.assignInstance(instance.id, user.id).subscribe(() => {
              instance.user = user;
              instance.status = MovableItemStatus.Taken;
              instance.room = undefined;
            });
          }
        });
    });
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
  }

  unassignInstance(instance: MovableItemInstance) {
    this.dataService.getRooms().subscribe(rooms => {
      this.dialog
        .open(MoveDialogComponent, { data: rooms })
        .afterClosed()
        .subscribe(room => {
          if (room) {
            this.dataService.unassignInstance(instance.id, room.id).subscribe(() => {
              instance.room = room;
              instance.user = undefined;
              instance.status = MovableItemStatus.Available;
            });
          }
        });
    });
  }

  move(instance: MovableItemInstance) {
    this.dataService.getRooms().subscribe(rooms => {
      this.dialog
        .open(MoveDialogComponent, { data: rooms })
        .afterClosed()
        .subscribe(room => {
          if (room) {
            this.dataService.moveInstance(instance.id, room.id).subscribe(() => {
              instance.room = room;
            });
          }
        });
    });
  }
}