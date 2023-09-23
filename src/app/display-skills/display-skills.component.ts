import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ISkill, IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { UploadSkillsComponent } from '../upload-skills/upload-skills.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})


export class DisplaySkillsComponent implements OnInit {

  public users: IUser[] = [];
  public skills: ISkill[] = [];
  public displayeColumns = ['serial', 'name', 'email', 'start_time','completion_time', 'skills' ,'butons'];
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

    this.skillsService.getSkills().subscribe({
      next: skills => {
        this.skills = skills;

      },
      error: err => console.error('An error occurred', err)
    });
  }

  private tableFilter(tableDdata: IUser, filter: string) {
 
      return tableDdata.name.toLowerCase().includes(filter) || 
              tableDdata.email.toLowerCase().includes(filter) || 
              this.dateToTransform(tableDdata.start_time).includes(filter) || 
              this.dateToTransform(tableDdata.completion_time).includes(filter) ||
              tableDdata.id.toString().includes(filter) ||
              this.formatSkills(tableDdata.skillsMultiCtrl).toLowerCase().includes(filter);
  }

  // // Helper function to convert a date to a formatted string or return an empty string if it's not a valid date
  // private formatDate(date: string | Date): string {
  //   if (date instanceof Date && !isNaN(date.getTime())) {
  //     return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm:ss') || '';
  //   }
  //   return '';
  // }

  // // Helper function to perform case-insensitive filtering on a string
  // private filterString(text: string, filter: string): boolean {
  //   return text.toLowerCase().includes(filter);
  // }

  private dateToTransform(dateString: string) {
    return  dateString ? this.datePipe.transform(new Date(dateString), 'dd/MM/yyyy HH:mm:ss') || '' : ''
  }

  public formatSkills(skillsMultiCtrl: ISkill[]): string { // type
    return skillsMultiCtrl.map(skill => skill.name).join(', ');
  }

  public getUsers(): void {

    this.skillsService.getUsers()
    .subscribe({
      next: userdata =>{
        this.users = userdata;

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
      data: { users: this.users, skills: this.skills},
    });

    dialogRef.afterClosed().subscribe(async (ExcelData) => {
      if (ExcelData ) {
        this.showSpinner = true;
        // User confirmed deletion, perform the delete action
           try {
              if (this.users.length > 0) {
                await this.processUsersInSequence(this.users, this.deleteStoredUser.bind(this));
                console.log('Removal task completed');
              }
          
              if(ExcelData.length > 0){
                await this.processUsersInSequence(ExcelData, this.addImportedUser.bind(this));
                
                this.getUsers();
                console.log('Addition task completed');
              } else {
                throw new Error('No data to upload.'); // Handle the case when no data is selected.
              }
              
            } catch (error) {
              console.error('Error:', error);
              // Handle any errors that may occur during removal or addition
              throw error;
            } finally {
              this.showSpinner = false;
            }
      }
    });

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

  private async processBatch(users: IUser[], actionFunction: (user: IUser) => Promise<void>): Promise<void> {
    try {
      for (const user of users) {
        await actionFunction(user);
      }
    } catch (error) {
     console.log('error in processing batch')
    }
  }

  private async addImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addSkills(user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async deleteStoredUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.deleteUser(user.id));
    } catch (error) {
      console.log('problem in deleting user');
    }
  }
}
