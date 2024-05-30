import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { Category, CategoryWithChildren } from '@shared/models/category.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, finalize } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

export interface CreateOrEditItemDialogData {
  item?: MovableItemWithDetails;
}

@Component({
  selector: 'app-create-or-edit-item-dialog',
  templateUrl: './create-or-edit-item-dialog.component.html',
  styleUrls: ['./create-or-edit-item-dialog.component.scss'],
  standalone: true,
  providers: [ItemsDataService],
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
    MatProgressSpinnerModule,

    ReactiveFormsModule,
    CommonModule,
  ],
})
export class CreateOrEditItemDialogComponent implements OnInit {
  readonly data = inject<CreateOrEditItemDialogData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CreateOrEditItemDialogComponent>);
  readonly dataSrv = inject(ItemsDataService);
  readonly cd = inject(ChangeDetectorRef);

  readonly treeControl = new NestedTreeControl<CategoryWithChildren, number>(node => node.children, { trackBy: category => category.id });
  readonly dataSource = new MatTreeNestedDataSource<CategoryWithChildren>();

  readonly itemForm = new FormGroup({
    name: new FormControl(this.data.item?.name, Validators.required),
    description: new FormControl(this.data.item?.description),
    categoryId: new FormControl(this.data.item?.category.id, Validators.required),
    visibility: new FormControl(this.data.item?.visibility ?? true, Validators.required),
    imgSrc: new FormControl(this.data.item?.imgSrc),
  });

  uploadProgress = 0;
  uploadSubscription: Subscription | null = null;

  // categories: CategoryWithChildren[] = [];

  hasChild = (_: number, node: CategoryWithChildren) => !!node.children && node.children.length > 0;

  get title(): string {
    return this.data.item ? 'Edit Item' : 'Create Item';
  }

  get categoriesLoaded(): boolean {
    return this.dataSource.data.length > 0;
  }

  get selectedCategory(): Category | null {
    const id = this.itemForm.controls.categoryId.value;

    if (!this.dataSource.data?.length || !id) {
      return null;
    }

    return this.findCategory(id, this.dataSource.data);
  }

  get itemImgSrc(): string | null | undefined {
    return this.itemForm.controls.imgSrc.value;
  }

  ngOnInit() {
    this.loadCategories();
  }

  onSubmit() {
    if (this.itemForm.valid) {
      this.dialogRef.close(this.itemForm.value);
    }
  }

  onCategorySelect(category: CategoryWithChildren) {
    this.itemForm.controls.categoryId.setValue(category.id);
  }

  onFileChange({target}: Event) {
    this.itemForm.patchValue({imgSrc: null});

    const file = (target as HTMLInputElement).files?.[0];
    console.log(file);

    if (file) {
      this.uploadSubscription = this.dataSrv.uploadFile(file)
        .pipe(finalize(() => this.resetUpload()))
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress = Math.round(100 * event.loaded / event.loaded);
          } else if (event.type === HttpEventType.Response) {
            console.log(event.body);
            this.itemForm.patchValue({imgSrc: event.body});
            this.uploadProgress = 0;
          }
        });
    }
    
  }

  cancelUpload() {
    this.uploadSubscription?.unsubscribe();
    this.resetUpload();
  }

  private resetUpload() {
    this.uploadSubscription = null;
    this.uploadProgress = 0;
  }

  private loadCategories() {
    this.dataSrv.getCategories().subscribe(categories => {
      this.dataSource.data = categories;
      this.cd.detectChanges();
    });
  }

  private findCategory(categoryId: number, categories: CategoryWithChildren[]): CategoryWithChildren | null {
    for (const category of categories) {
      if (category.id === categoryId) {
        return category;
      }

      if (category.children) {
        const found = this.findCategory(categoryId, category.children);

        if (found) {
          return found;
        }      
      }
    }

    return null;
  }
}