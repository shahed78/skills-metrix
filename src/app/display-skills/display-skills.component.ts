import { Component, OnInit} from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayskillsService } from './services/displayskills.service';
import {MatTableDataSource} from '@angular/material/table';
import { IUser } from '../shared/data.interface';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit {

  public users: IUser[] = [];

  displayedUserColumns = ['id', 'firstname', 'lastname', 'email'];
  dataSource: MatTableDataSource<IUser>;
  //
  
  applyFilter(event: Event) {
    console.log( (event.target as HTMLInputElement).value);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  constructor(public addSkillsDialog: MatDialog, private displayskills: DisplayskillsService ) {}

  ngOnInit(): void {
    //unsubscribe
    let displaySkillsList = this.displayskills.getUsersSkills().subscribe({
      next: userdata =>{
        this.users = userdata;
        this.dataSource = new MatTableDataSource(this.users);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  public addSkills(): void {
    const dialogRef = this.addSkillsDialog.open(AddSkillsComponent);
  }
}
