import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { LocationsDataService } from '../locations-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { LocationWithDetails } from '@shared/models/location.model';
import { filter, switchMap } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CreateOrEditLocationDialogComponent } from './create-or-edit-location-dialog/create-or-edit-location-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { environment } from '@env/environment';

@Component({
  selector: 'app-locations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  providers: [
    LocationsDataService,
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    RouterModule,
  ]
})
export class LocationsListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(LocationsDataService)
  private readonly dialog = inject(MatDialog);
  readonly dataSource = new MatTableDataSource<LocationWithDetails>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  displayedColumns = ['title', 'floor', 'code', 'itemsAmount', 'actions'];

  isLoading = true;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getLocations()
      .subscribe(data => {
        this.dataSource.data = data;
        this.sortData({active: this.sort?.active, direction: this.sort?.direction});
        this.isLoading = false;
      });
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    let getter = (location: LocationWithDetails) => (location.location as any)[sort.active];

    if (sort.active === 'itemsAmount') {
      getter = location => location.itemsAmount;
    }

    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      const aValue = getter(a);
      const bValue = getter(b);
      return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
    });
  }

  getQrHref(location: LocationWithDetails): string {
    return `${environment.apiUrl}/qr/location/${location.location.id}`;
  }

  edit(location: LocationWithDetails) {
    this.dialog.open(CreateOrEditLocationDialogComponent, {
      data: { location: location.location },
    })
    .afterClosed()
    .pipe(filter(value => !!value))
    .subscribe(value => {
      return this.dataSrv.updateLocation(location.location.id, value).subscribe(() => {
        Object.assign(location, value);
      })
    });
  }

  create() {
    this.dialog.open(CreateOrEditLocationDialogComponent)
      .afterClosed()
      .pipe(
        filter(value => !!value),
        switchMap(value => this.dataSrv.createLocation(value))
      )
      .subscribe(() => this.loadData());
  }
  

  delete(location: LocationWithDetails) {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this location?`,
          message: `Are you sure you want to delete ${location.location.title}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataSrv.deleteLocation(location.location.id))
    )
    .subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(i => i.location.id !== location.location.id);
    });
  }
}