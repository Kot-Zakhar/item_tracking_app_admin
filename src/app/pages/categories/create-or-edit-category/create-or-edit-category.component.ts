import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IconPickerComponent } from '@shared/components/icon-picker/icon-picker.component';
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
    TranslateModule,
    
    IconPickerComponent,
  ],
})
export class CreateOrEditCategoryComponent {
  readonly data = inject<CreateOrEditCategoryDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditCategoryComponent>);
  readonly translateService = inject(TranslateService);

  readonly categoryForm = new FormGroup({
    title: new FormControl(this.data.category?.title, Validators.required),
    parentId: new FormControl(this.data.parentCategory?.id),
    icon: new FormControl<string | null>(this.data.category?.icon || null),
  });

  get title(): string {
    var title = this.data.category
      ? this.translateService.instant('common.actionVerbs.edit')
      : this.translateService.instant('common.actionVerbs.create');

    title += ' ';

    title += this.data.parentCategory
      ? this.translateService.instant('categories.subcategoryOfTitle', { title: this.data.parentCategory.title })
      : this.translateService.instant('domain.category');
    return title;
  }

  onIconSelect(icon: string | null) {
    this.categoryForm.patchValue({ icon });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.dialogRef.close(this.categoryForm.value);
    }
  }
}