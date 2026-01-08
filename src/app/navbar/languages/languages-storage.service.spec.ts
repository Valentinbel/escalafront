import { TestBed } from '@angular/core/testing';

import { LanguagesStorageService } from './languages-storage.service';

describe('LanguagesStorageService', () => {
  let service: LanguagesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguagesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
