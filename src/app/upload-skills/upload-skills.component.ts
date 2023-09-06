import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { ExcelData, ISkill } from '../shared/interfaces/data.interface';

@Component({
  selector: 'app-upload-skills',
  templateUrl: './upload-skills.component.html',
  styleUrls: ['./upload-skills.component.scss']
})
export class UploadSkillsComponent {

  private importedUserData: any;

  constructor(private dialogRef: MatDialogRef<UploadSkillsComponent>){}

  public onFileSelected(event: any) {
    let file = event.target.files[0];

    let fileReader = new FileReader();

    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      let workbook = XLSX.read(fileReader.result, { type: 'binary' });
      let sheetNames = workbook.SheetNames; // all sheet array
      this.importedUserData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);
    };
  }

  protected formatChange(excelData: ExcelData[]) {
    return excelData.map(item => {

      const skillsMultiCtrl: { name: string; type: string; }[] = []; // refactor with ISkill

      // Iterate over object properties dynamically and add them to skillsMultiCtrl
      for (const key in item) {
        
          if (key !== "ID" && key !== "Start time" && key !== "Completion time" && key !== "Email" && key !== "Name") {
            const values = (item[key] as string).split(';').filter(value => value.trim() !== '');
           
            values.map(skills => {
                 skillsMultiCtrl.push({
                  name: skills,
                  type: key,
              });
            });

          }
         
      }

      return {
          u_id: item.ID,
          name: item.Name,
          email: item.Email,
          startdate: item["Start time"],
          completionTime: item["Completion time"],
          skillsMultiCtrl: skillsMultiCtrl,
      };

  });
  }

  public uploadExcel(): void {
    console.log(this.formatChange(this.importedUserData));
    this.dialogRef.close();
  }

}
