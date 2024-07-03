import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { passwordMatchValidatorFactory } from '@shared/validators/password-match.validator';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  standalone: true,
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
export class ChangePasswordDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);

  readonly passwordForm = new FormGroup({
    newPassword: new FormControl(null, Validators.required),
    newPasswordConfirmation: new FormControl(null, Validators.required),
  }, passwordMatchValidatorFactory('newPassword', 'newPasswordConfirmation'));

  passwordHidden: boolean = true;
  passwordConfirmationHidden: boolean = true;

  onSubmit() {
    this.dialogRef.close(this.passwordForm.value);
  }
}