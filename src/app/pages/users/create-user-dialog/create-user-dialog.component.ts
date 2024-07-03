import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
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
export class CreateUserDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);
  passwordHidden: boolean = true;
  passwordConfirmationHidden: boolean = true;

  readonly userForm = new FormGroup({
    firstName: new FormControl(null, Validators.required),
    lastName: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.pattern(/^\+[0-9]+$/)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    passwordConfirmation: new FormControl(null, Validators.required),
  }, passwordMatchValidatorFactory('password', 'passwordConfirmation'));

  onSubmit() {
    this.dialogRef.close(this.userForm.value);
  }
}