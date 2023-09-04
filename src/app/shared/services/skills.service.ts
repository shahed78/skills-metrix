import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, ISkill } from 'src/app/shared/interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private usersUrl = 'http://localhost:7000/users'; 
  private skillsUrl = 'http://localhost:7000/skills'; 
  constructor( private http: HttpClient) { }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.usersUrl}/list`);
  }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.skillsUrl}`);
  }

  public addSkills(data: IUser): Observable<any> {
    return this.http.post(`${this.usersUrl}/add`, data);
  }

  public editSkills(id: number, data: IUser): Observable<any> {
    return this.http.put(`${this.usersUrl}/edit/${id}`, data);
  }

  public deleteUser(id: number): Observable<any> { //here
    return this.http.delete(`${this.usersUrl}/delete/${id}`);
  }

}
