import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';


import { Bank, BANKS } from '../../data/demo-data';
import { ISkill } from '../../interfaces/data.interface';

@Component({
  selector: 'app-milti-select-form-builder',
  templateUrl: './milti-select-form-builder.component.html',
  styleUrls: ['./milti-select-form-builder.component.scss']
})
export class MiltiSelectFormBuilderComponent implements OnInit, AfterViewInit, OnDestroy  {

   /** list of banks */
   protected banks: Bank[] = BANKS;
 
   /** list of banks filtered by search keyword */
   public filteredBanksMulti: ReplaySubject<Bank[]> = new ReplaySubject<Bank[]>(1);
 
  //  @ViewChild('multiSelect') multiSelect: MatSelect | undefined;
   @ViewChild('multiSelect', { static: false }) multiSelect!: MatSelect;

   @Input() skills: ISkill[] = [];
 
   /** Subject that emits when the component has been destroyed. */
   protected _onDestroy = new Subject<void>();
  // bankMultiForm: any;
  // bankMultiFilterCtrl: any;
  bankMultiForm: FormGroup;
  bankMultiFilterCtrlName: string = 'bankMultiFilterCtrl';

  constructor(private fb: FormBuilder) {
    this.bankMultiForm = this.fb.group({
      bankMultiCtrl: [],
      bankMultiFilterCtrl: ['']
    });

   }

  ngOnInit() {
    // console.log(this.banks);
    // console.log(this.banks.slice());
    // console.log(this.filteredBanksMulti.next(this.banks.slice()));
    // console.log('skills', this.skills);

    this.filteredBanksMulti.next(this.banks.slice());

    // Access the form control using this.bankMultiForm.get
    this.bankMultiForm.get('bankMultiFilterCtrl')?.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skills'] && !changes['skills'].firstChange) {
      // Skills input has changed, update filtering logic or anything else
      console.log('onchanges', this.skills);
    }
  }

  ngAfterViewInit() {
    this.setInitialValue();
 }

  
  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a: Bank, b: Bank) => a && b && a.id === b.id;
      });
  }


  protected filterBanksMulti() {
    console.log('filterBanksMulti');
    if (!this.banks) {
      return;
    }
    let search = this.bankMultiForm.get('bankMultiFilterCtrl')?.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanksMulti.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
