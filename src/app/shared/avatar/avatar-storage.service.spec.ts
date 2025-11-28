import { TestBed } from '@angular/core/testing';

import { AvatarStorageService } from './avatar-storage.service';

describe('AvatarStorageService', () => {
  let service: AvatarStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
