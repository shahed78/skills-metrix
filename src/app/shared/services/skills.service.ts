import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISkill, ApiResponse } from 'src/app/shared/interfaces/data.interface';


@Injectable({
  providedIn: 'root'
})

export class SkillsService {

  private skillsUrl = 'http://localhost:7001/skills'; 

  constructor( private http: HttpClient) { }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.skillsUrl}`);
  }

  public addSkills(skill: {name: string, type: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.skillsUrl}`, skill);
  }
}
