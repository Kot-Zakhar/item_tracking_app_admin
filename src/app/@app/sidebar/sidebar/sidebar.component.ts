import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { Location } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarBodyComponent, SidebarComponent as EmrSidebarComponent, SidebarHeaderComponent, SidebarNavComponent, SidebarNavItemComponent, SidebarNavItemIconDirective, SidebarNavGroupComponent, SidebarNavGroupToggleComponent, SidebarNavGroupToggleIconDirective, SidebarNavGroupMenuComponent } from '@elementar-ui/components/sidebar';

export interface NavItem {
  type: string;
  name: string;
  icon?: string;
  id?: string | number;
  link?: string;
  children?: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatRipple,
    TranslateModule,
    SidebarBodyComponent,
    EmrSidebarComponent,
    SidebarNavGroupComponent,
    SidebarNavGroupToggleComponent,
    SidebarNavGroupToggleIconDirective,
    SidebarHeaderComponent,
    SidebarNavComponent,
    SidebarNavItemIconDirective,
    SidebarNavItemComponent,
    SidebarNavGroupMenuComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  host: {
    'class': 'sidebar'
  }
})
export class SidebarComponent {
  router = inject(Router);
  location = inject(Location);
  height: string | null = '200px';

  @Output()
  onNavigation = new EventEmitter();

  @ViewChild('navigation', { static: true })
  navigation!: any;

  navItems: NavItem[] = [
    {
      id: 'items',
      type: 'link',
      name: 'sidebar.items',
      icon: 'list',
      link: '/pages/items'
    },
    {
      id: 'categories',
      type: 'link',
      name: 'sidebar.categories',
      icon: 'category',
      link: '/pages/categories'
    },
    {
      id: 'locations',
      type: 'link',
      name: 'sidebar.locations',
      icon: 'meeting_room',
      link: '/pages/locations'
    },
    {
      id: 'users',
      type: 'link',
      name: 'sidebar.users',
      icon: 'people',
      link: '/pages/users'
    },
  ];
  navItemLinks: NavItem[] = [];
  activeLinkId: any = '/';

  ngOnInit() {
    this.navItems.forEach(navItem => {
      this.navItemLinks.push(navItem);

      if (navItem.children) {
        this.navItemLinks = this.navItemLinks.concat(navItem.children as NavItem[]);
      }
    });
    this._activateLink();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.onNavigation.emit();
        this._activateLink();
      })
    ;
  }

  private _activateLink() {
    const activeLink = this.navItemLinks.find(
      navItem => !!navItem.link && this.location.path().includes(navItem.link)
    );

    if (activeLink) {
      this.activeLinkId = activeLink.link;
    } else {
      this.activeLinkId = null;
    }
  }
}
