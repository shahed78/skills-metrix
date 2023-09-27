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

   
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.filterPredicate) {
        this.dataSource.filterPredicate = (data: IUser, filter: string) => this.tableFilter(data, filter);
    }
  }

  constructor(public dialog: MatDialog, private skillsService: SkillsService, private datePipe: DatePipe ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getSkills();
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

  private getUsers(): void {

    this.skillsService.getUsers()
    .subscribe({
      next: userdata =>{
        this.users = userdata.sort((a, b) => a.id - b.id);

        if (this.paginator) {
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.paginator = this.paginator; // Set the paginator
          this.paginator.length = this.users.length; // Set the length property
          this.dataSource.filterPredicate = (data: IUser, filter: string) => this.tableFilter(data, filter);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  private getSkills(): void {
    this.skillsService.getSkills().subscribe({
      next: skills => {
        this.skills = skills;

      },
      error: err => console.error('An error occurred', err)
    });
  }

  public addUser(): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent);
    dialogRef.afterClosed().subscribe(()=>this.getUsers());
  }

  public editUser(user: IUser): void {
    //name
    const dialogRef = this.dialog.open(AddSkillsComponent, {
      data: user
    });
    //improve
    dialogRef.afterClosed().subscribe(()=>this.getUsers());
  }

  public deleteUser(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      data: this.users.filter(t=> t.id===id)[0]
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // User confirmed deletion, perform the delete action
        this.skillsService.deleteUser(id).subscribe({
          next: () => {
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
      data: { users: this.users, skills: this.skills },
    });
  
    dialogRef
      .afterClosed()
      .pipe(
        concatMap(async (result: { convertedExcelData: IUser[], excelSkills: { name: string, type: string }[] }) => {
          const { convertedExcelData, excelSkills } = result;
  
          this.showSpinner = true;
  
          if (excelSkills) {
            console.log('skills');
            await this.addExcelSkills(excelSkills);
          }
  
          if (convertedExcelData ) {
            const newUserToInsert = convertedExcelData.filter(user1 => !this.users.some(user2 => user2.id === user1.id));
            const updateNewExcelDataRecordDifference = convertedExcelData.filter(item2 =>
              this.users.some(item1 => item1.id === item2.id && this.isUserDataDifferent(item1, item2))
            );
            console.log(newUserToInsert);
            console.log(updateNewExcelDataRecordDifference);
  
            await this.addExcelUser(newUserToInsert, updateNewExcelDataRecordDifference);
          }
  
          this.showSpinner = false;
        })
      )
      .subscribe();
  }

  private skillsToAdd(excelSkills: IKnowladge[]) {
    return excelSkills.filter((excelSkill: IKnowladge) => !this.skills.some((skill: IKnowladge) => skill.name === excelSkill.name));
  }

    public async addExcelSkills(excelSkills: IKnowladge[]): Promise<void> {
      try {
        const excelSkillsToAdd = this.skillsToAdd(excelSkills);
        if(excelSkillsToAdd.length > 0){
          await this.processInSequence(excelSkills, this.addSkills.bind(this));
          this.getUsers();
          console.log('Skill addition task completed');
        }

      } catch (error) {
        console.error('Error:', error);
        // Handle any errors that may occur during eddit or addition
        throw error;
      }
  }

  public async addExcelUser(addUsers: IUser[], editUsers: IUser[]): Promise<void> {

    try {
      if(addUsers.length > 0){
        await this.processInSequence(addUsers, this.addImportedUser.bind(this));
        this.getUsers();
        console.log('Addition task completed');
       }

      if(editUsers.length > 0){

        await this.processInSequence(editUsers, this.editImportedUser.bind(this));
        this.getUsers();
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

  private async processUsersInSequence(users: IUser[], actionFunction: (user: IUser) => Promise<void> ): Promise<void> {

    try {
      const BATCH_SIZE = 5; // Adjust the batch size as needed
      const DELAY_BETWEEN_BATCHES_MS = 2000; // Adjust the delay (in milliseconds) between batches as needed

      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const userBatch = users.slice(i, i + BATCH_SIZE);
        await this.processBatch(userBatch, actionFunction);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
      }
      
    } catch (error) {
      console.log('error in processing sequence')
    }
  }

  private async processInSequence<T>(items: T[], actionFunction: (item: T) => Promise<void>): Promise<void> {
    const BATCH_SIZE = 5; // Adjust the batch size as needed
    const DELAY_BETWEEN_BATCHES_MS = 2000; // Adjust the delay (in milliseconds) between batches as needed
    try {
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        await this.processBatch(batch, actionFunction);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
      }
    } catch (error) {
      console.log('Error in processing sequence:', error);
    }
  }

  private async processBatch<T>(items: T[], actionFunction: (item: T) => Promise<void>): Promise<void> {
    try {
      for (const item of items) {
        await actionFunction(item);
      }
    } catch (error) {
     console.log('error in processing batch')
    }
  }

  private async addImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addUser(user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async editImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.editUser(user.id, user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async addSkills(skills:IKnowladge): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addSkills(skills));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

}
