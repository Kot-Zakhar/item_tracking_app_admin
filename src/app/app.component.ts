import { afterNextRender, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScreenLoaderComponent } from '@app/screen-loader/screen-loader.component';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';
import { AnalyticsService, EnvironmentService, InactivityTrackerService, SeoService, ScreenLoaderService } from '@elementar-ui/components/core'
import { PageLoadingBarComponent } from '@elementar-ui/components/page-loading-bar';
import { SplashScreenComponent } from '@elementar-ui/components/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { initTranslateService } from './translation';
import { LocalStorageService } from '@shared/services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ScreenLoaderComponent,
    SplashScreenComponent,
    PageLoadingBarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private _screenLoader = inject(ScreenLoaderService);
  private _analyticsService = inject(AnalyticsService);
  private _inactivityTracker = inject(InactivityTrackerService);
  private _envService = inject(EnvironmentService);
  private _seoService = inject(SeoService);
  private _platformId = inject(PLATFORM_ID);
  private _router = inject(Router);
  private _translate = inject(TranslateService);
  private _storageService = inject(LocalStorageService);

  loadingText = signal('Application Loading');
  pageLoaded = signal(false);

  constructor() {
    initTranslateService(this._translate, this._storageService);

    afterNextRender(() => {
      // Scroll a page to top if url changed
      this._router.events
        .pipe(
          filter(event => event instanceof NavigationEnd)
        )
        .subscribe(() => {
          window.scrollTo({
            top: 0,
            left: 0
          });
          setTimeout(() => {
            this._screenLoader.hide();
            this.pageLoaded.set(true);
          }, 3000);
        })
        ;

      this._analyticsService.trackPageViews();
      this._inactivityTracker.setupInactivityTimer()
        .subscribe(() => {
          console.log('Inactive mode has been activated!');
          // this._inactivityTracker.reset();
        })
        ;
    });
  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {
      setTimeout(() => {
        this.loadingText.set('Initializing Modules');
      }, 1500);
    }

    this._seoService.trackCanonicalChanges(this._envService.getValue('siteUrl'));
  }
}