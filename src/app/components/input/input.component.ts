import { Component, model } from '@angular/core';
import { NumericFieldComponent } from '../numeric-field/numeric-field.component';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NumericFieldComponent],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent {
  inflationRate = model.required<number>();
  initialCapital = model.required<number>();
  savingsMonthly = model.required<number>();
  grow = model.required<number>();
  years = model.required<number>();
}
