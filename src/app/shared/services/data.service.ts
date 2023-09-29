import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser, ISkill } from '../interfaces/data.interface';
import { UsersService } from '../services/users.service';
import { SkillsService } from '../services/skills.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private usersSubject = new BehaviorSubject<IUser[]>([]);
  private skillsSubject = new BehaviorSubject<ISkill[]>([]);

  public users$: Observable<IUser[]> = this.usersSubject.asObservable();
  public skills$: Observable<ISkill[]> = this.skillsSubject.asObservable();

  constructor( private usersService: UsersService, private skillsService: SkillsService ) { }

  public fetchUsers(): void {
    this.usersService.getUsers().subscribe((users: IUser[]) => {
      this.usersSubject.next(users);
    });
  }

  public fetchSkills(): void {
    this.skillsService.getSkills().subscribe((skills: ISkill[]) => {
      this.skillsSubject.next(skills);
    });
  }
}
