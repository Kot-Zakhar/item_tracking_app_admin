import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/header/header/header.component';
import { SidebarComponent } from '@app/sidebar/sidebar/sidebar.component';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AsyncPipe } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject, Observable, Subject, map, startWith, take } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { ScreenSizeService } from '@shared/services/screen-size.service';

const MIDDLE_BREAKPOINT = 768;

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    MatSidenavModule,
    MatDividerModule,
    AsyncPipe,
  ],
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  screenSizeService = inject(ScreenSizeService);

  isSmall$ = this.screenSizeService.isScreenSmall$;


  onSidebarToggle() {
    this.sidenav.toggle();
  }

  onSidebarNavigationClick() {
    if (this.screenSizeService.isScreenSmall) {
      this.sidenav.close();
    }
  }
}
