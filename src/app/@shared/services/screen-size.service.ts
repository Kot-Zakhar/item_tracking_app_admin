import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

const MIDDLE_BREAKPOINT = 768;
const SMALL_BREAKPOINT = 640;

@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {
  private readonly breakpointObserver = inject(BreakpointObserver);
  isScreenMedium$ = new BehaviorSubject<boolean>(false);
  isScreenSmall$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.breakpointObserver.observe(`(max-width: ${MIDDLE_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches))
      .subscribe(value => this.isScreenMedium$.next(value));

    this.breakpointObserver.observe(`(max-width: ${SMALL_BREAKPOINT}px)`)
      .pipe(map(breakpoint => breakpoint.matches))
      .subscribe(value => this.isScreenSmall$.next(value));
  }
}