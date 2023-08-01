import { Component } from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})
export class DisplaySkillsComponent {
  constructor(public addSkillsDialog: MatDialog) {}

  public addSkills() {
  console.log('add skills function');
  const dialogRef = this.addSkillsDialog.open(AddSkillsComponent);

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });

  }

}
