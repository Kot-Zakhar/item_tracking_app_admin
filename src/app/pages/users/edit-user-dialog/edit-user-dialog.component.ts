import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@shared/models/user.model';
import { UsersDataService } from '../users-data.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  standalone: true,
  providers: [UsersDataService],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,

    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
  ],
})
export class EditUserDialogComponent {
  readonly data = inject<User>(MAT_DIALOG_DATA) ?? {};
  readonly dialogRef = inject(MatDialogRef<EditUserDialogComponent>);
  readonly dataSrv = inject(UsersDataService);
  readonly cd = inject(ChangeDetectorRef);

  readonly userForm = new FormGroup({
    firstName: new FormControl(this.data.firstName, Validators.required),
    lastName: new FormControl(this.data.lastName, Validators.required),
    phone: new FormControl(this.data.phone, [Validators.required, Validators.pattern(/^\+[0-9]+$/)]),
  });

  onSubmit() {
    this.dialogRef.close(this.userForm.value);
  }
}