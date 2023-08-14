import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/data.interface';

@Injectable({
  providedIn: 'root'
})
export class DisplayskillsService {

  private skillsList: string = 'http://localhost:7000/skills'; 
  constructor( private http: HttpClient) { }

  public getUsersSkills(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.skillsList}/list`);
  }

  public deleteUser(id: number): Observable<any> { //here
    return this.http.delete(`${this.skillsList}/delete/${id}`);
    console.log(id);
  }

  
}
