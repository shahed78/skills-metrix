import { TestBed } from '@angular/core/testing';

import { DisplayskillsService } from './displayskills.service';

describe('DisplayskillsService', () => {
  let service: DisplayskillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayskillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
