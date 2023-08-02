import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AddskillsService } from './addskills.service';


@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.scss']
})
export class AddSkillsComponent implements OnInit {

  myForm: FormGroup;

  constructor (private addSkillsService: AddskillsService){}

  ngOnInit() {
    this.myForm = new FormGroup({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      startdate: new FormControl('', [Validators.required]),
      enddate: new FormControl('', [Validators.required]),
    });
}

onSubmit() {
  if (this.myForm.invalid) {
    // If the form is invalid, do not submit
    return;
  }

  // console.log(this.myForm.value.firstname);
  // console.log(this.myForm.value.lastname);
  // console.log(this.myForm.value.email);
  // console.log(this.myForm.value.startdate);
  // console.log(this.myForm.value.enddate);

   // Extract form data from the myForm
  const userData = {
    firstname: this.myForm.value.firstname,
    lastname: this.myForm.value.lastname,
    email: this.myForm.value.email,
    startdate: new Date(this.myForm.value.startdate),
    enddate: new Date (this.myForm.value.enddate)
  }

 console.log(userData);
this.addSkillsService.addSkills(userData);

  // Send the form data to the backend server (Node.js)
  // this.http.post<any>('http://your-node-server-url/api/formdata', formData).subscribe(
  //   (response) => {
  //     console.log(response); // Handle the response from the server (optional)
  //     // Perform any additional actions you want after successful form submission
  //   },
  //   (error) => {
  //     console.error(error); // Handle any errors that occur during the request (optional)
  //   }
  // );
}

}
