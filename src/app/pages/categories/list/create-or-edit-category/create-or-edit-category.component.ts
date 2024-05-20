import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '@shared/models/category.model';

export interface CreateOrEditCategoryDialogData {
  category?: Category;
  parentCategory?: Category;
}

@Component({
  selector: 'app-create-or-edit-category',
  templateUrl: './create-or-edit-category.component.html',
  styleUrls: ['./create-or-edit-category.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class CreateOrEditCategoryComponent {
  readonly data = inject<CreateOrEditCategoryDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditCategoryComponent>);

  readonly categoryForm = new FormGroup({
    title: new FormControl(this.data.category?.title, Validators.required),
    parentId: new FormControl(this.data.parentCategory?.id),
  });

  get title(): string {
    var title = this.data.category ? 'Edit ' : 'Create ';
    title += this.data.parentCategory ? `Subcategory of ${this.data.parentCategory.title}` : 'Category';
    return title;
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }

  onCancel(): void {
    this.categoryForm.reset();
    this.dialogRef.close();
  }
}