import { Component, inject } from '@angular/core';
import { LocationsDataService } from '../locations-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Room as Location } from '@shared/models/room.model';
import { filter, switchMap } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CreateOrEditLocationDialogComponent } from './create-or-edit-location-dialog/create-or-edit-location-dialog.component';

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
    MatTooltipModule,
    RouterModule,
  ]
})
export class LocationsListComponent {
  private readonly dataSrv = inject(LocationsDataService)
  private readonly dialog = inject(MatDialog);

  displayedColumns = ['title', 'floor', 'code', 'actions'];

  locations: Location[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.dataSrv.getLocations()
      .subscribe(data => {
        this.locations = data;
        this.isLoading = false;
      });
  }

  edit(location: Location) {
    this.dialog.open(CreateOrEditLocationDialogComponent, {
      data: { location },
    })
    .afterClosed()
    .pipe(filter(value => !!value))
    .subscribe(value => {
      return this.dataSrv.updateLocation(location.id, value).subscribe(() => {
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
  

  delete(location: Location) {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this location?`,
          message: `Are you sure you want to delete ${location.title}?`,
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
      this.locations = this.locations.filter(i => i.id !== location.id);
    });
  }
}