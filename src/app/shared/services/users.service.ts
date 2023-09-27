import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser, ApiResponse } from 'src/app/shared/interfaces/data.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = 'http://localhost:7001/users';

  constructor( private http: HttpClient) { }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.usersUrl}/list`);
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
}
