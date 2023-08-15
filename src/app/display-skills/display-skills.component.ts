import { Component, OnInit, OnDestroy} from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import { IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit, OnDestroy {

  public users: IUser[] = [];
  public userSkills: any;

  displayedUserColumns = ['id', 'firstname', 'lastname', 'email', 'startdate','enddate', 'butons'];
  dataSource: MatTableDataSource<IUser>;
  //
  
  applyFilter(event: Event) {
    console.log( (event.target as HTMLInputElement).value);
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
  }

  constructor(public addSkillsDialog: MatDialog, private skillsService: SkillsService ) {}

  ngOnInit(): void {
    this.getSkills();
  }

  ngOnDestroy(): void {
    this.userSkills.unsubscribe();
  }

  public getSkills(): void {
  //unsubscribe
  this.userSkills= this.skillsService.getUsersSkills().subscribe({
    next: userdata =>{
      console.log(userdata);
      this.users = userdata;
      this.dataSource = new MatTableDataSource(this.users);
    },
    error: err => {
      console.log(err);
    }
  });
  }

  public addSkills(): void {
    //name
    const dialogRef = this.addSkillsDialog.open(AddSkillsComponent);
    // r
    dialogRef.afterClosed().subscribe(r=>this.getSkills());
  }

  public editSkills(userSkills: any): void {
    //name
    const dialogRef = this.addSkillsDialog.open(AddSkillsComponent, {
      data: userSkills,
    });
    //improve
    dialogRef.afterClosed().subscribe(r=>this.getSkills());
  }

  public deleteUserSkills(id: number): void {
    console.log(id);
    this.userSkills = this.skillsService.deleteUser(id).subscribe({
      next: d => { 
        this.getSkills();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
