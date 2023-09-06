import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSkillsComponent } from './upload-skills.component';

describe('UploadSkillsComponent', () => {
  let component: UploadSkillsComponent;
  let fixture: ComponentFixture<UploadSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
