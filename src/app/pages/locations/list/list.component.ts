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
import { CreateOrEditLocationDialogComponent } from '../create-or-edit-location-dialog/create-or-edit-location-dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { environment } from '@env/environment';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { LocationPipe } from '@shared/pipes/location.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@shared/services/screen-size.service';
import { AsyncPipe } from '@angular/common';
import { DownloadService } from '@shared/services/download.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  standalone: true,
  providers: [
    LocationsDataService,
    LocationPipe,
    DownloadService,
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
    TranslateModule,
    AsyncPipe,
  ]
})
export class LocationsListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(LocationsDataService)
  private readonly dialog = inject(MatDialog);
  private readonly downloadService = inject(DownloadService);
  private readonly locationSerializer = inject(LocationPipe);
  readonly screenSize = inject(ScreenSizeService);
  readonly dataSource = new MatTableDataSource<LocationWithDetails>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  withAssociatedItems = false;
  displayedColumns = ['title', 'floor', 'department', 'itemsAmount', 'actions'];

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

    return this.locationSerializer.transform(data).toLowerCase().includes(search.toLowerCase()) ||
      data.department.toLowerCase().includes(search.toLowerCase());
  }

  sortingDataAccessor(data: LocationWithDetails, sortHeaderId: string): string | number {
    if (sortHeaderId === 'itemsAmount') {
      return data.itemsAmount;
    }

    return (data as any)[sortHeaderId];
  }

  getQrHref(location: LocationWithDetails): string {
    return `${environment.apiUrl}/qr/location/${location.id}`;
  }

  downloadLocationQrCode(location: LocationWithDetails) {
    this.dataSrv.getLocationQrCode(location.id)
      .subscribe(blob => this.downloadService.downloadFile(blob, `location-${location.code}.png`));
  }

  edit(location: LocationWithDetails) {
    this.dialog.open(CreateOrEditLocationDialogComponent, {
      data: { location },
    })
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(value => this.dataSrv.updateLocation(location.id, value))
    )
    .subscribe(() => this.loadData());
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
          message: `Are you sure you want to delete ${location.name}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataSrv.deleteLocation(location.id))
    )
    .subscribe(() => {
      this.dataSource.data = this.dataSource.data.filter(i => i.id !== location.id);
    });
  }
}