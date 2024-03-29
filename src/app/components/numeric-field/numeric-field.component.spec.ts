import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericFieldComponent } from './numeric-field.component';

describe('NumericFieldComponent', () => {
  let component: NumericFieldComponent;
  let fixture: ComponentFixture<NumericFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumericFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
