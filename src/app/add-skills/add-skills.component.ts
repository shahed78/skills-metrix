import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { SkillsService } from '../shared/services/skills.service';
import { ISkill } from '../shared/interfaces/data.interface';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  myForm: FormGroup;
  skills: ISkill[] = [];
  
  
  constructor (
    private skillsService: SkillsService, 
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
        selectedSkills: [[]],
      });
    }

  ngOnInit() {
    this.skillsService.getSkills().subscribe({  
      next: skills => {
        console.log('Successfully get skills: ', skills);
        console.log(skills);
        this.skills = skills;
      },  
      error: err => console.error('An error occurred', err)
    });

    this.myForm.patchValue(this.data);
}

onSubmit(): void {
    if (this.myForm.invalid) {
      // If the form is invalid, do not submit
      return;
    }

    if(this.data){

      this.skillsService.editSkills(this.data.id, this.myForm.value).subscribe({  
        next: response => {
          // console.log('Successfully edited: ', response);
          this.dialogRef.close();
        },  
        error: err => console.error('An error occurred', err),  
        complete: () => console.log('complete')  
      });

    }else{
      this.skillsService.addSkills(this.myForm.value).subscribe({  
        next: response => {
          console.log('Successfully added: ', response);
          this.dialogRef.close();
        },  
        error: err => console.error('An error occurred', err),  
        complete: () => console.log('complete')  
      });
    }

  }

  compareSkills(skill1: any, skill2: any): boolean {
    return skill1 && skill2 ? skill1.name === skill2.name : skill1 === skill2;
  }

}