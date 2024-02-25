import { CommonModule } from '@angular/common';
import { Component, computed, effect, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvestmentYear } from './types';
import { InvestmentGridComponent } from './components/investment-grid/investment-grid.component';
import { InvestmentChartComponent } from './components/investment-chart/investment-chart.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, InvestmentGridComponent, InvestmentChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  inflationRate = model(4);
  startingMoney = model(1_800_000);
  savingsMonthly = model(200_000);
  grow = model(10);
  years = model(5);
  startingYear = signal(new Date().getFullYear());

  data = signal<InvestmentYear[] | null>(null);

  onDataChanged(data: InvestmentYear[]) {
    this.data.set(data);
  }
}
