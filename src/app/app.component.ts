import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentYear } from './types';
import { InvestmentGridComponent } from './components/investment-grid/investment-grid.component';
import { InvestmentChartComponent } from './components/investment-chart/investment-chart.component';
import { HeaderComponent } from './components/header/header.component';
import { InputComponent } from './components/input/input.component';
import { Trading212inputComponent } from './components/trading212input/trading212input.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    InvestmentGridComponent,
    InvestmentChartComponent,
    HeaderComponent,
    InputComponent,
    Trading212inputComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  inflationRate = model(Number(localStorage.getItem('inflation') ?? 5));
  initialCapital = model(
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
      localStorage.setItem('startingMoney', this.initialCapital().toString());
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

  onYearsChanged(years: number) {
    this.years.set(years);
  }
}
