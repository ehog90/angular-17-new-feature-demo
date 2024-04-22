import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trading212inputComponent } from './trading212input.component';

describe('Trading212inputComponent', () => {
  let component: Trading212inputComponent;
  let fixture: ComponentFixture<Trading212inputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trading212inputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Trading212inputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
