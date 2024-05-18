import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { filter, tap } from 'rxjs';

import { Category } from '@shared/models/category.model';
import { ItemsDataService, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from './create-or-edit-item-dialog/create-or-edit-item-dialog.component';

@Component({
  selector: 'app-items-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,

    RouterModule,

    CreateOrEditItemDialogComponent,
  ],
  providers: [ItemsDataService],
})
export class ItemsListComponent implements OnInit {
  private readonly dataSrv = inject(ItemsDataService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  displayedColumns = ['item', 'category', 'availability', 'visibility', 'bookedBy', 'takenBy', 'actions'];

  items: MovableItemWithDetails[] = [];
  categories: Category[] = [];

  isLoading = true;

  ngOnInit() {
    this.dataSrv.getItems()
      .pipe(tap(() => this.isLoading = false))
      .subscribe(data => this.items = data);
    this.dataSrv.getCategories()
      .subscribe(categories => this.categories = categories);
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
    this.dataSrv.deleteItem(item.id)
      .subscribe(() => {
        this.items = this.items.filter(i => i.id !== item.id);
      });
  }
}
