import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { ISkill, ApiResponse, IKnowladge } from 'src/app/shared/interfaces/data.interface';
import { UtilityService } from '../../shared/services/utility.service';


@Injectable({
  providedIn: 'root'
})

export class SkillsService {

  private skillsUrl = 'http://localhost:7001/skills'; 
  private skillsSubject = new BehaviorSubject<ISkill[]>([]);
  public skills$: Observable<ISkill[]> = this.skillsSubject.asObservable();

  constructor( 
    private http: HttpClient,
    private utilityService: UtilityService
    ) { }

  public getSkills(): Observable<ISkill[]> {
    return this.http.get<ISkill[]>(`${this.skillsUrl}`);
  }

  public fetchSkills(): void {
    this.getSkills().subscribe((skills: ISkill[]) => {
      this.skillsSubject.next(skills);
    });
  }

  public addSkillsApi(skill: {name: string, type: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.skillsUrl}`, skill);
  }

  public skillsToAdd(excelSkills: IKnowladge[], skills: ISkill[]) {
    return excelSkills.filter((excelSkill: IKnowladge) => !skills.some((skill: IKnowladge) => skill.name === excelSkill.name));
  }

  public async addExcelSkills(excelSkillsToAdd: IKnowladge[]): Promise<void> {
    try {
        await this.utilityService.processInSequence(excelSkillsToAdd, this.addSkills.bind(this));
        this.fetchSkills()
        console.log('Skill addition task completed');
    } catch (error) {
      console.error('Error:', error);
      // Handle any errors that may occur during eddit or addition
      throw error;
    }
  }

  private async addSkills(skills:IKnowladge): Promise<void> {
    try {
      await firstValueFrom(this.addSkillsApi(skills));
    } catch (error) {
      console.log('problem in adding skills');
    }
  }
  
}
