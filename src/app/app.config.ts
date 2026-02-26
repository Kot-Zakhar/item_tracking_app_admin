import { ApplicationConfig, importProvidersFrom, inject, PLATFORM_ID, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { PageTitleStrategyService, ENVIRONMENT, EnvironmentService } from '@elementar-ui/components/core';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { LoginService } from './auth/login.service';
import { LocalStorageService } from '@shared/services/storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialComponentsIntlProviders, provideTranslationConfig } from './translation';
import { COLOR_SCHEME_LOCAL_KEY, ColorScheme, ColorSchemeStore } from '@elementar-ui/components/color-scheme';
import { GlobalStore } from '@state/global.state';
import { isPlatformBrowser } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    ColorSchemeStore,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideStore(),
    provideNativeDateAdapter(),
    importProvidersFrom(TranslateModule.forRoot(provideTranslationConfig())),
    ...MaterialComponentsIntlProviders,
    {
      provide: ENVIRONMENT,
      useValue: environment
    },
    provideAppInitializer(() => {
      const envService = inject(EnvironmentService);
      const globalStore = inject(GlobalStore);
      const platformId = inject(PLATFORM_ID);
      const colorSchemeStore = inject(ColorSchemeStore);
      return new Promise((resolve, reject) => {
        if (isPlatformBrowser(platformId)) {
          const localColorScheme = localStorage
            ? (localStorage.getItem(COLOR_SCHEME_LOCAL_KEY) as ColorScheme || 'light')
            : 'light';
          // but the best solution set it from backend
          colorSchemeStore.setScheme(localColorScheme);
        }

        resolve(true);
      });
    }),
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategyService
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' }
    },
    LoginService,
    LocalStorageService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
