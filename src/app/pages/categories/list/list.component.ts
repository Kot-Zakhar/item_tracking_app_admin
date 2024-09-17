import { CdkTreeModule, FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { Category, CategoryWithDetailsAndChildren } from '@shared/models/category.model';
import { CategoriesDataService } from '../categories-data.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateOrEditCategoryComponent, CreateOrEditCategoryDialogData } from '../create-or-edit-category/create-or-edit-category.component';
import { filter, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDivider } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@shared/services/screen-size.service';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';


/** Flat node with expandable and level information */
interface CategoryFlatNode {
  expandable: boolean;
  level: number;
  isExpanded?: boolean;
  category: Category;
  itemsAmount: number;
}

@Component({
  selector: 'app-categories-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatTreeModule,
    CdkTreeModule,
    MatTableModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatDivider,
    CommonModule,
    CreateOrEditCategoryComponent,
    RouterModule,
    TranslateModule,
  ],
  providers: [
    CdkColumnDef,
    CategoriesDataService,
  ],
})
export class CategoriesListComponent implements OnInit {
  private readonly dataSrv = inject(CategoriesDataService);
  private readonly dialog = inject(MatDialog);
  readonly screenSize = inject(ScreenSizeService);
  
  treeControl = new NestedTreeControl<CategoryWithDetailsAndChildren, number>(node => node.children, { trackBy: details => details.category.id });
  dataSource = new MatTreeNestedDataSource<CategoryWithDetailsAndChildren>();
  loading = true;

  treeFlattener = new MatTreeFlattener<CategoryWithDetailsAndChildren, CategoryFlatNode, number>(
    (node, level) => ({
      category: node.category,
      itemsAmount: node.itemsAmount,
      expandable: !!node.children?.length,
      isExpanded: false,
      level
    }),
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  flatTreeControl = new FlatTreeControl<CategoryFlatNode, number>(
    (node) => node.level,
    (node) => node.expandable,
    { trackBy: node => node.category.id },
  );
  flatDataSource = new MatTreeFlatDataSource(this.flatTreeControl, this.treeFlattener);

  hasChild = (_: number, node: CategoryWithDetailsAndChildren) => !!node.children && node.children.length > 0;
  
  flatHasChild = (_: number, node: CategoryFlatNode) => node.expandable;
  
  getParentNode(nodes: CategoryWithDetailsAndChildren[], childNode: CategoryFlatNode, nesting: number): CategoryFlatNode | undefined {
    if (childNode.level === nesting)
      return undefined;

    let parent: CategoryWithDetailsAndChildren | undefined;

    if (childNode.level === nesting + 1) {
      parent = nodes.find(node => node.children?.some(child => child.category.id === childNode.category.id));
    }

    if (childNode.level > nesting + 1) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].children?.length) {
          parent = this.getParentNode(nodes[i].children!, childNode, nesting + 1);
          if (parent) break;
        }
      }
    }

    return this.flatTreeControl.dataNodes.find(flatNode => flatNode.category.id === parent?.category.id);
  }

  shouldRender(node: CategoryFlatNode) {
    const parent = this.getParentNode(this.dataSource.data, node, 0);
    return !parent || this.flatTreeControl.isExpanded(parent);
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onDeleteCategoryClick(category: Category) {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: 'Delete category?',
          message: `Are you sure you want to delete category "${category.title}"?`,
          confirmButtonText: 'Delete',
          warn: true,
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
      this.flatDataSource.data = categories;
      this.loading = false;
    });
  }
}
