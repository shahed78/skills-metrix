import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayskillsService {

  private skillsList: string = 'http://localhost:7000/skills/list'; 
  constructor( private http: HttpClient) { }

  getUsersSkills(): Observable<any> {
    return this.http.get(this.skillsList);
  }
}
