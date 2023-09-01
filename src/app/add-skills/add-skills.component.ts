import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { SkillsService } from '../shared/services/skills.service';
import { ISkill } from '../shared/interfaces/data.interface';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  skillsForm: FormGroup;
  skills: ISkill[] = [];
  
  
  constructor (
    private skillsService: SkillsService, 
    private dialogRef: DialogRef<AddSkillsComponent>, 
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogdata: any
    ){
      this.skillsForm = this.fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        startdate: ['', Validators.required],
        enddate: ['', Validators.required],
      });
    }

  ngOnInit() {
    this.skillsService.getSkills().subscribe({  
      next: skills => {
        console.log('Successfully get skills: ', skills);
        this.skills = skills;
      },  
      error: err => console.error('An error occurred', err)
    });

    this.skillsForm.patchValue(this.dialogdata);
}

onSubmit(): void {
    if (this.skillsForm.invalid) {
      // If the form is invalid, do not submit
      return;
    }

    if(this.dialogdata){

      this.skillsService.editSkills(this.dialogdata.id, this.skillsForm.value).subscribe({  
        next: response => {
          // console.log('Successfully edited: ', response);
          this.dialogRef.close();
        },  
        error: err => console.error('An error occurred', err),  
        complete: () => console.log('complete')  
      });

    }else{
      this.skillsService.addSkills(this.skillsForm.value).subscribe({  
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