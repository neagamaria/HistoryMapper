import { TestBed } from '@angular/core/testing';

import { HistoricalPeriodsService } from './historical-periods.service';

describe('HistoricalPeriodsService', () => {
  let service: HistoricalPeriodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricalPeriodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
