import { TestBed } from '@angular/core/testing';

import { Trading212Service } from './trading212.service';

describe('Trading212Service', () => {
  let service: Trading212Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Trading212Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
