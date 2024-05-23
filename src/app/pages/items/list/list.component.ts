import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { TitleCasePipe } from '@angular/common';
import { filter, switchMap, tap } from 'rxjs';

import { Category } from '@shared/models/category.model';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from './create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { MovableItem } from '@shared/models/movable-items.model';
import { EmrAvatarModule } from '@elementar/components';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('confirmationDialog', { read: TemplateRef})
  deleteConfirmationTemplate: TemplateRef<any>;

  displayedColumns = ['item', 'category', 'availability', 'bookedBy', 'takenBy', 'actions'];

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

  edit(item: MovableItemWithDetails) {
    this.dialog.open(CreateOrEditItemDialogComponent, {  
      data: {
        item,
        categories: this.categories,
      },
    })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(value => {
        this.dataSrv.updateItem(item.id, value)
          .subscribe(() => {
            Object.assign(item, value);
          });
      });
  }

  delete(item: MovableItemWithDetails) {
    this.dialog.open(
      this.deleteConfirmationTemplate, {
        data: {
          action: 'delete',
          item,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataSrv.deleteItem(item.id))
    )
    .subscribe(() => {
      this.items = this.items.filter(i => i.id !== item.id);
    });
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

  getCategoryFullTitle(category: Category): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.title}` : category.title;
  }
}
