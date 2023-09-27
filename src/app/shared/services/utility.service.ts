import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private _notification: MatSnackBar) { }

  public notification(msg: string) {
    this._notification.open(msg, '', {
      duration: 2000,
    });
  }
}
