import { Component, Input, inject } from '@angular/core';
import { UsersDataService } from '../users-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { User, UserEditable } from '@shared/models/user.model';
import { MovableItemStatus } from '@shared/models/movable-items.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { environment } from '@env/environment';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  standalone: true,
  providers: [UsersDataService],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,

    CommonModule,

    MoveDialogComponent,
    ConfirmationDialogComponent,

    RouterLink,
  ],
})
export class UserDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataSrv = inject(UsersDataService);

  @Input({required: true})
  set userId(value: string) {
    this.numericUserId = Number.parseInt(value, 10);
    this.loadUser();
  }

  numericUserId: number;
  user?: User;
  
  getImgSrc(src: string): string {
    return `${environment.apiUrl}${src}`;
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

  onPasswordChange() {
    this.dialog.open(ChangePasswordDialogComponent)
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.dataSrv.changePassword(this.numericUserId, result)))
      .subscribe(() => this.snackBar.open('Password changed successfully', 'Close', { duration: 2000 })); 
  }

  onEdit() {
    this.dialog.open<EditUserDialogComponent, User, UserEditable>(EditUserDialogComponent, { data: this.user })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.dataSrv.updateUser(this.numericUserId, result!)),
        tap(() => this.snackBar.open('User updated successfully', 'Close', { duration: 2000 })),
        tap(() => this.loadUser()))
      .subscribe();
  }

  onDelete() {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData>(ConfirmationDialogComponent, {
      data: {
        title: 'Delete user',
        message: 'Are you sure you want to delete this user?',
        confirmButtonText: 'Delete',
        warn: true,
      },
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(() => this.dataSrv.deleteUser(this.numericUserId)))
      .subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
    });
  }
  
  private loadUser() {
    this.dataSrv.getUser(this.numericUserId).subscribe(user => this.user = user);
  }
}