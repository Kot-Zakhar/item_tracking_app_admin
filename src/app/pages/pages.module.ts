import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslationConfig } from '../translation';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslateModule.forChild(provideTranslationConfig()),
  ],
})
export class PagesModule { }
