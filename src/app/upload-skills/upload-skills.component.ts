import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ExcelData, ISkill, IUser, UserInfo } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-upload-skills',
  templateUrl: './upload-skills.component.html',
  styleUrls: ['./upload-skills.component.scss']
})
export class UploadSkillsComponent implements OnInit{

  private importedUserData: ExcelData[];
  private skills: ISkill[] = [];
  private currentusers: IUser[] = [];

  constructor(
    private dialogRef: MatDialogRef<UploadSkillsComponent>, 
    private skillsService: SkillsService,
    @Inject(MAT_DIALOG_DATA) public dialogUserData: UserInfo ){}

  ngOnInit(): void {
    this.currentusers = this.dialogUserData.users;
    this.skills = this.dialogUserData.skills;
  }


  public onFileSelected(event: Event) {

    const file = event.target as HTMLInputElement;
    
    if (file.files && file.files[0]) {
      const fileReader = new FileReader();

      fileReader.readAsBinaryString(file.files[0]);

      fileReader.onload = () => {
        const workbook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
        const sheetNames = workbook.SheetNames; // all sheet array
        this.importedUserData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
      };
    }
  }

  protected formatChange(excelData: ExcelData[]) {
    const formattedData = excelData.map(item => {
    
      const skillsMultiCtrl: ISkill[] = []; 

      // Iterate over object properties dynamically and add them to skillsMultiCtrl
      for (const key in item) {
        
          if (key !== "ID" && key !== "Start time" && key !== "Completion time" && key !== "Email" && key !== "Name") {
            const values = (item[key] as string).split(';').filter(value => value.trim() !== '');

            values.map(skills => {
              //type of this.skills implement later
              const foundSkills = this.skills.filter((items: { name: string; type: string; id: number })=> items.name === skills && items.type === key);
              if (foundSkills.length > 0 && foundSkills[0].id !== undefined) {
                skillsMultiCtrl.push({
                  name: skills,
                  type: key,
                  id: foundSkills[0].id
              });
            } else {
                console.log("Object or 'id' property not found.");
            }
            });

          }
         
      }
      return {
          id: item.ID,
          name: item.Name,
          email: item.Email,
          start_time: item["Start time"],
          completion_time: item["Completion time"],
          skillsMultiCtrl: skillsMultiCtrl,
      };

  });

  return formattedData
  }

  public async onUploadExcel(): Promise<void> {

    const convertedExceldData: IUser[] = this.formatChange(this.importedUserData); // interface

    try {
      if (this.currentusers.length > 0) {
        await this.processUsersInSequence(this.currentusers, this.deleteUser.bind(this));
        console.log('Removal task completed');
      }
  
      if(convertedExceldData.length > 0){
        await this.processUsersInSequence(convertedExceldData, this.addUser.bind(this));
        console.log('Addition task completed');
      }
      
      this.dialogRef.close();
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during removal or addition
    }

  }

  private async processUsersInSequence(users: IUser[], actionFunction: (user: IUser) => Promise<void> ) {
    //Remove magic numbers and strings from your code. 
    const batchSize = 5; // Adjust the batch size as needed
    const delayBetweenBatches = 2000; // Adjust the delay (in milliseconds) between batches as needed

    for (let i = 0; i < users.length; i += batchSize) {
      const userBatch = users.slice(i, i + batchSize);
      
      for (const eachUser of userBatch) {
        await actionFunction(eachUser);     
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }

  }

  private async addUser(user: IUser): Promise<void> {
    await firstValueFrom(this.skillsService.addSkills(user));
  }

  private async deleteUser(user: IUser): Promise<void> {
    await firstValueFrom(this.skillsService.deleteUser(user.id));
  }

}
