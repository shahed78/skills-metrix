import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {

  public showSpinner = false;

  constructor(private spinnerService: SpinnerService){}

  ngOnInit(): void {
    // Subscribe to the spinner state
    this.spinnerService.showSpinner$.subscribe((showSpinner) => {
      this.showSpinner = showSpinner;
    });
  }

}
