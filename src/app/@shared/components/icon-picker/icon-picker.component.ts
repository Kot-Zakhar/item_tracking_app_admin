import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iconCodepoints, iconCodepointsCount } from './icons-codepoints';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-icon-picker',
  templateUrl: './icon-picker.component.html',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
  ],
})
export class IconPickerComponent {
  @Input() selectedIcon: string | null;
  @Output() onIconSelected: EventEmitter<string | null> = new EventEmitter<string | null>();

  length = iconCodepointsCount;
  pageSize = 25;
  cols = 5;
  pageIndex = 0;

  filteredIcons: string[] = iconCodepoints;;
  search: string | null = null;

  get icons(): string[] {
    return this.filteredIcons.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  onPageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
  }

  onIconSelect(icon: string) {
    this.onIconSelected.emit(icon);
  }

  onUnselectIcon() {
    this.onIconSelected.emit(null);
  }

  onSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;

    this.pageIndex = 0;

    if (!this.search) {
      this.cleanSearch();
      return;
    }

    this.filteredIcons = iconCodepoints.filter(icon => icon.includes(this.search!));
    this.length = this.filteredIcons.length;
  }

  cleanSearch() {
    this.search = null;
    this.filteredIcons = iconCodepoints;
    this.length = iconCodepointsCount;
  }
}