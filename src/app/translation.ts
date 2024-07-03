import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModuleConfig, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

const langs = ['en', 'nl'];
const defaultLang = 'en';

export function initTranslateService(translate: TranslateService): void {
  translate.addLangs(langs);
  translate.setDefaultLang(defaultLang);

  const browserLang = translate.getBrowserLang();
  translate.use(browserLang?.match(`${langs.join('|')}`) ? browserLang : defaultLang);
}

export function provideTranslationConfig(): TranslateModuleConfig {
  return {
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    }
  }
}