import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, tap } from 'rxjs';

import { EmrAvatarModule } from '@elementar/components';
import { Category, CategoryWithChildren, CategoryWithParent } from '@shared/models/category.model';
import { MovableItem } from '@shared/models/movable-items.model';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { environment } from '@env/environment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-items-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatTreeModule,

    RouterModule,
    CreateOrEditItemDialogComponent,
    EmrAvatarModule,
    CommonModule,
    TitleCasePipe,
  ]
})
export class ItemsListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(ItemsDataService);
  private readonly dialog = inject(MatDialog);
  readonly dataSource = new MatTableDataSource<MovableItemWithDetails>();

  readonly categoryTreeControl = new NestedTreeControl<CategoryWithChildren, number>(node => node.children, { trackBy: category => category.id });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['item', 'category', 'availability', 'bookedBy', 'takenBy'];

  categories: Category[] = [];
  items: MovableItemWithDetails[] = [];
  
  selectedCategory: Category | null = null;
  isLoading = true;

  hasChild = (_: number, node: CategoryWithChildren) => !!node.children && node.children.length > 0;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.filterPredicate.bind(this);
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  ngOnInit() {
    this.loadData();
    this.loadCategories();
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getItems()
      .pipe(tap(() => this.isLoading = false))
      .subscribe(data => {
        this.items = data;
        return this.dataSource.data = data;
      });
  }

  loadCategories() {
    this.dataSrv.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    if (!value) {
      this.dataSource.filter = '';
      return;
    }

    this.dataSource.filter = value.trim().toLowerCase();
  }

  onNewItemClick() {
    this.dialog.open<CreateOrEditItemDialogComponent, { categories: Category[] }, MovableItem>
    (CreateOrEditItemDialogComponent, {
      data: {
        categories: this.categories,
      },
    })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe((value) => {
        this.dataSrv.createItem(value!)
          .subscribe(item => {
            // this.items.push(item as MovableItemWithDetails);
            this.loadData();
          });
      });
  }

  getCategoryFullTitle(category: CategoryWithParent): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.title}` : category.title;
  }

  getItemImgSrc(item: MovableItem): string {
    return item.imgSrc ? `${environment.apiUrl}${item.imgSrc}` : '';
  }

  sortingDataAccessor(data: MovableItemWithDetails, sortHeaderId: string): string | number {
    switch (sortHeaderId) {
      case 'category':
        return this.getCategoryFullTitle(data.category).toLowerCase();
      case 'item':
        return data.name.toLowerCase();
      case 'availability':
        return data.instancesCount;
      default:
        return (data as any)[sortHeaderId];
    }
  }

  filterPredicate(data: MovableItemWithDetails, filter: string): boolean {
    if (!filter) {
      return true;
    }

    return data.name.toLowerCase().includes(filter) || data.description?.toLowerCase().includes(filter);
  }

  onCategorySelect(selectedCategory: Category | null) {
    if (!selectedCategory) {
      this.selectedCategory = null;
      this.dataSource.data = this.items;
      return;
    }

    this.selectedCategory = selectedCategory;

    this.dataSource.data = this.items.filter(item => this.categoryFilterPredicate(selectedCategory, item.category));
  }

  private categoryFilterPredicate(selectedCategory: Category, testingCategory: CategoryWithParent): boolean {
    return selectedCategory.id === testingCategory.id
      || (!!testingCategory.parent && this.categoryFilterPredicate(selectedCategory, testingCategory.parent));
  }
}
