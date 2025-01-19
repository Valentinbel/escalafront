import { TestBed } from '@angular/core/testing';

import { ProfileStorageServiceService } from './profile-storage-service.service';

describe('ProfileStorageServiceService', () => {
  let service: ProfileStorageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileStorageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
