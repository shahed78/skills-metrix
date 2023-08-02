import { TestBed } from '@angular/core/testing';

import { AddskillsService } from './addskills.service';

describe('AddskillsService', () => {
  let service: AddskillsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddskillsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
