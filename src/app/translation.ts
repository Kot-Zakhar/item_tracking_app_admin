import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModuleConfig, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LocalStorageService } from '@shared/services/storage.service';

function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './i18n/', '.json');
}

const langs = ['en', 'nl'];
const defaultLang = 'nl';

const langStorageKey = 'lang';

export function initTranslateService(translate: TranslateService, storageService: LocalStorageService): void {
  translate.addLangs(langs);
  translate.setDefaultLang(defaultLang);
  translate.onLangChange.subscribe(({ lang }) => storageService.set(langStorageKey, lang));

  const lang = storageService.get<string>(langStorageKey);
  if (lang && langs.includes(lang)) {
    translate.use(lang);
    return;
  }

  const browserLang = translate.getBrowserLang();
  translate.use(browserLang?.match(`${langs.join('|')}`) ? browserLang : defaultLang);
}

export function provideTranslationConfig(): TranslateModuleConfig {
  return {
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    }
  }
}

const MatPaginatorIntlProvider = {
  provide: MatPaginatorIntl,
  deps: [TranslateService],
  useFactory: (translate: TranslateService) => new PaginatorI18n(translate).getPaginatorIntl()
};

class PaginatorI18n {
  constructor(private readonly translate: TranslateService) {}

  getPaginatorIntl(): MatPaginatorIntl {
    const paginatorIntl = new MatPaginatorIntl();
    this.translate.onLangChange.subscribe(() => {
      this.updateLabels(paginatorIntl);
      return paginatorIntl.changes.next();
    });
    this.updateLabels(paginatorIntl);
    paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);
    return paginatorIntl;
  }

  private updateLabels(paginatorIntl: MatPaginatorIntl): void {
    paginatorIntl.itemsPerPageLabel = this.translate.instant('material.paginator.itemsPerPage');
    paginatorIntl.nextPageLabel = this.translate.instant('material.paginator.nextPage');
    paginatorIntl.previousPageLabel = this.translate.instant('material.paginator.previousPage');
    paginatorIntl.firstPageLabel = this.translate.instant('material.paginator.firstPage');
    paginatorIntl.lastPageLabel = this.translate.instant('material.paginator.lastPage');
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
        return this.translate.instant('material.paginator.zeroOfLength', { length });
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return this.translate.instant('material.paginator.startEndOfLength', { start: startIndex + 1, end: endIndex, length });
  }
}

export const MaterialComponentsIntlProviders = [
  MatPaginatorIntlProvider
];