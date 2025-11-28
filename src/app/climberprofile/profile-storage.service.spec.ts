import { TestBed } from '@angular/core/testing';

import { ProfileStorageService } from './profile-storage.service';

describe('ProfileStorageService', () => {
  let service: ProfileStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
