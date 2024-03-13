import { TestBed } from '@angular/core/testing';

import { AddPointService } from './add-point.service';

describe('AddPointService', () => {
  let service: AddPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
