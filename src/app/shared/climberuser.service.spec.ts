import { TestBed } from '@angular/core/testing';

import { ClimberuserService } from './climberuser.service';

describe('ClimberuserService', () => {
  let service: ClimberuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimberuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
