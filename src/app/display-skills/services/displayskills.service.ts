import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DisplayskillsService {

  private skillsList: string = 'http://localhost:7000/skills/list'; 
  constructor( private http: HttpClient) { }

  getUsersSkills(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.skillsList);
  }
}
