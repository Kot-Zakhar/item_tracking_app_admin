import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { Location } from '@shared/models/location.model';

@Component({
  selector: 'app-move-dialog',
  templateUrl: './move-dialog.component.html',
  styleUrls: ['./move-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatListModule,
    MatButtonModule,
  ],
})
export class MoveDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MoveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public locations: Location[]
  ) { }

  selectLocation(location: Location) {
    this.dialogRef.close(location);
  }
}