import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-items-instance-history',
  templateUrl: './instance-history.component.html',
  styleUrls: ['./instance-history.component.scss'],
  standalone: true,
  imports: [PageHeaderComponent]
})
export class ItemsInstanceHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
