import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, switchMap, tap } from 'rxjs';

import { EmrAvatarModule } from '@elementar/components';
import { Category, CategoryWithParent } from '@shared/models/category.model';
import { MovableItem } from '@shared/models/movable-items.model';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '@env/environment';

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
    RouterModule,
    CreateOrEditItemDialogComponent,
    EmrAvatarModule,
    TitleCasePipe,
  ]
})
export class ItemsListComponent implements OnInit {
  private readonly dataSrv = inject(ItemsDataService);
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['item', 'category', 'availability', 'bookedBy', 'takenBy'];

  items: MovableItemWithDetails[] = [];
  categories: Category[] = [];

  isLoading = true;

  ngOnInit() {
    this.loadData();
    this.dataSrv.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getItems()
      .pipe(tap(() => this.isLoading = false))
      .subscribe(data => this.items = data);
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
}
