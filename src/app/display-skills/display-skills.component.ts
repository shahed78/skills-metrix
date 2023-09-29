import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { IKnowladge, ISkill, IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { UploadSkillsComponent } from '../upload-skills/upload-skills.component';
import { concatMap, firstValueFrom } from 'rxjs';
import { UsersService } from '../shared/services/users.service';
import { UtilityService } from '../shared/services/utility.service';
import { DataService } from '../shared/services/data.service';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit {

  public users: IUser[] = [];
  public skills: ISkill[] = [];
  public displayeColumns = ['serial', 'name', 'email', 'start_time','completion_time', 'skills' , 'location', 'role', 'butons'];
  public dataSource: MatTableDataSource<IUser>;
  public showSpinner = false;

  @ViewChild(MatPaginator) paginator : MatPaginator;

    constructor(public dialog: MatDialog, 
      private skillsService: SkillsService, 
      private usersService: UsersService, 
      private utilityService: UtilityService,
      private dataService: DataService,
      private datePipe: DatePipe ) {}

    ngOnInit(): void {

    // Subscribe to the users and skills data from the DataService
    this.dataService.users$.subscribe(users => {
      this.users = users.sort((a, b) => a.id - b.id);
      this.setupPaginator(); // Call a method to set up the paginator
    });

    this.dataService.skills$.subscribe(skills => {
      this.skills = skills;
    });

    // Fetch the initial data
    this.dataService.fetchUsers();
    this.dataService.fetchSkills();
    }

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.filterPredicate) {
          this.dataSource.filterPredicate = (data: IUser, filter: string) => this.tableFilter(data, filter);
      }
    }

    private tableFilter(tableDdata: IUser, filter: string) {
  
        return tableDdata.name.toLowerCase().includes(filter) || 
                tableDdata.email.toLowerCase().includes(filter) || 
                tableDdata.location.toLowerCase().includes(filter) ||
                tableDdata.role.toLowerCase().includes(filter) ||
                this.formatSkills(tableDdata.skillsMultiCtrl).toLowerCase().includes(filter);
    }

    public formatSkills(skillsMultiCtrl: ISkill[]): string { // type
      return skillsMultiCtrl.map(skill => skill.name).join(', ');
    }

    private setupPaginator(): void {
      if (this.paginator) {
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.paginator.length = this.users.length;
        this.dataSource.filterPredicate = (data: IUser, filter: string) => this.tableFilter(data, filter);
      }
    }

    public editUser(user: IUser): void {

      const dialogRef = this.dialog.open(AddSkillsComponent, {
        data: user
      });

      dialogRef.afterClosed().subscribe(()=>this.dataService.fetchUsers());
    }

    public deleteUser(id: number): void {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        data: this.users.filter(t=> t.id===id)[0]
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.usersService.deleteUser(id).subscribe({
            next: () => {
              this.dataService.fetchUsers();
              this.utilityService.notification('User removed successfully');
            },
            error: (err) => {
              console.log(err);
              this.utilityService.notification('Failed to remove skill. Please try again later.');
            },
          });
        }
      });
    }
}
