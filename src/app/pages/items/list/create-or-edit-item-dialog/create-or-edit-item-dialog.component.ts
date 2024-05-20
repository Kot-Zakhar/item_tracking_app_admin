import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MovableItemWithDetails } from '../../items-data.service';
import { Category } from '@shared/models/category.model';
import { MatCheckboxModule } from '@angular/material/checkbox';

export interface CreateOrEditItemDialogData {
  item?: MovableItemWithDetails;
  categories: Category[];
}

@Component({
  selector: 'app-create-or-edit-item-dialog',
  templateUrl: './create-or-edit-item-dialog.component.html',
  styleUrls: ['./create-or-edit-item-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
})
export class CreateOrEditItemDialogComponent {
  readonly data = inject<CreateOrEditItemDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditItemDialogComponent>);

  readonly itemForm = new FormGroup({
    name: new FormControl(this.data.item?.name, Validators.required),
    description: new FormControl(this.data.item?.description),
    categoryId: new FormControl(this.data.item?.category.id, Validators.required),
    visibility: new FormControl(this.data.item?.visibility ?? true, Validators.required),
  });

  get title(): string {
    return this.data.item ? 'Edit Item' : 'Create Item';
  }

  get categories(): Category[] {
    return this.data.categories;
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }

  onCancel(): void {
    this.itemForm.reset();
    this.dialogRef.close();
  }
}