import { Component, OnInit} from '@angular/core';
import { AddSkillsComponent } from '../add-skills/add-skills.component';
import { MatDialog } from '@angular/material/dialog';
import { DisplayskillsService } from './services/displayskills.service';

@Component({
  selector: 'app-display-skills',
  templateUrl: './display-skills.component.html',
  styleUrls: ['./display-skills.component.scss']
})
export class DisplaySkillsComponent implements OnInit {
  constructor(public addSkillsDialog: MatDialog, private displayskills: DisplayskillsService ) {}

  ngOnInit(): void {
    let displaySkillsList = this.displayskills.getUsersSkills().subscribe({
      next: response =>{
        console.log(response);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  public addSkills(): void {
  const dialogRef = this.addSkillsDialog.open(AddSkillsComponent);
  }

  

}
