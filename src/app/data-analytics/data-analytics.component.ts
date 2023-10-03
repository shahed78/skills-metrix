import { Component, OnInit  } from '@angular/core';
import { DataService } from '../shared/services/data.service';


@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.scss']
})
export class DataAnalyticsComponent implements OnInit {

  public users:any;

  constructor(private dataService: DataService) {}


  ngOnInit(): void {
  console.log('dasasds');
  this.users = this.dataService.getSharedData();
  console.log(this.users);
  }

}
