import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../shared/data.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddskillsService {
  private apiUrl = 'http://localhost:7000/skills/add'; 

  constructor(private http: HttpClient) { }

  addSkills(data: IUser): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
