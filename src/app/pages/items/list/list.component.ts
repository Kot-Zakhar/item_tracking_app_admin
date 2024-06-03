import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, tap } from 'rxjs';

import { EmrAvatarModule } from '@elementar/components';
import { Category, CategoryWithParent } from '@shared/models/category.model';
import { MovableItem } from '@shared/models/movable-items.model';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { environment } from '@env/environment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';

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
    RouterModule,
    CreateOrEditItemDialogComponent,
    EmrAvatarModule,
    TitleCasePipe,
  ]
})
export class ItemsListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(ItemsDataService);
  private readonly dialog = inject(MatDialog);
  readonly dataSource = new MatTableDataSource<MovableItemWithDetails>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['item', 'category', 'availability', 'bookedBy', 'takenBy'];

  categories: Category[] = [];

  isLoading = true;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.loadData();
    this.dataSrv.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getItems()
      .pipe(tap(() => this.isLoading = false))
      .subscribe(data => this.dataSource.data = data);
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

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    let getter = (item: MovableItemWithDetails) => (item as any)[sort.active];

    if (sort.active === 'category') {
      getter = item => this.getCategoryFullTitle(item.category);
    }

    if (sort.active === 'item') {
      getter = item => item.name;
    }

    if (sort.active === 'availability') {
      getter = item => item.instancesCount;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aValue = getter(a);
      const bValue = getter(b);

      if (typeof(aValue) === 'string' && typeof(bValue) === 'string') {
        return String(aValue).localeCompare(String(bValue), undefined, { caseFirst: 'false'}) * (sort.direction === 'asc' ? 1 : -1);
      }

      return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }
}
