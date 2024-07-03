import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LocationsDataService } from '../locations-data.service';
import { Location } from '@shared/models/location.model';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { filter, switchMap } from 'rxjs';
import { LocationPipe } from '@shared/pipes/location.pipe';
import { CreateOrEditLocationDialogComponent } from '../create-or-edit-location-dialog/create-or-edit-location-dialog.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  standalone: true,
  providers: [LocationsDataService],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,

    ConfirmationDialogComponent,
    CreateOrEditLocationDialogComponent,
    LocationPipe,

    CommonModule,
    TranslateModule,

    RouterLink,
  ],
})
export class LocationDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly dataService = inject(LocationsDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  @Input({required: true}) 
  set locationId(value: string) {
    this.id = Number.parseInt(value, 10);
    this.loadLocation();
  }

  id: number;
  location?: Location;

  getImgSrc(src: string): string {
    return `${environment.apiUrl}${src}`;
  }

  getQrCodeSrc(location: Location): string {
    return `${environment.apiUrl}/qr/location/${location.id}`;
  }

  onEdit() {
    this.dialog.open(CreateOrEditLocationDialogComponent, {
      data: { location: this.location },
    })
    .afterClosed()
    .pipe(filter(value => !!value))
    .subscribe(value => {
      return this.dataService.updateLocation(this.location!.id, value).subscribe(() => {
        Object.assign(location, value);
      })
    });
  }

  onDelete() {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData>(ConfirmationDialogComponent, {
      data: {
        title: 'Delete location',
        message: 'Are you sure you want to delete this location?',
        confirmButtonText: 'Delete',
        warn: true,
      },
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(() => this.dataService.deleteLocation(this.id)))
      .subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  private loadLocation() {
    this.dataService.getLocationById(this.id).subscribe(location => this.location = location);
  }
}