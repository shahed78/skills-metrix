import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/app/shared/interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private apiUrl: string = 'http://localhost:7000/users'; 
  constructor( private http: HttpClient) { }

  public getUsersSkills(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/list`);
  }

  public addSkills(data: IUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  public editSkills(id: number, data: IUser): Observable<any> {
    return this.http.put(`${this.apiUrl}/edit/${id}`, data);
  }

  public deleteUser(id: number): Observable<any> { //here
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
    console.log(id);
  }

}
