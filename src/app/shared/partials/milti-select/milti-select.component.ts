import { Component, ViewChild, ElementRef, Input, OnInit, OnChanges, SimpleChanges, EventEmitter, Output  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { ISkill } from '../../interfaces/data.interface';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-milti-select',
  templateUrl: './milti-select.component.html',
  styleUrls: ['./milti-select.component.scss']
})
export class MiltiSelectComponent implements OnChanges {

  public filteredSkillsMulti: ReplaySubject<ISkill[]> = new ReplaySubject<ISkill[]>(1);
  protected _onDestroy = new Subject<void>();
  @Input() skills: ISkill[] = [];
  @Input() selectedSkills: ISkill[] = [];
  @Output() skillsSelected = new EventEmitter<any[]>();
  @ViewChild('multiSelect', { static: false }) multiSelect!: MatSelect;
  multiSelectForm: FormGroup;
  skillsMultiFilterCtrlName: string = 'skillsMultiFilterCtrl';

  constructor(private fb: FormBuilder) {
    this.multiSelectForm = this.fb.group({
      skillsMultiCtrl: [],
      skillsMultiFilterCtrl: ['']
    });

   }

   ngOnInit() {
    // Existing code...
  
    // Subscribe to the form control value changes
    this.multiSelectForm.get('skillsMultiCtrl')?.valueChanges.subscribe((selectedSkills) => {
      console.log('asdasd');
      console.log(selectedSkills);
      // this.selectedSkills = selectedSkills;
      this.emitSelectedSkills(selectedSkills);
    });
  }

  emitSelectedSkills(selectedSkills: any) { //any
    // const selectedSkills = this.multiSelectForm.get('skillsMultiCtrl')?.value;
    console.log(selectedSkills);
    this.skillsSelected.emit(selectedSkills);
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['skills'] && !changes['skills'].firstChange) {
      // Skills input has changed, update filtering logic or anything else
      console.log('onchanges', this.skills);
      console.log(this.selectedSkills);
      this.multiSelectForm.get('skillsMultiCtrl')?.setValue(this.selectedSkills);
           // multi select
        console.log('Successfully get skills2: ', this.skills);
        this.filteredSkillsMulti.next(this.skills.slice());

        // Access the form control using this.bankMultiForm.get
        this.multiSelectForm.get('skillsMultiFilterCtrl')?.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSkillsMulti();
          });
    }
  }

  // multi select
protected filterSkillsMulti() {
  console.log('filterSkilsMulti', this.skills);
  if (!this.skills) {
    return;
  }
  let search = this.multiSelectForm.get('skillsMultiFilterCtrl')?.value;
  if (!search) {
    this.filteredSkillsMulti.next(this.skills.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredSkillsMulti.next(
    this.skills.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
  );

  const selectedSkills = this.multiSelectForm.get('skillsMultiCtrl')?.value;
  console.log(selectedSkills);
}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

ngAfterViewInit() {
  this.setInitialValue();
}

protected setInitialValue() {
  console.log('setInitialValue');
  // this.multiSelectForm.get('skillsMultiCtrl')?.setValue(this.selectedSkills);
  console.log(this.selectedSkills);
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
}