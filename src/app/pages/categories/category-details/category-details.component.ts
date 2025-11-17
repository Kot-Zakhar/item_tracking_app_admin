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
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CategoriesDataService } from '../categories-data.service';
import { CreateOrEditCategoryComponent } from '../create-or-edit-category/create-or-edit-category.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@env/environment';
import { filter, switchMap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Category, CategoryWithDetails } from '@shared/models/category.model';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  standalone: true,
  providers: [CategoriesDataService],
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
    CreateOrEditCategoryComponent,

    CommonModule,
    TranslateModule,

    RouterLink,
  ],
})
export class CategoryDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly dataService = inject(CategoriesDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  @Input({required: true})
  set categoryId(value: string) {
    this.id = Number.parseInt(value, 10);
    this.loadCategory();
  }

  get category(): Category | undefined {
    return this.categoryWithDetails;
  }

  id: number;
  categoryWithDetails?: CategoryWithDetails;

  getImgSrc(src: string): string {
    return `${environment.apiUrl}/${src}`;
  }

  onEdit() {
    this.dialog.open(CreateOrEditCategoryComponent, {
      data: {
        category: this.categoryWithDetails,
        parentCategory: this.categoryWithDetails!.parent,
      }
    })
    .afterClosed()
    .pipe(filter(value => !!value))
    .subscribe(value => {
      this.dataService.updateCategory(this.id, value)
        .subscribe(() => this.loadCategory());
    });
  }

  onDelete() {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData>(ConfirmationDialogComponent, {
      data: {
        title: 'Delete user',
        message: 'Are you sure you want to delete this user?',
        confirmButtonText: 'Delete',
        warn: true,
      },
    })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(() => this.dataService.deleteCategory(this.id)))
      .subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  private loadCategory() {
    this.dataService.getCategory(this.id)
      .subscribe(category => this.categoryWithDetails = category);
  }
}