import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  model,
} from '@angular/core';
import { InvestmentYear } from '../../types';

@Component({
  selector: 'app-investment-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investment-grid.component.html',
  styleUrl: './investment-grid.component.scss',
})
export class InvestmentGridComponent {
  inflationRate = model.required<number>();
  startingMoney = model.required<number>();
  savingsMonthly = model.required<number>();
  grow = model.required<number>();
  years = model.required<number>();
  startingYear = model.required<number>();

  constructor() {
    effect(
      () => {
        this.dataChanged.emit(this.data());
      },
      { allowSignalWrites: true }
    );
  }

  @Output()
  dataChanged = new EventEmitter<InvestmentYear[]>();

  inflationPercent = computed(() => this.inflationRate() / 100 + 1);
  growPercent = computed(() => 1 + this.grow() / 100);
  monthlyGrowPercent = computed(() => this.grow() / 12 / 100);

  changeYears(years: number) {
    this.years.update((y) => y + years);
  }

  data = computed(() => {
    const years = [...Array(this.years())].map(
      (value, index) => this.startingYear() + index
    );

    return years.reduce((acc, curr, index) => {
      const startingMoney =
        acc.length === 0 ? this.startingMoney() : acc[index - 1].yearEndMoney;
      const totalInflation =
        acc.length === 0
          ? this.inflationPercent()
          : acc[index - 1].totalInflation * this.inflationPercent();

      const totalGrowth =
        acc.length === 0
          ? this.growPercent()
          : acc[index - 1].totalGrowth * this.growPercent();
      const savingsMonthly =
        acc.length === 0
          ? this.savingsMonthly()
          : acc[index - 1].savingsMonthly * this.inflationPercent();
      const totalInvested =
        acc.length === 0
          ? this.startingMoney() + savingsMonthly * 12
          : acc[index - 1].totalInvested + savingsMonthly * 12;

      const intraYearGrowth = [...Array(12)]
        .map(
          (_, index) =>
            savingsMonthly * (1 + this.monthlyGrowPercent() * (index + 1))
        )
        .reduce((acc, curr) => acc + curr);
      const yearEndMoney = startingMoney * this.growPercent() + intraYearGrowth;
      const yearEndMoneyValueToday = yearEndMoney / totalInflation;
      const totalInvestedValueToday = totalInvested / totalInflation;

      acc.push({
        year: curr,
        startingMoney,
        yearEndMoney,
        intraYearGrowth,
        totalInflation,
        totalGrowth,
        savingsMonthly,
        yearEndMoneyValueToday,
        totalInvested,
        totalInvestedValueToday,
      });
      return acc;
    }, [] as InvestmentYear[]);
  });
}
