import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ExcelData, ISkill } from '../shared/interfaces/data.interface';
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

  constructor(private dialogRef: MatDialogRef<UploadSkillsComponent>, private skillsService: SkillsService ){}

  ngOnInit(): void {
    this.skillsService.getSkills().subscribe({ // unsubcribe
      next: skills => {
        this.skills = skills;
        console.log( this.skills);
        //notification
      },
      error: err => console.error('An error occurred', err)
    });

    //unsubscribe
    this.skillsService.getUsers().subscribe({
    next: userdata =>{
      this.currentusers = userdata;
    },
    error: err => {
      console.log(err);
    }
  });
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

  public onUploadExcel(): void {
    const convertedData: any = this.formatChange(this.importedUserData); // interface
    console.log(convertedData);
    
    this.addItemsIteratively(convertedData).then(() => {
      console.log('task completed');
    });

    this.dialogRef.close();
  }

  public async addItemsIteratively(convertedData: any): Promise<void> {
    console.log(convertedData);
    // Your code to add items iteratively
    const batchSize = 5; // Adjust the batch size as needed
    const delayBetweenBatches = 2000; // Adjust the delay (in milliseconds) between batches as needed

    for (let i = 0; i < convertedData.length; i += batchSize) {
      const batch = convertedData.slice(i, i + batchSize);

      for (const item of batch) {
        // await this.skillsService.addSkills(item).toPromise();
        await firstValueFrom(this.skillsService.addSkills(item));
      }

      await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
    }
  }  

}
