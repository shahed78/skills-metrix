import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-milti-select',
  templateUrl: './milti-select.component.html',
  styleUrls: ['./milti-select.component.scss']
})
export class MiltiSelectComponent {

  @ViewChild('search') searchTextBox: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  // selectedValues = [];
  selectedValues: string[] = [];
  data: string[] = [
    'A1',
    'A2',
    'A3',
    'B1',
    'B2',
    'B3',
    'C1',
    'C2',
    'C3'
  ]

  filteredOptions: Observable<any[]>;

  ngOnInit() {
    /**
     * Set filter event based on value changes 
     */
    this.filteredOptions = this.searchTextboxControl.valueChanges
      .pipe(
        startWith<string>(''),
        map(name => this._filter(name))
      );
  }

  /**
   * Used to filter data based on search input 
   */
  
  private _filter(name: string): string[] {
    console.log('_filter');
    const filterValue = name.toLowerCase();

    // Instead of setting selected values and patching, directly update selectedValues
    this.selectedValues = this.selectFormControl.value;

    let filteredList = this.data.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
    return filteredList;
  }

/**
 * Remove from selected values based on uncheck
 */


  // selectionChange(event: any) {
  //   console.log('selectionChange');
  //   if (event.isUserInput && event.source.selected === false) {
  //     const value = event.source.value;
  //     console.log(value);
  //     // console.log(this.selectedValues);
  //     const index = this.selectedValues.indexOf(value);
  //     if (index !== -1) {
  //       this.selectedValues.splice(index, 1);
  //     }
  //   }
  //   console.log(this.selectedValues);

  //   //always null
  // }

  openedChange(e: any) {
    console.log('openedChange');
    // Set search textbox value as empty while opening selectbox 
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  /**
   * Clearing search textbox value 
   */
  clearSearch(event: any) {
    console.log('clearSearch');
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  /**
   * Set selected values to retain the state 
   */
  // setSelectedValues() {
  //   console.log('selectFormControl', this.selectFormControl.value);
  //   if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
  //     this.selectFormControl.value.forEach((e) => {
  //       if (this.selectedValues.indexOf(e) == -1) {
  //         this.selectedValues.push(e);
  //       }
  //     });
  //   }
  // }

  // setSelectedValues() {
  //   console.log('setSelectedValues');
  //   const selectedValueArray = this.selectFormControl.value;
  
  //   if (Array.isArray(selectedValueArray)) {
  //     selectedValueArray.forEach((e: string) => {
  //       if (!this.selectedValues.includes(e)) {
  //         this.selectedValues.push(e);
  //       }
  //     });

  //     console.log(selectedValueArray);
  
  //     // If you want to use a Set for unique values, you can do this:
  //     // this.selectedValues = new Set([...this.selectedValues, ...selectedValueArray]);
  //   }
  // }
  
}
/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
