import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/header/header/header.component';
import { SidebarComponent } from '@app/sidebar/sidebar/sidebar.component';
import { AsyncPipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { ScreenSizeService } from '@shared/services/screen-size.service';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutApiService } from '@elementar-ui/components/layout';
import {
  LayoutBodyComponent,
  LayoutComponent,
  LayoutHeaderComponent,
  LayoutSidebarComponent
} from '@elementar-ui/components/layout';

const MIDDLE_BREAKPOINT = 768;

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatDividerModule,
    LayoutBodyComponent,
    LayoutComponent,
    LayoutHeaderComponent,
    LayoutSidebarComponent,
    AsyncPipe,
    TranslateModule,
  ],
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent {
  screenSizeService = inject(ScreenSizeService);
  private _layoutApi = inject(LayoutApiService);

  isSmall$ = this.screenSizeService.isScreenMedium$;


  onSidebarToggle() {
    this._layoutApi.toggleSidebar('root');
  }

  onSidebarNavigationClick() {
    if (this.screenSizeService.isScreenMedium$.value) {
      this._layoutApi.hideSidebar('root');
    }
  }
}
