import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AddskillsService } from './addskills.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  myForm: FormGroup;

  constructor (
    private addSkillsService: AddskillsService, 
    private dialogRef: DialogRef<AddSkillsComponent>, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
    ){
      this.myForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        startdate: ['', Validators.required],
        enddate: ['', Validators.required],
      });
    }

  ngOnInit() {
    // this.myForm = this.fb.group({
    //   firstname: ['', Validators.required],
    //   lastname: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   startdate: ['', Validators.required],
    //   enddate: ['', Validators.required],
    // });

    this.myForm.patchValue(this.data);
}

onSubmit(): void {
    if (this.myForm.invalid) {
      // If the form is invalid, do not submit
      return;
    }

    if(this.data){

      this.addSkillsService.editSkills(this.data.id, this.myForm.value).subscribe({  
        next: response => {
          console.log('Successfully edited: ', response);
          this.dialogRef.close();
        },  
        error: err => console.error('An error occurred', err),  
        complete: () => console.log('complete')  
      });

    }else{
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

}