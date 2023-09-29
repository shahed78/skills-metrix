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
      // this.getUsers();
      // this.getSkills();

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


    private dateToTransform(dateString: string) {
      return  dateString ? this.datePipe.transform(new Date(dateString), 'dd/MM/yyyy HH:mm:ss') || '' : ''
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

    public addUser(): void {
      //name
      const dialogRef = this.dialog.open(AddSkillsComponent);
      dialogRef.afterClosed().subscribe(()=>this.dataService.fetchUsers());
    }

    public editUser(user: IUser): void {
      //name
      const dialogRef = this.dialog.open(AddSkillsComponent, {
        data: user
      });
      //improve
      dialogRef.afterClosed().subscribe(()=>this.dataService.fetchUsers());
    }

    public deleteUser(id: number): void {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        data: this.users.filter(t=> t.id===id)[0]
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // User confirmed deletion, perform the delete action
          this.usersService.deleteUser(id).subscribe({
            next: () => {
              // this.getUsers();
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

    public openUploadDialog(): void {
      const dialogRef = this.dialog.open(UploadSkillsComponent, {
        width: '400px',
        data: { users: this.users, skills: this.skills },
      });
    
      dialogRef
        .afterClosed()
        .pipe(
          concatMap(async (result: { convertedExcelData: IUser[], excelSkills: { name: string, type: string }[] }) => {
            const { convertedExcelData, excelSkills } = result;
            if(convertedExcelData || excelSkills) {
              this.showSpinner = true;
              const excelSkillsToAdd = this.skillsToAdd(excelSkills);

              if (excelSkillsToAdd.length > 0) {
                await this.addExcelSkills(excelSkillsToAdd);
              }

              const newUserToInsert = convertedExcelData.filter(user1 => !this.users.some(user2 => user2.id === user1.id));
              const updateNewExcelDataRecordDifference = convertedExcelData.filter(item2 =>
                  this.users.some(item1 => item1.id === item2.id && this.isUserDataDifferent(item1, item2))
                );
      
              if (newUserToInsert.length > 0 || updateNewExcelDataRecordDifference.length > 0 ) {
                await this.addExcelUser(newUserToInsert, updateNewExcelDataRecordDifference);
              }
      
              this.showSpinner = false;
            }
          })
        )
        .subscribe();
    }

    private skillsToAdd(excelSkills: IKnowladge[]) {
      return excelSkills.filter((excelSkill: IKnowladge) => !this.skills.some((skill: IKnowladge) => skill.name === excelSkill.name));
    }

    public async addExcelSkills(excelSkillsToAdd: IKnowladge[]): Promise<void> {
      try {
          await this.utilityService.processInSequence(excelSkillsToAdd, this.addSkills.bind(this));
          // this.getSkills();
          this.dataService.fetchSkills()
          console.log('Skill addition task completed');
      } catch (error) {
        console.error('Error:', error);
        // Handle any errors that may occur during eddit or addition
        throw error;
      }
  }

  public async addExcelUser(addUsers: IUser[], editUsers: IUser[]): Promise<void> {

    try {
      if(addUsers.length > 0){
        await this.utilityService.processInSequence(addUsers, this.addImportedUser.bind(this));
        // this.getUsers();
        this.dataService.fetchUsers()
        console.log('Addition task completed');
        }

      if(editUsers.length > 0){
        await this.utilityService.processInSequence(editUsers, this.editImportedUser.bind(this));
        // this.getUsers();
        this.dataService.fetchUsers()
        console.log('Edit task completed');
      }
      
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during eddit or addition
      throw error;
    }

  }

  private isUserDataDifferent(userA: IUser, userB: IUser): boolean {
    return (
      userA.name !== userB.name ||
      userA.email !== userB.email ||
      this.dateToTransform(userA.start_time) !== this.dateToTransform(userB.start_time) || 
      this.dateToTransform(userA.completion_time) !== this.dateToTransform(userB.completion_time) || 
      !this.areSkillsEqual(userA.skillsMultiCtrl, userB.skillsMultiCtrl)
    );
  }

  // Function to check if two arrays of skills are equal
  private areSkillsEqual(skillsA: ISkill[], skillsB: ISkill[]): boolean {
    if (skillsA.length !== skillsB.length) {
      return false;
    }

    for (let i = 0; i < skillsA.length; i++) {
      if (
        skillsA[i].name !== skillsB[i].name ||
        skillsA[i].type !== skillsB[i].type ||
        skillsA[i].id !== skillsB[i].id
      ) {
        return false;
      }
    }

    return true;
  }

  private async addImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.usersService.addUser(user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async editImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.usersService.editUser(user.id, user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async addSkills(skills:IKnowladge): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addSkills(skills));
    } catch (error) {
      console.log('problem in adding skills');
    }
  }

}
