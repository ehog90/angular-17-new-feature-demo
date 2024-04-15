import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-numeric-field',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './numeric-field.component.html',
  styleUrl: './numeric-field.component.scss',
})
export class NumericFieldComponent {
  label = input.required<string>();
  value = model.required<number>();
  unit = input<string>();
  id = input.required<string>();

  constructor() {
    effect(() => {});
  }
}
