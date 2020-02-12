import { TestBed } from '@angular/core/testing';

import { HuntService } from './hunt.service';

describe('HuntService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HuntService = TestBed.get(HuntService);
    expect(service).toBeTruthy();
  });
});
