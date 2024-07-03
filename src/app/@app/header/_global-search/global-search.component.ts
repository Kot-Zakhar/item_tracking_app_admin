import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CdkConnectedOverlay, CdkOverlayOrigin, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SuggestionsComponent } from '@elementar/components';
import { SuggestionBlockComponent } from '@elementar/components';
import { SuggestionComponent } from '@elementar/components';
import { MatButtonModule } from '@angular/material/button';
import { SuggestionIconDirective } from '@elementar/components';
import { EmrAvatarModule } from '@elementar/components';
import { SuggestionThumbDirective } from '@elementar/components';
import { FormsModule } from '@angular/forms';
import { GlobalSearchResult, GlobalSearchService } from './global-search.service';
import { environment } from '@env/environment';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { User } from '@shared/models/user.model';
import { LocationPipe } from '@shared/pipes/location.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SuggestionActionDirective } from '../../../../../projects/components/src/lib/suggestions/suggesion-action.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-global-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GlobalSearchService],
  imports: [
    MatIcon,
    MatButtonModule,
    MatTooltipModule,
    EmrAvatarModule,

    CdkOverlayOrigin,
    CdkConnectedOverlay,
    SuggestionsComponent,
    SuggestionBlockComponent,
    SuggestionComponent,
    SuggestionIconDirective,
    SuggestionThumbDirective,
    SuggestionActionDirective,
    FormsModule,
    RouterModule,
    TranslateModule,

    LocationPipe,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
  host: {
    'class': 'global-search',
    '[class.has-dropdown]': '_isAttached'
  }
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  private readonly _overlay = inject(Overlay);
  private readonly _viewContainerRef = inject(ViewContainerRef);
  private readonly _elementRef = inject(ElementRef);
  private readonly dataService = inject(GlobalSearchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  protected _isAttached = false;
  private _overlayRef: OverlayRef;
  protected searchText = '';

  results: GlobalSearchResult | null = null;

  get hasResults(): boolean {
    return !!this.results && (
      this.results.items.length > 0 ||
      this.results.users.length > 0 ||
      this.results.locations.length > 0 ||
      this.results.categories.length > 0
    );
  }

  ngOnInit(): void {
    this.loadSearchResults();
  }

  ngOnDestroy(): void {
    this.close();
  }

  focus(event: FocusEvent, suggestionDropdown: TemplateRef<any>) {
    if (this._isAttached) {
      return;
    }

    this._overlayRef = this._overlay.create({
      hasBackdrop: true,
      positionStrategy: this._overlay
        .position()
        .flexibleConnectedTo(this._elementRef)
        .withLockedPosition()
        .withGrowAfterOpen()
        .withPositions(
          [
            {
              originY: 'bottom',
              overlayY: 'top',
              originX: 'start',
              overlayX: 'start',
            }
          ]
        )
    });
    const portal = new TemplatePortal(suggestionDropdown, this._viewContainerRef);
    this._overlayRef.attach(portal);
    this._isAttached = true;
    this._overlayRef
      .outsidePointerEvents()
      .subscribe((event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (target.closest('.global-search')) {
          return;
        }

        this.close();
      })
    ;
  }

  close(): void {
    this._overlayRef?.dispose();
    this._isAttached = false;
  }

  clearText() {
    this.searchText = '';
    this.loadSearchResults();
  }

  getImgSrc(src: string | null): string {
    return src? `${environment.apiUrl}${src}` : '';
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  loadSearchResults() {
    this.dataService.search(this.searchText)
      .subscribe(results => this.results = results);
  }

  navigateToRelativeItems(queryParams: any) {
    this.router.navigate(['/pages/items'], { queryParams });
    this.close();
  }
}
