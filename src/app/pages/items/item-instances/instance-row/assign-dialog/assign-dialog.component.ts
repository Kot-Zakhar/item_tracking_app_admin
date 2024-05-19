import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from '@shared/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { EmrAvatarModule } from '@elementar/components';


@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    EmrAvatarModule,
  ],
})
export class AssignDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public users: User[]
  ) { }

  selectUser(user: User) {
    this.dialogRef.close(user);
  }
}