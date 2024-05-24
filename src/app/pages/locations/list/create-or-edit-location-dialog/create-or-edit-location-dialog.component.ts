import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Room as Location } from '@shared/models/room.model';

 @Component({
  selector: 'app-create-or-edit-location-dialog',
  templateUrl: './create-or-edit-location-dialog.component.html',
  styleUrls: ['./create-or-edit-location-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class CreateOrEditLocationDialogComponent {
  readonly data = inject<{location: Location}>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditLocationDialogComponent>);

  readonly locationForm = new FormGroup({
    title: new FormControl(this.data?.location?.title, Validators.required),
    floor: new FormControl(this.data?.location?.floor, Validators.required),
  });

  get title(): string {
    return this.data?.location ? 'Edit Location' : 'Create Location';
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    }
  }
}