import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ExcelData, ISkill, IUser } from '../shared/interfaces/data.interface';
import { SkillsService } from '../shared/services/skills.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, firstValueFrom, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-upload-skills',
  templateUrl: './upload-skills.component.html',
  styleUrls: ['./upload-skills.component.scss']
})
export class UploadSkillsComponent implements OnInit{

  private importedUserData: any;
  // public skills: ISkill[] = [];
  public skills: any= [];
  public currentusers: any=[];

  constructor(
    private dialogRef: MatDialogRef<UploadSkillsComponent>, 
    private skillsService: SkillsService,
    @Inject(MAT_DIALOG_DATA) public dialogUserData: any ){}

  ngOnInit(): void {
    this.currentusers = this.dialogUserData.users;
    this.skills = this.dialogUserData.skills;
  }


  public onFileSelected(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      let workbook = XLSX.read(fileReader.result, { type: 'binary', cellDates: true });
      let sheetNames = workbook.SheetNames; // all sheet array
      this.importedUserData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    };
  }

  protected formatChange(excelData: ExcelData[]) {
    const formattedData = excelData.map(item => {
    
      const skillsMultiCtrl: { name: string; type: string; id: number }[] = []; // refactor with ISkill
      const skillsDropDpwn: { name: string; type: string; }[] = []; // check use of this

      // Iterate over object properties dynamically and add them to skillsMultiCtrl
      for (const key in item) {
        
          if (key !== "ID" && key !== "Start time" && key !== "Completion time" && key !== "Email" && key !== "Name") {
            const values = (item[key] as string).split(';').filter(value => value.trim() !== '');

            values.map(skills => {
              //type of this.skills implement later
              const foundSkills = this.skills.filter((items: { name: string; type: string; id: number })=> items.name === skills && items.type === key);
              if (foundSkills.length > 0 && foundSkills[0].hasOwnProperty("id")) {
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
          completion_time:  item["Completion time"],
          skillsMultiCtrl: skillsMultiCtrl,
      };

  });

  return formattedData
  }

  public async onUploadExcel(): Promise<void> {
    const converteExceldData: any = this.formatChange(this.importedUserData); // interface

    try {
      if (this.currentusers.length > 0) {
        await this.processUsersInSequence(converteExceldData, this.deleteUser.bind(this));
        console.log('Removal task completed');
      }
  
      if(converteExceldData.length > 0){
        await this.processUsersInSequence(converteExceldData, this.addUser.bind(this));
        console.log('Addition task completed');
      }
      
      this.dialogRef.close();
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during removal or addition
    }

    
  }

  private async processUsersInSequence(users: IUser[], actionFunction: (user: IUser) => Promise<void> ) {
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
