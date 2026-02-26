import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { GlobalSearchComponent } from '@app/header/_global-search/global-search.component';
import { LanguageSelectorComponent } from '../_language-selector/language-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../auth/auth.service';
import {
  ColorSchemeDarkDirective,
  ColorSchemeLightDirective,
  ColorSchemeSwitcherComponent
} from '@elementar-ui/components/color-scheme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatTooltip,
    GlobalSearchComponent,
    LanguageSelectorComponent,
    TranslateModule,
    ColorSchemeDarkDirective,
    ColorSchemeLightDirective,
    ColorSchemeSwitcherComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    'class': 'block w-full h-full'
  }
})
export class HeaderComponent {
  private _authService = inject(AuthService);

  @Output()
  onSidebarToggle = new EventEmitter<void>();

  toggleSidebar(): void {
    this.onSidebarToggle.emit();
  }

  onLogout(): void {
    this._authService.logout().subscribe();
  }
}
