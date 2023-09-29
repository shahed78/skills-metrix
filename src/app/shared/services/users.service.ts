import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { IUser, ApiResponse } from 'src/app/shared/interfaces/data.interface';
import { UtilityService } from '../../shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  private usersSubject = new BehaviorSubject<IUser[]>([]);
  public users$: Observable<IUser[]> = this.usersSubject.asObservable();

  private usersUrl = 'http://localhost:7001/users';

  constructor( 
    private http: HttpClient,
    private utilityService: UtilityService,
    ) { }

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.usersUrl}/list`);
  }

  public fetchUsers(): void {
    this.getUsers().subscribe((users: IUser[]) => {
      this.usersSubject.next(users);
    });
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

  public async addExcelUser(addUsers: IUser[], editUsers: IUser[]): Promise<void> {

    try {
      if(addUsers.length > 0){
        await this.utilityService.processInSequence(addUsers, this.addImportedUser.bind(this));
        this.fetchUsers()
        console.log('Addition task completed');
        }

      if(editUsers.length > 0){
        await this.utilityService.processInSequence(editUsers, this.editImportedUser.bind(this));
        this.fetchUsers()
        console.log('Edit task completed');
      }
      
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during eddit or addition
      throw error;
    }
  }

  private async addImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.addUser(user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }

  private async editImportedUser(user: IUser): Promise<void> {
    try {
      await firstValueFrom(this.editUser(user.id, user));
    } catch (error) {
      console.log('problem in adding user');
    }
  }


}
