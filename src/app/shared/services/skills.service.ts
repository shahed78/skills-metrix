import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, ISkill, ApiResponse } from 'src/app/shared/interfaces/data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {

  private usersUrl = 'http://localhost:7001/users'; 
  private skillsUrl = 'http://localhost:7001/skills'; 
  constructor( private http: HttpClient, private _notification: MatSnackBar) { }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.usersUrl}/list`);
  }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.skillsUrl}`);
  }

  public addSkills(skill: any): Observable<any> {
    return this.http.post(`${this.skillsUrl}`, skill);
  }

  public addUser(data: IUser): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.usersUrl}/add`, data);
  }

  public editUser(id: number, data: IUser): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.usersUrl}/edit/${id}`, data);
  }

  public deleteUser(id: number): Observable<ApiResponse> { //here
    return this.http.delete<ApiResponse>(`${this.usersUrl}/delete/${id}`);
  }

  public notification(msg: string) {
    // Notification for add, edit or delete actions
    this._notification.open(msg, '', {
      duration: 2000,
    });
  }

}
