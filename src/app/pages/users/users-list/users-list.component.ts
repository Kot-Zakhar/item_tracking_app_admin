import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { UsersDataService } from '../users-data.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, UserWithDetails } from '@shared/models/user.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { filter } from 'rxjs';
import { RouterLink } from '@angular/router';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSnackBarModule,
    CommonModule,
    CreateUserDialogComponent,
    RouterLink,
  ],
  providers: [
    UsersDataService,
  ],
})
export class UsersListComponent implements AfterViewInit, OnInit {
  private readonly dataSrv = inject(UsersDataService);
  private readonly dialog = inject(MatDialog);

  readonly dataSource = new MatTableDataSource<UserWithDetails>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['name', 'phone', 'email', 'itemsAmount'];

  isLoading = true;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  ngOnInit() {
    this.loadData();
  }

  onNewUserClick() {
    this.dialog.open<CreateUserDialogComponent, void, any>(CreateUserDialogComponent)
      .afterClosed()
      .pipe(filter(user => !!user))
      .subscribe(user => {
        this.isLoading = true;
        this.dataSrv.createUser(user!).subscribe(() => {
          this.loadData();
        });
      });
  }

  sortingDataAccessor(data: UserWithDetails, sortHeaderId: string): string | number {
    const user: any = data.user;
    switch (sortHeaderId) {
      case 'name': return this.getFullName(user);
      case 'itemsAmount': return data.itemsAmount;
      default: return user[sortHeaderId];
    }
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  private loadData() {
    this.dataSrv.getUsers().subscribe(users => {
      this.dataSource.data = users;
      this.isLoading = false;
    });
  }
}