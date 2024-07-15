import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

const MIDDLE_BREAKPOINT = 768;

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  isScreenSmall$: Observable<boolean>;
  isScreenSmall = false;

  constructor() {
    this.isScreenSmall$ = this.breakpointObserver.observe(`(max-width: ${MIDDLE_BREAKPOINT}px)`)
      .pipe(
        map(breakpoint => breakpoint.matches),
        tap(isSmall => this.isScreenSmall = isSmall),
      );
  }
}