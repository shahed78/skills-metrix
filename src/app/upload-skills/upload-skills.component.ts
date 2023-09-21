import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ExcelData, ISkill, IUser, UserInfo } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { firstValueFrom } from 'rxjs';
import { DisplaySkillsComponent } from '../display-skills/display-skills.component';

@Component({
  selector: 'app-upload-skills',
  templateUrl: './upload-skills.component.html',
  styleUrls: ['./upload-skills.component.scss']
})
export class UploadSkillsComponent implements OnInit {

  private importedUserData: ExcelData[];
  private skills: ISkill[] = [];
  private currentUsers: IUser[] = [];
  public isFileSelected = false;

  constructor(
    private dialogRef: MatDialogRef<UploadSkillsComponent>, 
    private skillsService: SkillsService,
    private displaySkillsComponent: DisplaySkillsComponent,
    @Inject(MAT_DIALOG_DATA) public dialogUserData: UserInfo ){ }

  ngOnInit(): void {
    this.currentUsers = this.dialogUserData.users;
    this.skills = this.dialogUserData.skills;
  }


  public onFileSelected(event: Event) {

    const file = event.target as HTMLInputElement;
    
    if (file.files && file.files[0]) {
      const fileReader = new FileReader();

      fileReader.readAsBinaryString(file.files[0]);

      fileReader.onload = () => {
        const workbook = XLSX.read(fileReader.result as string, { type: 'binary', cellDates: true });
        const sheetNames = workbook.SheetNames as string[]; // all sheet array
        this.importedUserData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]) as ExcelData[];
      };

      this.isFileSelected = true;
    }
  }

  private formatChange(excelData: ExcelData[]): IUser[] {
    const formattedData = excelData.map((item: ExcelData) => {
    const skillsMultiCtrl: ISkill[] = []; 

      // Iterate over object properties dynamically and add them to skillsMultiCtrl
      for (const key in item) {
        
          if (key !== "ID" && key !== "Start time" && key !== "Completion time" && key !== "Email" && key !== "Name") {
            const values = (item[key] as string).split(';').filter((value: string) => value.trim() !== '');

            values.map(skill => {
              //type of this.skills implement later
              const foundSkills = this.skills.filter((items: { name: string; type: string; id: number })=> items.name === skill && items.type === key);
              // const foundSkills = this.skills.filter((skill: ISkill) => skill.name === skills && skill.type === key); //check later
              if (foundSkills.length > 0 && foundSkills[0].id !== undefined) {
                skillsMultiCtrl.push({
                  name: skill as string,
                  type: key as string,
                  id: foundSkills[0].id as number 
              });
            } else {
                console.log("Object or 'id' property not found.");
            }
            });

          }
         
      }
      return {
          id: item.ID as number,
          name: item.Name as string,
          email: item.Email as string,
          start_time: item["Start time"] as string,
          completion_time: item["Completion time"] as string,
          skillsMultiCtrl: skillsMultiCtrl as ISkill[]
      };

  });

  return formattedData
  }

  public async onUploadExcel(): Promise<void> {

    const convertedExcelData: IUser[] = this.formatChange(this.importedUserData) as IUser[]; 
    this.dialogRef.close();

    try {
      if (this.currentUsers.length > 0) {
        await this.processUsersInSequence(this.currentUsers, this.deleteUser.bind(this));
        console.log('Removal task completed');
      }
  
      if(convertedExcelData.length > 0){
        await this.processUsersInSequence(convertedExcelData, this.addUser.bind(this));
        console.log('Addition task completed');
        this.displaySkillsComponent.getUsers();
      } else {
        throw new Error('No data to upload.'); // Handle the case when no data is selected.
      }
      
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during removal or addition
      throw error;
    }

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

  private async addUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.addSkills(user));
    } catch (error) {
      console.log('problem in adding user');
    }
    
  }

  private async deleteUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.skillsService.deleteUser(user.id));
    } catch (error) {
      console.log('problem in deleting user');
    }
    
  }

}
