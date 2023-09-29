import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddSkillsComponent } from '../../../add-skills/add-skills.component';
import { UploadSkillsComponent } from '../../../upload-skills/upload-skills.component';
import { DataService } from '../../../shared/services/data.service';
import { UsersService } from '../../../shared/services/users.service';
import { SkillsService } from '../../../shared/services/skills.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { IKnowladge, ISkill, IUser } from '../../interfaces/data.interface';
import { concatMap, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './app-toolbar.component.html',
  styleUrls: ['./app-toolbar.component.scss']
})
export class AppToolbarComponent implements OnInit {

  public users: IUser[] = [];
  public skills: ISkill[] = [];
  public showSpinner = false;

  constructor(public dialog: MatDialog, 
              public dataService: DataService, 
              public utilityService: UtilityService,
              public usersService: UsersService,
              public skillsService: SkillsService,
              public spinnerService: SpinnerService,
              private datePipe: DatePipe
              ){}

  ngOnInit(): void {

    // Subscribe to the users and skills data from the DataService
    this.dataService.users$.subscribe(users => {
      this.users = users.sort((a, b) => a.id - b.id);
    });

    this.dataService.skills$.subscribe(skills => {
      this.skills = skills;
    });

    // Fetch the initial data
    this.dataService.fetchUsers();
    this.dataService.fetchSkills();
    }

    public addUser(): void {
      const dialogRef = this.dialog.open(AddSkillsComponent);
      dialogRef.afterClosed().subscribe(()=>this.dataService.fetchUsers());
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
              // this.showSpinner = true;
              
              this.spinnerService.toggleSpinner(true);
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
      
              // this.showSpinner = false;
              
              this.spinnerService.toggleSpinner(false);
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

  private async addSkills(skills:IKnowladge): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addSkills(skills));
    } catch (error) {
      console.log('problem in adding skills');
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

  private dateToTransform(dateString: string) {
    return  dateString ? this.datePipe.transform(new Date(dateString), 'dd/MM/yyyy HH:mm:ss') || '' : ''
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

}
