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
import round from 'lodash/round';
import { SummaryCardComponent } from '../summary-card/summary-card.component';

@Component({
  selector: 'app-investment-grid',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent],
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

  roundDigits = 6;

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
    this.years.update((y) => Math.max(y + years, 0));
  }

  data = computed(() => {
    const years = [...Array(this.years())].map(
      (value, index) => this.startingYear() + index
    );

    return years.reduce((acc, curr, index) => {
      const startingMoney = round(
        acc.length === 0 ? this.startingMoney() : acc[index - 1].yearEndMoney,
        this.roundDigits
      );
      const totalInflation = round(
        acc.length === 0
          ? this.inflationPercent()
          : acc[index - 1].totalInflation * this.inflationPercent(),
        this.roundDigits
      );

      const totalGrowth = round(
        acc.length === 0
          ? this.growPercent()
          : acc[index - 1].totalGrowth * this.growPercent(),
        this.roundDigits
      );
      const savingsMonthly = round(
        acc.length === 0
          ? this.savingsMonthly()
          : acc[index - 1].savingsMonthly * this.inflationPercent(),
        this.roundDigits
      );
      const totalInvested = round(
        acc.length === 0
          ? this.startingMoney() + savingsMonthly * 12
          : acc[index - 1].totalInvested + savingsMonthly * 12,
        this.roundDigits
      );

      const intraYearGrowth = round(
        [...Array(12)]
          .map(
            (_, index) =>
              savingsMonthly * (1 + this.monthlyGrowPercent() * (index + 1))
          )
          .reduce((acc, curr) => acc + curr),
        this.roundDigits
      );
      const yearEndMoney = round(
        startingMoney * this.growPercent() + intraYearGrowth,
        this.roundDigits
      );
      const yearEndMoneyValueToday = round(
        yearEndMoney / totalInflation,
        this.roundDigits
      );
      const totalInvestedValueToday = round(
        totalInvested / totalInflation,
        this.roundDigits
      );
      const totalEarnings = round(
        yearEndMoney - totalInvested,
        this.roundDigits
      );

      const totalEarningsValueToday = round(
        totalEarnings / totalInflation,
        this.roundDigits
      );

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
        totalEarnings,
        totalEarningsValueToday,
      });
      return acc;
    }, [] as InvestmentYear[]);
  });

  lastRow_ = computed<InvestmentYear | null>(() => {
    const data = this.data();
    if (data) {
      return data[data.length - 1];
    }
    return null;
  });

  get lastRow() {
    return this.lastRow_();
  }
}
