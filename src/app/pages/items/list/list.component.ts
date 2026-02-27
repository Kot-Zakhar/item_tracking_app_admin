import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BehaviorSubject, debounceTime, filter, forkJoin, map, Observable, skip, switchMap, take, tap } from 'rxjs';

import { AvatarComponent, AvatarGroupComponent } from '@elementar-ui/components/avatar';
import { Category, CategoryWithChildren, CategoryWithParent } from '@shared/models/category.model';
import { MovableItem } from '@shared/models/movable-items.model';
import { ItemsDataService, ItemsFilters, MovableItemWithDetails } from '../items-data.service';
import { CreateOrEditItemDialogComponent } from '../create-or-edit-item-dialog/create-or-edit-item-dialog.component';
import { environment } from '@env/environment';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule } from '@angular/material/tree';
import { MatMenuModule } from '@angular/material/menu';
import { User } from '@shared/models/user.model';
import { Location } from '@shared/models/location.model';
import { LocationPipe } from '@shared/pipes/location.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenSizeService } from '@shared/services/screen-size.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './list.component.html',
  standalone: true,
  providers: [ ItemsDataService ],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatSortModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatTreeModule,
    
    MatPaginatorModule,

    RouterModule,
    CreateOrEditItemDialogComponent,
    AvatarComponent,
    AvatarGroupComponent,
    CommonModule,
    TitleCasePipe,
    AsyncPipe,
    LocationPipe,
    TranslateModule,
  ],
  host: {
    'class': 'block w-full h-full'
  }
})
export class ItemsListComponent implements AfterViewInit, OnInit {
  private readonly dataService = inject(ItemsDataService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly screenSize = inject(ScreenSizeService);
  
  readonly dataSource = new MatTableDataSource<MovableItemWithDetails>();
  readonly categoryTreeControl = new NestedTreeControl<CategoryWithChildren, number>(node => node.children, { trackBy: category => category.id });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['item', 'category', 'availability', 'bookedBy', 'takenBy'];

  categoriesBS = new BehaviorSubject<CategoryWithChildren[]>([]);

  userSuggestions: User[] = [];
  locationSuggestions: Location[] = [];

  selectedCategories: Category[] = [];
  selectedLocation: Location | null = null;
  selectedUsers: User[] = [];
  
  searchBS: BehaviorSubject<string> = new BehaviorSubject('');
  search = '';
  filterParamsBS = new BehaviorSubject<ItemsFilters>({});
  
  isLoading = true;

  get filtersApplied(): boolean {
    return this.selectedCategories.length > 0 || !!this.selectedLocation || this.selectedUsers.length > 0 || !!this.searchBS.value;
  }

  hasChild = (_: number, node: CategoryWithChildren) => !!node.children && node.children.length > 0;

  isUserSelected = (user: User): boolean => this.selectedUsers.some(u => u.id === user.id);

  ngAfterViewInit() {
    this.initDataSource();
  }

  ngOnInit() {
    this.loadCategories();
    this.loadUserSuggestions();
    this.loadLocationSuggestions();
    
    this.initFilterParamsFromQuery();
    this.setupSearchDebounce();
    this.setupReloadOnFilterPipeline();
  }

  initFilterParamsFromQuery() {
    this.route.queryParamMap
    .pipe(map(params => {
      const filter: ItemsFilters = {};
  
      if (params.has('categories')) {
        // const categoryId = +params.get('categories')!;
        const categoryIds = params.getAll('categories').map(c => +c);
        filter.categories = categoryIds;
        this.categoriesBS.pipe(skip(1), take(1)).subscribe(categories => this.selectedCategories = categoryIds.map(id => this.findCategory(categories, id)!))
      } else {
        this.selectedCategories = [];
      }
  
      if (params.has('location')) {
        filter.location = +params.get('location')!;
        this.dataService.getLocation(filter.location).subscribe(location => this.selectedLocation = location);
      } else {
        this.selectedLocation = null;
      }
  
      if (params.has('users')) {
        filter.users = params.getAll('users').map(id => +id);
        forkJoin(filter.users.map(id => this.dataService.getUser(id)))
          .subscribe(users => this.selectedUsers = users);
      } else {
        this.selectedUsers = [];
      }
  
      if (params.has('search')) {
        filter.search = params.get('search')!;
      } else {
        this.search = '';
      }

      return filter;
    }))
    .subscribe(params => this.filterParamsBS.next(params));
  }

  setupReloadOnFilterPipeline() {
    this.filterParamsBS
      .pipe(
        tap(() => this.isLoading = true),
        switchMap(params => this.loadItems(params)),
      )
      .subscribe(data => {
        this.isLoading = false
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

  loadCategories() {
    this.dataService.getCategories()
      .subscribe(categories => this.categoriesBS.next(categories));
  }

  loadUserSuggestions(value: string | null = null) {
    this.dataService.getUserSuggestions(value)
      .subscribe(users => this.userSuggestions = users);
  }

  loadLocationSuggestions(value: string | null = null) {
    this.dataService.getLocationSuggestions(value)
      .subscribe(locations => this.locationSuggestions = locations);
  }

  loadItems(filterParams: any): Observable<MovableItemWithDetails[]> {
    return this.dataService.getItems(filterParams)
      .pipe(
        map(response => response.payload),
        tap(items => {
          this.dataSource.data = items;
        }),
      );
  }

  onNewItemClick() {
    const categories = this.categoriesBS.value;
    if (!categories) {
      return;
    }

    this.dialog.open<CreateOrEditItemDialogComponent, { categories: Category[] }, MovableItem>
    (CreateOrEditItemDialogComponent, { data: { categories } })
      .afterClosed()
      .pipe(
        filter(value => !!value),
        switchMap(value => this.dataService.createItem(value!)),
        switchMap(() => this.loadItems(this.filterParamsBS.value)),
      )
      .subscribe();
  }

  getCategoryFullTitle(category: CategoryWithParent): string {
    return category.parent ? `${this.getCategoryFullTitle(category.parent)} / ${category.name}` : category.name;
  }

  getUniqueUsers(users: User[]): User[] {
    const uniqueUsers = new Map(users.map(user => [user.id, user]));
    return Array.from(uniqueUsers.values()); 
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchBS.next(value);
  }
  setupSearchDebounce() {
    this.searchBS
      .pipe(
        tap(search => this.search = search),
        debounceTime(300),
        map(search => search ? search : undefined),
      )
      .subscribe(search => this.updateFilterWith({ search }));
  }

  isCategorySelected(category: Category): boolean {
    return this.selectedCategories.some(c => c.id === category.id);
  }

  // TODO: rewrite this logic of category multiselect
  onCategorySelect(selectedCategory: Category | null) {
    if (!selectedCategory) {
      this.selectedCategories = [];
      this.updateFilterWith({ categories: [] });
      return;
    }
    
    const flatCategories = this.findCategoryWithChildrenFlat(this.categoriesBS.value, selectedCategory.id);
    if (this.isCategorySelected(selectedCategory)) {
      this.selectedCategories = this.selectedCategories.filter(c => !flatCategories.includes(c.id));      
    } else {
      const resultCategoriesSet = new Set(this.selectedCategories);
      flatCategories.forEach(c => resultCategoriesSet.add(this.findCategory(this.categoriesBS.value, c)!));
      this.selectedCategories = new Array(...resultCategoriesSet);
    }
    this.updateFilterWith({ categories: this.selectedCategories.map(c => c.id) });
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
    this.selectedCategories = [];
    this.selectedLocation = null;
    this.selectedUsers = [];
    this.searchBS.next('');
    this.updateFilterWith({
      categories: undefined,
      location: undefined,
      users: undefined,
      search: undefined,
    });
  }

  private updateFilterWith(value: Partial<ItemsFilters>) {
    const queryParams = { ...this.filterParamsBS.value };
    Object.assign(queryParams, value);
    this.router.navigate([], { relativeTo: this.route, queryParams });
  }

  private sortingDataAccessor(data: MovableItemWithDetails, sortHeaderId: string): string | number {
    switch (sortHeaderId) {
      case 'category':
        return this.getCategoryFullTitle(data.category).toLowerCase();
      case 'item':
        return data.name.toLowerCase();
      case 'availability':
        return data.totalAmount;
      default:
        return (data as any)[sortHeaderId];
    }
  }

  private initDataSource() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
  }

  private findCategory(categories: CategoryWithChildren[], categoryId: number): CategoryWithChildren | null {
    const rootLevelCategory = categories.find(c => c.id === categoryId);

    if (rootLevelCategory) return rootLevelCategory;

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].children?.length) {
        const category = this.findCategory(categories[i].children!, categoryId);
        if (category) return category;
      }
    }

    return null;
  }

  private findCategoryWithChildrenFlat(categories: CategoryWithChildren[], categoryId: number): number[] {
    const rootCategory = this.findCategory(categories, categoryId);
    const resultCategories: number[] = [];

    if (!rootCategory) {
      return resultCategories;
    }

    resultCategories.push(rootCategory.id);

    if (!rootCategory.children?.length) {
      return resultCategories;
    }

    rootCategory.children.forEach(child => {
      var childResultCategories = this.findCategoryWithChildrenFlat(rootCategory.children!, child.id);
      resultCategories.push(...childResultCategories);
    })
    
    return resultCategories;
  }
}
