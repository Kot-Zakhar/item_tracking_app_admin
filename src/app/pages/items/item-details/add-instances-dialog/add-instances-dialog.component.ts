import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { Location } from '@shared/models/location.model';
import { LocationPipe } from '@shared/pipes/location.pipe';


@Component({
  selector: 'app-add-instances-dialog',
  templateUrl: './add-instances-dialog.component.html',
  styleUrls: ['./add-instances-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
    LocationPipe,
  ],
})
export class AddInstancesDialogComponent {
  readonly data = inject<{locations: Location[]}>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AddInstancesDialogComponent>);

  readonly instancesForm = new FormGroup({
    title: new FormControl(null),
    amount: new FormControl(1, [Validators.required, Validators.min(1)]),
    locationId: new FormControl(null),
  })


  onSubmit(): void {
    if (this.instancesForm.valid) {
      this.dialogRef.close(this.instancesForm.value);
    }
  }
}