import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { UploadSkillsComponent } from '../upload-skills/upload-skills.component';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit, AfterViewInit, OnDestroy {

  public users: IUser[] = [];
  public userSkills: any;

  displayeColumns = ['serial', 'name', 'email', 'start_time','completion_time', 'skills' ,'butons'];
  dataSource: MatTableDataSource<IUser>;
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator : MatPaginator;

  ngAfterViewInit() {
    // no ned to set the paginator here as its not available
    // this.dataSource.paginator = this.paginator;
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(public dialog: MatDialog, private skillsService: SkillsService ) {}

  ngOnInit(): void {
    this.getSkills();
  }

  public formatSkills(skillsMultiCtrl: any[]): string { // type
    return skillsMultiCtrl.map(skill => skill.name).join(', ');
  }

  public getSkills(): void {
  //unsubscribe
  this.userSkills= this.skillsService.getUsers().subscribe({
    next: userdata =>{
      this.users = userdata;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator; // Set the paginator
      this.paginator.length = this.users.length; // Set the length property
    },
    error: err => {
      console.log(err);
    }
  });
  }

  public addSkills(): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent);
    // r
    dialogRef.afterClosed().subscribe(r=>this.getSkills());
  }

  public editSkills(userSkills: any): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent, {
      data: userSkills,
    });
    //improve
    dialogRef.afterClosed().subscribe(r=>this.getSkills());
  }

  public deleteUserSkills(id: number): void {
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
            this.getSkills();
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
    });

    dialogRef.afterClosed().subscribe(r=>this.getSkills());
  }

  ngOnDestroy(): void {
    this.userSkills.unsubscribe();
  }
}
