import { TestBed } from '@angular/core/testing';

import { RealtimeDBService } from './realtime-db.service';

describe('RealtimeDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RealtimeDBService = TestBed.get(RealtimeDBService);
    expect(service).toBeTruthy();
  });
});
