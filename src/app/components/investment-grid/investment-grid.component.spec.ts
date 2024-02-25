import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentGridComponent } from './investment-grid.component';

describe('InvestmentGridComponent', () => {
  let component: InvestmentGridComponent;
  let fixture: ComponentFixture<InvestmentGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestmentGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
