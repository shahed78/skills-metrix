import { Component, OnInit  } from '@angular/core';
import { UsersService } from '../shared/services/users.service';
import { ChartData, IUser } from '../shared/interfaces/data.interface';


@Component({
  selector: 'app-data-analytics',
  templateUrl: './data-analytics.component.html',
  styleUrls: ['./data-analytics.component.scss']
})
export class DataAnalyticsComponent implements OnInit {

  public users:IUser[] = [];
  public chartData: ChartData = {};
  public types: string[];
  
  constructor(private usersService: UsersService, ) {}


  ngOnInit(): void {
    this.usersService.users$.subscribe(users => {
      this.users = users.sort((a, b) => a.id - b.id);
      this.types = this.getTypes(users);
      this.types.forEach(type => {
        this.createChart(type, users);
      });
    });
  }

  public getTypes(users: IUser[]): string[]{
    const types: string[] = [];

      // Loop through the data and extract the "type" from each skill
      for (const item of users) {
        for (const skill of item.skillsMultiCtrl) {
          if (!types.includes(skill.type)) {
          types.push(skill.type);
          }
        }
      }
      return types
  }

  public createChart(chartType: string, users: IUser[]) {
    const data = users;
    const chartDataCounts: { [key: string]: number } = {};

    data.forEach(person => {
      person.skillsMultiCtrl
        .filter(skill => skill.type === chartType)
        .forEach(skill => {
          chartDataCounts[skill.name] = (chartDataCounts[skill.name] || 0) + 1;
        });
    });
    delete chartDataCounts["Fortran with CUDA, OpenACL, OpenMP, MPI (these are all for parallel programming of Fortran or C++)"];
    this.chartData[chartType] = {
      labels: Object.keys(chartDataCounts),
      datasets: [
        {
          label: chartType,
          data: Object.values(chartDataCounts),
          backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)',
          'rgba(255, 0, 0, 0.2)',
          'rgba(0, 255, 0, 0.2)',
          'rgba(0, 0, 255, 0.2)',
          'rgba(255, 255, 0, 0.2)',
          'rgba(255, 0, 255, 0.2)',
          'rgba(0, 255, 255, 0.2)',
          'rgba(128, 0, 0, 0.2)',
          'rgba(0, 128, 0, 0.2)',
          'rgba(0, 0, 128, 0.2)',
          'rgba(128, 128, 0, 0.2)',
          'rgba(128, 0, 128, 0.2)',
          'rgba(0, 128, 128, 0.2)',
          'rgba(64, 64, 0, 0.2)',
          'rgba(64, 0, 64, 0.2)',
          'rgba(0, 64, 64, 0.2)'],
        }
      ]
    };
  }
}
