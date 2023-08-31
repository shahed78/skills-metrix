import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiltiSelectFormBuilderComponent } from './milti-select-form-builder.component';

describe('MiltiSelectFormBuilderComponent', () => {
  let component: MiltiSelectFormBuilderComponent;
  let fixture: ComponentFixture<MiltiSelectFormBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiltiSelectFormBuilderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiltiSelectFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
