import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddskillsService } from './addskills.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  myForm: FormGroup;

  constructor (private addSkillsService: AddskillsService, private dialogRef: DialogRef<AddSkillsComponent>){}

  ngOnInit() {
    this.myForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      startdate: new FormControl('', [Validators.required]),
      enddate: new FormControl('', [Validators.required]),
    });
}

onSubmit() {
    if (this.myForm.invalid) {
      // If the form is invalid, do not submit
      return;
    }

    this.addSkillsService.addSkills(this.myForm.value).subscribe({  
      next: response => {
        console.log('Successfully added: ', response);
        this.dialogRef.close();
      },  
      error: err => console.error('An error occurred', err),  
      complete: () => console.log('complete')  
    });


  }

}