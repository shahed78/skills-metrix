import { Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ISkill, IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { UploadSkillsComponent } from '../upload-skills/upload-skills.component';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit, OnDestroy {

  public users: IUser[] = [];
  public userInfo: any;
  public skills: ISkill[] = [];

  displayeColumns = ['serial', 'name', 'email', 'start_time','completion_time', 'skills' ,'butons'];
  dataSource: MatTableDataSource<IUser>;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator : MatPaginator;

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private skillsService: SkillsService ) {}

  ngOnInit(): void {
    this.getUsers();

    // get skills // pass skills to add - edit // think
    this.skillsService.getSkills().subscribe({
      next: skills => {
        this.skills = skills;

      },
      error: err => console.error('An error occurred', err)
    });

  }

  public formatSkills(skillsMultiCtrl: any[]): string { // type
    return skillsMultiCtrl.map(skill => skill.name).join(', ');
  }

  public getUsers(): void {
  //unsubscribe // check and put correct names 
  this.userInfo= this.skillsService.getUsers().subscribe({
    next: userdata =>{
      this.users = userdata;
      console.log(this.users);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator; // Set the paginator
      this.paginator.length = this.users.length; // Set the length property
    },
    error: err => {
      console.log(err);
    }
  });
  }

  public addUser(): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent);
    // r
    dialogRef.afterClosed().subscribe(r=>this.getUsers());
  }

  public editUser(user: any): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent, {
      data: user
    });
    //improve
    dialogRef.afterClosed().subscribe(r=>this.getUsers());
  }

  public deleteUser(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: {
        user: this.users.filter(t=> t.id===id)[0] // Pass the userSkills object to the dialog
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User confirmed deletion, perform the delete action
        this.skillsService.deleteUser(id).subscribe({
          next: (d) => {
            this.getUsers();
            this.skillsService.notification('Skill removed successfully');
          },
          error: (err) => {
            console.log(err);
            this.skillsService.notification('Failed to remove skill. Please try again later.');
          },
        });
      }
    });
  }

  public openUploadDialog(): void {
    const dialogRef = this.dialog.open(UploadSkillsComponent, {
      width: '400px',
      data: { users: this.users, skills: this.skills},
    });

    dialogRef.afterClosed().subscribe(r=>this.getUsers());
  }

  ngOnDestroy(): void {
    this.userInfo.unsubscribe();
  }
}
