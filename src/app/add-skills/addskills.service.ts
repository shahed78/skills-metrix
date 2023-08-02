import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../shared/data.interface';

@Injectable({
  providedIn: 'root'
})
export class AddskillsService {
  private apiUrl = 'http://node-server-url/api/addskils'; 

  constructor(private http: HttpClient) { }

  addSkills(data: UserData) {
    console.log(data);
    // console.log('addSkills service post');
    console.log(`addSkills result: ${data}`);
    // return this.http.post(this.apiUrl, data);
  }
}
