import { TestBed } from '@angular/core/testing';

import { ClimberprofileService } from './climberprofile.service';

describe('ClimberprofileService', () => {
  let service: ClimberprofileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClimberprofileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
