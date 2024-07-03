import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Location } from '@shared/models/location.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
  ],
})
export class CreateOrEditLocationDialogComponent {
  readonly data = inject<{location: Location}>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditLocationDialogComponent>);
  readonly translateService = inject(TranslateService);

  readonly locationForm = new FormGroup({
    title: new FormControl(this.data?.location?.title, Validators.required),
    floor: new FormControl(this.data?.location?.floor, Validators.required),
  });

  get title(): string {
    return this.data?.location
      ? this.translateService.instant('locations.actions.editLocation')
      : this.translateService.instant('locations.actions.createLocation');
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    }
  }
}