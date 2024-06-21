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
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { LocationPipe } from '@shared/pipes/location.pipe';

@Component({
  selector: 'app-locations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  providers: [
    LocationsDataService,
    LocationPipe,
  ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatDividerModule,
    MatButtonToggleModule,
    RouterModule,
    LocationPipe,
  ]
})
export class LocationsListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(LocationsDataService)
  private readonly dialog = inject(MatDialog);
  private readonly locationSerializer = inject(LocationPipe);
  readonly dataSource = new MatTableDataSource<LocationWithDetails>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  withAssociatedItems = false;
  displayedColumns = ['title', 'floor', 'itemsAmount', 'actions'];

  isLoading = true;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
    this.dataSource.filterPredicate = this.searchPredicate.bind(this);
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getLocations(this.withAssociatedItems)
      .subscribe(data => {
        this.dataSource.data = data;
        this.isLoading = false;
      });
  }

  onWithAssociatedItemsChange(event: MatButtonToggleChange) {
    this.withAssociatedItems = event.value;
    this.loadData();
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    
    if (!value) {
      this.dataSource.filter = '';
      return;
    }

    this.dataSource.filter = value.trim().toLowerCase();
  }

  searchPredicate(data: LocationWithDetails, search: string): boolean {
    if (!search) {
      return true;
    }

    return this.locationSerializer.transform(data.location).toLowerCase().includes(search.toLowerCase());
  }

  sortingDataAccessor(data: LocationWithDetails, sortHeaderId: string): string | number {
    if (sortHeaderId === 'itemsAmount') {
      return data.itemsAmount;
    }

    return (data.location as any)[sortHeaderId];
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