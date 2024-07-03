import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon
        class="material-symbols-outlined"
        [matTooltip]="tooltip"
      >translate</mat-icon>
    </button>

    <mat-menu #menu="matMenu">
      @for (lang of langs; track lang) {
        <button mat-menu-item (click)="changeLanguage(lang)" [disabled]="lang === currentLang">
          {{ titles[lang] || lang }}
        </button>
      }
    </mat-menu>
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ]
})
export class LanguageSelectorComponent {
  private readonly translate = inject(TranslateService);

  @Input() tooltip: string;

  readonly titles: Record<string, string> = {
    'en': 'English',
    'nl': 'Dutch',
  };

  get langs(): string[] {
    return this.translate.getLangs();
  }

  get currentLang(): string {
    return this.translate.currentLang;
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}