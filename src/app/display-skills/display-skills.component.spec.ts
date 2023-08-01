import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySkillsComponent } from './display-skills.component';

describe('DisplaySkillsComponent', () => {
  let component: DisplaySkillsComponent;
  let fixture: ComponentFixture<DisplaySkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaySkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
