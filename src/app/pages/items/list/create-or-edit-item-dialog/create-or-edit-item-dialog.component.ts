import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MovableItemWithDetails } from '../../items-data.service';
import { CategoryWithChildren } from '@shared/models/category.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';

export interface CreateOrEditItemDialogData {
  item?: MovableItemWithDetails;
  categories: CategoryWithChildren[];
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
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatTreeModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class CreateOrEditItemDialogComponent implements OnInit {
  readonly data = inject<CreateOrEditItemDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditItemDialogComponent>);

  readonly treeControl = new NestedTreeControl<CategoryWithChildren, number>(node => node.children, { trackBy: category => category.id });
  readonly dataSource = new MatTreeNestedDataSource<CategoryWithChildren>();

  readonly itemForm = new FormGroup({
    name: new FormControl(this.data.item?.name, Validators.required),
    description: new FormControl(this.data.item?.description),
    categoryId: new FormControl(this.data.item?.category.id, Validators.required),
    visibility: new FormControl(this.data.item?.visibility ?? true, Validators.required),
  });

  selectedCategory = this.data.categories.find(category => category.id === this.data.item?.category.id);

  hasChild = (_: number, node: CategoryWithChildren) => !!node.children && node.children.length > 0;

  get title(): string {
    return this.data.item ? 'Edit Item' : 'Create Item';
  }

  get categories(): CategoryWithChildren[] {
    return this.data.categories;
  }

  ngOnInit(): void {
    this.dataSource.data = this.data.categories;
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }

  onCategorySelect(category: CategoryWithChildren): void {
    this.itemForm.controls.categoryId.setValue(category.id);
    this.selectedCategory = category;
  }
}