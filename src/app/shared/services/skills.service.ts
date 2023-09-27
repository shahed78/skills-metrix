import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISkill, ApiResponse } from 'src/app/shared/interfaces/data.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class SkillsService {

  private skillsUrl = 'http://localhost:7001/skills'; 

  constructor( private http: HttpClient, private _notification: MatSnackBar) { }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.skillsUrl}`);
  }

  public addSkills(skill: {name: string, type: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.skillsUrl}`, skill);
  }

  public notification(msg: string) {
    this._notification.open(msg, '', {
      duration: 2000,
    });
  }

}
