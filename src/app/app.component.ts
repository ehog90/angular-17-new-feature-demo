import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentYear } from './types';
import { InvestmentGridComponent } from './components/investment-grid/investment-grid.component';
import { InvestmentChartComponent } from './components/investment-chart/investment-chart.component';
import { Trading212Service } from './services/trading212.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, InvestmentGridComponent, InvestmentChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly trading212Service = inject(Trading212Service);

  inflationRate = model(Number(localStorage.getItem('inflation') ?? 5));
  startingMoney = model(
    Number(localStorage.getItem('startingMoney') ?? 1_000_000)
  );
  savingsMonthly = model(
    Number(localStorage.getItem('savingsMonthly') ?? 100_000)
  );
  grow = model(Number(localStorage.getItem('grow') ?? 10));
  years = model(Number(localStorage.getItem('years') ?? 10));
  startingYear = signal(new Date().getFullYear());

  constructor() {
    effect(
      () => {
        const years = this.years();
        if (years < 1) {
          this.years.set(1);
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
      localStorage.setItem('inflation', this.inflationRate().toString());
    });
    effect(() => {
      localStorage.setItem('startingMoney', this.startingMoney().toString());
    });
    effect(() => {
      localStorage.setItem('savingsMonthly', this.savingsMonthly().toString());
    });
    effect(() => {
      localStorage.setItem('grow', this.grow().toString());
    });
    effect(() => {
      localStorage.setItem('years', this.years().toString());
    });
  }

  data = signal<InvestmentYear[] | null>(null);

  onDataChanged(data: InvestmentYear[]) {
    this.data.set(data);
  }

  getFromtrading212() {
    this.trading212Service.getAccountCash().subscribe((data) => {
      this.startingMoney.set(data.result);
    });
  }
}
