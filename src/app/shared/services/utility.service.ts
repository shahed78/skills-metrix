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

  public async processInSequence<T>(items: T[], actionFunction: (item: T) => Promise<void>): Promise<void> {
    const BATCH_SIZE = 5; // Adjust the batch size as needed
    const DELAY_BETWEEN_BATCHES_MS = 2000; // Adjust the delay (in milliseconds) between batches as needed
    try {
      for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const batch = items.slice(i, i + BATCH_SIZE);
        await this.processBatch(batch, actionFunction);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS));
      }
    } catch (error) {
      console.log('Error in processing sequence:', error);
    }
  }

  private async processBatch<T>(items: T[], actionFunction: (item: T) => Promise<void>): Promise<void> {
    try {
      for (const item of items) {
        await actionFunction(item);
      }
    } catch (error) {
     console.log('error in processing batch')
    }
  }
}
