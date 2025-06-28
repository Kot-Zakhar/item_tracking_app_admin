import { Component, Input, ViewChild, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ThemePalette } from '@angular/material/core';
import { BehaviorSubject, filter, forkJoin, switchMap, tap } from 'rxjs';

import { environment } from '@env/environment';
import { MovableItem, MovableItemInstance, MovableItemStatus, MovableItemStatusTranslationKeys } from '@shared/models/movable-items.model';
import { CategoryWithParent } from '@shared/models/category.model';
import { ItemInstancesFilters, ItemsDataService } from '../items-data.service';
import { AssignDialogComponent } from './assign-dialog/assign-dialog.component';
import { HistoryDialogComponent } from './history-dialog/history-dialog.component';
import { MoveDialogComponent } from './move-dialog/move-dialog.component';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { EmrAvatarModule } from '@elementar/components';
import { User } from '@shared/models/user.model';
import { Location } from '@shared/models/location.model';
import { MatMenuModule } from '@angular/material/menu';
import { LocationPipe } from '@shared/pipes/location.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@shared/services/screen-size.service';
import { DownloadService } from '@shared/services/download.service';

@Component({
  selector: 'app-items-item-details',
  templateUrl: './item-details.component.html',
  standalone: true,
  providers: [ItemsDataService, DownloadService],
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    CommonModule,
    LocationPipe,
    
    EmrAvatarModule,
    CreateOrEditItemDialogComponent,
    RouterLink,
    TranslateModule,
  ],
})
export class ItemsItemDetailsComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(ItemsDataService);
  private readonly downloadService = inject(DownloadService);
  readonly screenSize = inject(ScreenSizeService);

  readonly movableItemStatus = MovableItemStatus;
  readonly dataSource = new MatTableDataSource<MovableItemInstance>();
  readonly displayedColumns = ['code', 'location', 'status', 'user', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input({required: true})
  set itemId(value: string) {
    this.numericItemId = Number.parseInt(value, 10);
  }

  get availableCount(): number {
    return this.countByStatus(MovableItemStatus.Available);
  }

  get bookedCount(): number {
    return this.countByStatus(MovableItemStatus.Booked);
  }

  get takenCount(): number {
    return this.countByStatus(MovableItemStatus.Taken);
  }

  numericItemId: number;
  item?: MovableItem;

  userSuggestions: User[] = [];
  locationSuggestions: Location[] = [];
  
  selectedLocation: Location | null = null;
  selectedUsers: User[] = [];
  
  filterParamsBS: BehaviorSubject<ItemInstancesFilters>;

  get filtersApplied(): boolean {
    return !!this.selectedLocation || this.selectedUsers.length > 0;
  }

  isUserSelected = (user: User): boolean => this.selectedUsers.some(u => u.id === user.id);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    this.loadItem();
    this.reloadInstances();
  }

  ngOnInit() {
    this.loadUserSuggestions();
    this.loadLocationSuggestions();

    this.initFilterParamsFromQuery();
    this.setupReloadOnFilterPipeline();
  }

  loadItem() {
    this.dataService.getItem(this.numericItemId).subscribe(item => this.item = item);
  }

  reloadInstances() {
    const filterParamsCopy = { ...this.filterParamsBS.value };
    this.filterParamsBS.next(filterParamsCopy);
  }

  onUserSelect(user: User) {    
    if (this.selectedUsers.some(u => u.id === user.id)) {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    } else {
      this.selectedUsers.push(user);
    }

    if (this.selectedUsers.length === 0) {
      this.updateFilterWith({ users: undefined });
      return;
    }

    this.updateFilterWith({ users: this.selectedUsers.map(u => u.id) });
  }

  onLocationSelect(location: Location | null) {
    this.selectedLocation = location;
    this.updateFilterWith({ location: location?.id ?? undefined });
  }

  onUserSelectionClean() {
    this.selectedUsers = [];
    this.updateFilterWith({ users: undefined });
  }

  onFiltersClear() {
    this.selectedLocation = null;
    this.selectedUsers = [];
    this.updateFilterWith({
      location: undefined,
      users: undefined,
    });
  }

  onUserSuggestionSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.loadUserSuggestions(value);
  }

  onLocationSuggestionSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.loadLocationSuggestions(value);
  }

  onQuickAdd() {
    this.dataService.addInstance(this.numericItemId).subscribe(() => this.reloadInstances());
  }

  onEdit() {
    const item = this.item!;

    this.dialog.open(CreateOrEditItemDialogComponent, {  
      data: { item },
    })
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe(value => {
        this.dataService.updateItem(item.id, value)
          .subscribe(() => {
            Object.assign(item, value);
          });
      });
  }

  onDelete() {
    const item = this.item!;
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this item?`,
          message: `Are you sure you want to delete ${item.name}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataService.deleteItem(item.id))
    )
    .subscribe(() => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  getCategoryFullTitle(category: CategoryWithParent): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.name}` : category.name;
  }

  stringifyStatus(status: MovableItemStatus): string {
    switch (status) {
      case MovableItemStatus.Available:
        return 'Available';
      case MovableItemStatus.Booked:
        return 'Booked';
      case MovableItemStatus.Taken:
        return 'Taken';
    }
  }

  getStatusColor(status: MovableItemStatus): ThemePalette {
    switch (status) {
      case MovableItemStatus.Available:
        return 'primary';
      case MovableItemStatus.Booked:
        return 'accent';
      case MovableItemStatus.Taken:
        return 'warn';
    }
  }

  getStatusTranslationKey(status: MovableItemStatus): string {
    return MovableItemStatusTranslationKeys[status];
  }

  downloadInstanceQrCode(instance: MovableItemInstance) {
    this.dataService.getInstanceQrCode(instance.movableItemId, instance.id)
      .subscribe(blob => this.downloadService.downloadFile(blob, `instance-${instance.code}.png`));
  }

  openHistoryModal(instance: MovableItemInstance) {
    this.dialog.open(HistoryDialogComponent, {
      data: instance,
      width: '700px',
    });
  }

  assignInstance(instance: MovableItemInstance) {
    this.dataService.getUsers()
      .subscribe(users => this.dialog
        .open(AssignDialogComponent, { data: users })
        .afterClosed()
        .pipe(filter(user => !!user))
        .subscribe(user => this.dataService
          .assignInstance(instance.movableItemId, instance.id, user.id).subscribe(() => {
            instance.user = user;
            instance.status = MovableItemStatus.Taken;
            instance.location = undefined;
          })
        )
      );
  }

  cancelBooking(instance: MovableItemInstance) {
    if (instance.location) {
      this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
        ConfirmationDialogComponent, {
          data: {
            title: 'Cancel Booking',
            message: 'Are you sure to cancel the booking?',
            confirmButtonText: 'common.cancel',
            cancelButtonText: 'common.back',
            warn: true,
          }
        }
      )
      .afterClosed()
      .pipe(
        filter(confirm => !!confirm),
        switchMap(() => this.dataService.cancelBooking(instance.movableItemId, instance.id)),
      )
      .subscribe(() => this.reloadInstances());
    } else {
      this.unassignInstance(instance);
    }
  }

  unassignInstance(instance: MovableItemInstance) {
    this.dataService.getLocations().subscribe(locations => {
      this.dialog
        .open(MoveDialogComponent, { data: locations })
        .afterClosed()
        .subscribe(location => {
          if (location) {
            this.dataService.unassignInstance(instance.movableItemId, instance.id, location.id).subscribe(() => {
              instance.location = location;
              instance.user = undefined;
              instance.status = MovableItemStatus.Available;
            });
          }
        });
    });
  }

  moveInstance(instance: MovableItemInstance) {
    this.dataService.getLocations().subscribe(locations => {
      this.dialog
        .open(MoveDialogComponent, { data: locations })
        .afterClosed()
        .subscribe(location => {
          if (location) {
            this.dataService.moveInstance(instance.movableItemId, instance.id, location.id).subscribe(() => {
              instance.location = location;
            });
          }
        });
    });
  }

  deleteInstance(instance: MovableItemInstance) {
    this.dialog.open<ConfirmationDialogComponent<ConfirmationDialogData>, ConfirmationDialogData, boolean>(
      ConfirmationDialogComponent, {
        data: {
          title: `Delete this instance?`,
          message: `Are you sure you want to delete instance ${instance.code}?`,
          confirmButtonText: 'Delete',
          warn: true,
        }
      }
    )
    .afterClosed()
    .pipe(
      filter(value => !!value),
      switchMap(() => this.dataService.deleteInstance(this.numericItemId, instance.id)),
    )
    .subscribe(() => this.reloadInstances());
  }

  private countByStatus(status: MovableItemStatus): number {
    return this.dataSource.data?.filter(i => i.status === status).length ?? 0;
  }

  private loadUserSuggestions(value: string | null = null) {
    this.dataService.getUserSuggestions(value)
      .subscribe(users => this.userSuggestions = users);
  }

  private loadLocationSuggestions(value: string | null = null) {
    this.dataService.getLocationSuggestions(value)
      .subscribe(locations => this.locationSuggestions = locations);
  }

  private initFilterParamsFromQuery() {
    const params = this.route.snapshot.queryParamMap

    const filter: ItemInstancesFilters = {};

    if (params.has('location')) {
      filter.location = +params.get('location')!;
      this.dataService.getLocation(filter.location).subscribe(location => this.selectedLocation = location);
    }

    if (params.has('users')) {
      filter.users = params.getAll('users').map(id => +id);
      forkJoin(filter.users.map(id => this.dataService.getUser(id)))
        .subscribe(users => this.selectedUsers = users);
    }

    this.filterParamsBS = new BehaviorSubject(filter);
  }

  private setupReloadOnFilterPipeline() {
    this.filterParamsBS
      .pipe(
        tap(queryParams => this.router.navigate([], { relativeTo: this.route, queryParams, queryParamsHandling: 'merge' })),
        switchMap(params => this.dataService.getItemInstances(this.numericItemId, params)),  
      )
      .subscribe(data => {
        this.dataSource.data = data;
      });
  }

  private updateFilterWith(value: Partial<ItemInstancesFilters>) {
    const filterParams = { ...this.filterParamsBS.value };
    Object.assign(filterParams, value);
    this.filterParamsBS.next(filterParams);
  }
}
