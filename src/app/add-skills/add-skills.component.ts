import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { SkillsService } from '../shared/services/skills.service';
import { ISkill } from '../shared/interfaces/data.interface';
import { Observable, ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  skillsForm: FormGroup;
  skills: ISkill[] = []; //banks
  selectedSkills: ISkill[] = [];
  // skillsSelected: any;
  // multiSelectForm: any;
  public filteredSkillsMulti: ReplaySubject<ISkill[]> = new ReplaySubject<ISkill[]>(1);
  @ViewChild('multiSelect', { static: false }) multiSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();
  skillsMultiFilterCtrlName: string = 'skillsMultiFilterCtrl';
  
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
        skillsMultiCtrl: [],
        skillsMultiFilterCtrl: ['']
      });
    }

  ngOnInit() {
    this.skillsService.getSkills().subscribe({  
      next: skills => {
        console.log('Successfully get skills: ', skills);
        this.skills = skills;
        console.log( this.skillsForm.get('skillsMultiFilterCtrl')?.value);
        this.selectedSkills = this.skillsForm.get('skillsMultiFilterCtrl')?.value

        // multi select
        // console.log('Successfully get skills2: ', this.skills);
        this.filteredSkillsMulti.next(this.skills.slice());

        // Access the form control using this.bankMultiForm.get
        this.skillsForm.get('skillsMultiFilterCtrl')?.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSkillsMulti();
          });

      },  
      error: err => console.error('An error occurred', err)
    });

    // this.skillsForm.get('skillsMultiCtrl')?.valueChanges.subscribe((selectedSkills: ISkill[]) => {
    //   // this.selectedSkills = selectedSkills;
    //   console.log(selectedSkills);
    // });
// console.log('patch value');
// console.log(this.dialogdata);
    this.skillsForm.patchValue(this.dialogdata);

    
}

// receiveData(data: any) {
//   // this.skillsSelected = data;
//   console.log(data);
//   this.skillsForm.get('skillsMultiFilterCtrl')?.setValue(data)
// }
// // multi select
protected filterSkillsMulti() {
  console.log('filterBanksMulti', this.skills);
  if (!this.skills) {
    return;
  }
  let search = this.skillsForm.get('skillsMultiFilterCtrl')?.value;
  if (!search) {
    this.filteredSkillsMulti.next(this.skills.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredSkillsMulti.next(
    this.skills.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
  );
}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

ngAfterViewInit() {
  this.setInitialValue();
}

protected setInitialValue() {
  this.filteredSkillsMulti
    .pipe(take(1), takeUntil(this._onDestroy))
    .subscribe(() => {
      // setting the compareWith property to a comparison function
      // triggers initializing the selection according to the initial value of
      // this needs to be done after the filteredskills are loaded initially
      // and after the mat-option elements are available
      this.multiSelect.compareWith = (a: ISkill, b: ISkill) => a && b && a.id === b.id;
    });
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