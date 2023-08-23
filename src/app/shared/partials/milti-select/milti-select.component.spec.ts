import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiltiSelectComponent } from './milti-select.component';

describe('MiltiSelectComponent', () => {
  let component: MiltiSelectComponent;
  let fixture: ComponentFixture<MiltiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiltiSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiltiSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
