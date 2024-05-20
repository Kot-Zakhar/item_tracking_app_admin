import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { Category } from '@shared/models/category.model';
import { CategoriesDataService } from '../categories-data.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateOrEditCategoryComponent, CreateOrEditCategoryDialogData } from './create-or-edit-category/create-or-edit-category.component';
import { filter, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatTreeModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    CreateOrEditCategoryComponent,
  ],
  providers: [
    CategoriesDataService,
  ],
})
export class CategoriesListComponent implements OnInit {
  private readonly dataSrv = inject(CategoriesDataService);
  private readonly dialog = inject(MatDialog);
  
  @ViewChild('confirmationDialog', { read: TemplateRef})
  deleteConfirmationTemplate: TemplateRef<any>;
  
  treeControl = new NestedTreeControl<Category, number>(node => node.children, { trackBy: category => category.id });
  dataSource = new MatTreeNestedDataSource<Category>();
  loading = true;

  hasChild = (_: number, node: Category) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    this.loadCategories();
  }

  onDeleteCategoryClick(category: Category) {
    this.dialog.open(
      this.deleteConfirmationTemplate, {
        data: { 
          action: 'delete',
          category,
        },
      }
    )
    .afterClosed()
    .pipe(
      filter(confirm => !!confirm),
      switchMap(() => this.dataSrv.deleteCategory(category.id)),
    )
    .subscribe(() => this.loadCategories());
  }

  onEditCategoryClick(category: Category) {
    // Bug: need to pass parent category to show proper title
    this.dialog.open<CreateOrEditCategoryComponent, CreateOrEditCategoryDialogData, Category>(
      CreateOrEditCategoryComponent, {
        data: { category },
      },
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(newValue => this.dataSrv.updateCategory(category.id, newValue!)),
    )
    .subscribe(() => this.loadCategories());
  }

  onNewCategoryClick(parentCategory?: Category) {
    this.dialog.open<CreateOrEditCategoryComponent, CreateOrEditCategoryDialogData, Category>(
      CreateOrEditCategoryComponent, {
        data: { parentCategory },
      },
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(category => this.dataSrv.createCategory(category!)),
    )
    .subscribe(() => this.loadCategories());
  }

  private loadCategories() {
    this.loading = true;
    this.dataSrv.getCategories().subscribe(categories => {
      this.dataSource.data = categories;
      this.loading = false;
    });
  }
}