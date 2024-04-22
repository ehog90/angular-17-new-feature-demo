import { Component, inject, model } from '@angular/core';
import { Trading212Service } from '../../services/trading212.service';

@Component({
  selector: 'app-trading212input',
  standalone: true,
  imports: [],
  templateUrl: './trading212input.component.html',
  styleUrl: './trading212input.component.scss',
})
export class Trading212inputComponent {
  readonly trading212Service = inject(Trading212Service);
  initialCapital = model.required<number>();

  getFromtrading212() {
    this.trading212Service.getAccountCash().subscribe((data) => {
      this.initialCapital.set(data.result);
    });
  }
}
