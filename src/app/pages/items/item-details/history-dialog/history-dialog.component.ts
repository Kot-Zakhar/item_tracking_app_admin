import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MovableItemInstance, MovableItemInstanceHistoryRecord } from '@shared/models/movable-items.model';
import { ItemsDataService } from '../../items-data.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { EmrAvatarModule } from '@elementar/components';

@Component({
  selector: 'app-history-dialog',
  templateUrl: './history-dialog.component.html',
  standalone: true,
  providers: [ItemsDataService],
  imports: [
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    EmrAvatarModule,

    DatePipe,
  ],
})
export class HistoryDialogComponent implements OnInit, AfterViewInit {
  private readonly dataService = inject<ItemsDataService>(ItemsDataService);
  
  readonly instance = inject<MovableItemInstance>(MAT_DIALOG_DATA);
  readonly dataSource = new MatTableDataSource<MovableItemInstanceHistoryRecord>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.dataService.getInstanceHistory(this.instance.movableItemId, this.instance.id).subscribe(history => {
      this.dataSource.data = history;
    })
  }
  
}