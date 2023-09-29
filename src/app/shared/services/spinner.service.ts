import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private showSpinnerSubject = new BehaviorSubject<boolean>(false);
  public showSpinner$ = this.showSpinnerSubject.asObservable();

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public toggleSpinner(value: boolean): void {
    this.showSpinnerSubject.next(value);
  }
}
