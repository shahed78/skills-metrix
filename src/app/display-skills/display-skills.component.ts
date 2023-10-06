import { Component, OnInit, ViewChild } from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ISkill, IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { UsersService } from '../shared/services/users.service';
import { UtilityService } from '../shared/services/utility.service';

import * as XLSX from 'xlsx';

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
      private utilityService: UtilityService
      ) {}

    ngOnInit(): void {

    // Subscribe to the users and skills data from service
    this.usersService.users$.subscribe(users => {
      this.users = users.sort((a, b) => a.id - b.id);
      this.setupPaginator(); // Call a method to set up the paginator
    });

    this.skillsService.skills$.subscribe(skills => {
      this.skills = skills;
    });

    // Fetch the initial data
    this.usersService.fetchUsers();
    this.skillsService.fetchSkills();
    }

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.filterPredicate) {
          this.dataSource.filterPredicate = (data: IUser, filter: string) => this.tableFilter(data, filter);
      }
    }

    private tableFilter(tableDdata: IUser, filter: string) {
  

        if (!filter) {
          return true; // No filter applied, show all data
        }

        const lowerCaseFilter = filter.toLowerCase();

        return (tableDdata.name && tableDdata.name.toLowerCase().includes(lowerCaseFilter)) ||
        (tableDdata.email && tableDdata.email.toLowerCase().includes(lowerCaseFilter)) ||
        (tableDdata.location && tableDdata.location.toLowerCase().includes(lowerCaseFilter)) ||
        (tableDdata.role && tableDdata.role.toLowerCase().includes(lowerCaseFilter)) ||
        (tableDdata.skillsMultiCtrl && this.formatSkills(tableDdata.skillsMultiCtrl).toLowerCase().includes(lowerCaseFilter))
    }

    public formatSkills(skillsMultiCtrl: ISkill[]): string { 
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

      dialogRef.afterClosed().subscribe(()=>this.usersService.fetchUsers());
    }

    public deleteUser(id: number): void {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        data: this.users.filter(t=> t.id===id)[0]
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.usersService.deleteUser(id).subscribe({
            next: () => {
              this.usersService.fetchUsers();
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

    // revise later
    exportToExcel(user: any) {
      const groupedSkills = this.groupByNameType(user.skillsMultiCtrl);
      console.log('groupedSkills', groupedSkills);
      const arrayForExport = this.fromMultiToOneDimentalArray(groupedSkills);
      console.log('arrayForExport', arrayForExport);
      this.appendExcel(arrayForExport, user.name);
    }

    private appendExcel(data: any, name: string){
      //  const transposedData = this.transposeData(data);
      const transformArray = data.map((item: any) => [item]);
      console.log(transformArray);

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(transformArray);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, `${name}.xlsx`);
    }


    private fromMultiToOneDimentalArray(multi: any) {
      const arr = [];
    
      for (const type in multi) {
        if (type in multi) {
          arr.push(type,'', ...multi[type], ''); 
        }
      }

      return arr;
    }
    
    public groupByNameType(skillsArray: { name: string; type: string; id: number }[]) {
      const groupedSkills: { [key: string]: string[] } = {};

      skillsArray.forEach(skill => {
          const { name, type } = skill;
          if (!groupedSkills[type]) {
              groupedSkills[type] = [];
          }
          groupedSkills[type].push(name);
      });
      return groupedSkills;
    }
}
