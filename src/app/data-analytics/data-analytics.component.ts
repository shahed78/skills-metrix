import { Component, OnInit  } from '@angular/core';
import { DataService } from '../shared/services/data.service';
import { UsersService } from '../shared/services/users.service';
import { IUser } from '../shared/interfaces/data.interface';


@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.scss']
})
export class DataAnalyticsComponent implements OnInit {

  public users:any;
  versionControlData: { labels: string[]; datasets: { label: string, data: unknown[]; backgroundColor: string[]; }[]; };
  
  constructor(private dataService: DataService,  private usersService: UsersService, ) {}


  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      console.log('sd')
      console.log(users);
      this.users = users.sort((a, b) => a.id - b.id);
      // const arr = this.users.filter((_: any, index: number) => index < 5);
      // console.log(arr);
      // this.createChart(arr);
      this.createChart(this.users);
    });

   
  }


  public createChart(users: IUser[]) {
    const data = users;

      // Specify the type of versionControlCounts
    const versionControlCounts: { [key: string]: number } = {};

    data.forEach((person: { skillsMultiCtrl: any[]; }) => {
      person.skillsMultiCtrl
        .filter(skill => skill.type === 'Version Control')
        .forEach(skill => {
          versionControlCounts[skill.name] = (versionControlCounts[skill.name] || 0) + 1;
        });
    });

    // Create the chart data
    this.versionControlData = {
      labels: Object.keys(versionControlCounts),
      datasets: [
        {
          label: 'Version Control',
          data: Object.values(versionControlCounts),
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        }
      ]
    };

    console.log(this.versionControlData);
  }

}
