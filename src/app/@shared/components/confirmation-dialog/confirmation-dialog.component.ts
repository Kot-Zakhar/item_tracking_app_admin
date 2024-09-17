import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

export interface ConfirmationDialogData {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  warn?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
  ]
})
export class ConfirmationDialogComponent<T extends ConfirmationDialogData> {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent<T>>,
    @Inject(MAT_DIALOG_DATA) public data: T,
  ) { }
}
