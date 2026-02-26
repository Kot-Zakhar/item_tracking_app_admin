import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { User } from '@shared/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { AvatarComponent } from '@elementar-ui/components/avatar';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-assign-dialog',
  templateUrl: './assign-dialog.component.html',
  styleUrls: ['./assign-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    AvatarComponent,
    TranslateModule,
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