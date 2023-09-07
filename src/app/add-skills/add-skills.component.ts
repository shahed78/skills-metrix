import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { SkillsService } from '../shared/services/skills.service';
import { ISkill } from '../shared/interfaces/data.interface';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

   // Form group for handling skill information
  public skillsForm: FormGroup;
  
  // Name for the skills multi-select filter control
  public skillsMultiFilterCtrlName = 'skillsMultiFilterCtrl';
  
  // Array to hold available skill options
  public skills: ISkill[] = [];

  // Array to store selected skills
  public selectedSkills: ISkill[] = [];

  // Observable to manage filtered skill options in the multi-select
  public filteredSkillsMulti: ReplaySubject<ISkill[]> = new ReplaySubject<ISkill[]>(1);

  // Subject to manage component destruction and subscription cleanup
  protected _onDestroy = new Subject<void>();

  // Reference to the multi-select dropdown
  @ViewChild('multiSelect', { static: false }) multiSelect!: MatSelect;
 
  constructor(
    private skillsService: SkillsService,
    private dialogRef: DialogRef<AddSkillsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogdata: any
  ) {
     // Initialize the skillsForm FormGroup with necessary form controls
    this.skillsForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      start_time: ['', Validators.required],
      completion_time: ['', Validators.required],
      skillsMultiCtrl: [],
      skillsMultiFilterCtrl: ['']
    });
  }

  ngOnInit() {
    // Fetch available skills from the service and set up form controls
    this.skillsService.getSkills().subscribe({
      next: skills => {
        this.skills = skills;
        // multi select
        this.filteredSkillsMulti.next(this.skills.slice());
        this.skillsForm.get('skillsMultiFilterCtrl')?.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterSkillsMulti();
          });

        // Subscribe to value changes in the skillsMultiFilterCtrl for dynamic filtering
        this.skillsForm.get('skillsMultiCtrl')?.valueChanges.subscribe((selectedSkills: ISkill[]) => {
          this.selectedSkills = selectedSkills;
        });

      },
      error: err => console.error('An error occurred', err)
    });

    // Populate the form with data for editing if available
    this.skillsForm.patchValue(this.dialogdata);
  }

  ngAfterViewInit() {
     // Set up initial value for the multi-select and define a compare function
    this.setInitialValue();
  }

  protected setInitialValue() {
    // Set initial selectedSkills and compareWith function for multi-select
    this.filteredSkillsMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        this.selectedSkills = this.skillsForm.get('skillsMultiCtrl')?.value || this.skills;
        this.multiSelect.compareWith = (a: ISkill, b: ISkill) => a && b && a.id === b.id;
      });
  }

  protected filterSkillsMulti() {
     // Filter available skills based on user input in the multi-select filter
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

  public onSubmit(): void {
     // Handle form submission for adding or editing skills
    if (this.skillsForm.invalid) {
      // If the form is invalid, do not submit
      return;
    }

    if (this.dialogdata) {
      // Edit existing skills using the skillsService
      this.skillsService.editSkills(this.dialogdata.id, this.skillsForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
          this.skillsService.notification('Skill updated successfully');
        },
        error: err => {
          console.error('An error occurred', err);
          this.skillsService.notification('Failed to update skill. Please try again later.');
        }
      });

    } else {
      // Add new skills using the skillsService
      this.skillsService.addSkills(this.skillsForm.value).subscribe({
        next: () => {
          // Close the dialog upon successful addition
          this.dialogRef.close();
          this.skillsService.notification('Skill added successfully!');
        },
        error: err => {
          console.error('An error occurred', err);
          this.skillsService.notification('Failed to add skill. Please try again later.');
        }
      });
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}