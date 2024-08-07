import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  model,
  output,
  signal,
} from '@angular/core';
import { InvestmentYear } from '../../types';
import round from 'lodash/round';
import { SummaryCardComponent } from '../summary-card/summary-card.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-investment-grid',
  standalone: true,
  imports: [CommonModule, SummaryCardComponent],
  templateUrl: './investment-grid.component.html',
  styleUrl: './investment-grid.component.scss',
})
export class InvestmentGridComponent {
  inflationRate = model.required<number>();
  initialCapital = model.required<number>();
  savingsMonthly = model.required<number>();
  savingsGrow = model.required<number>();
  grow = model.required<number>();
  years = model.required<number>();
  startingYear = model.required<number>();

  years$ = toObservable(this.years);
  yearsDebounced = toSignal(this.years$.pipe(debounceTime(500)));
  yearsInternal = signal(1);
  yearsChanged = output<number>();

  roundDigits = 6;

  constructor() {
    effect(
      () => {
        this.yearsInternal.set(this.yearsDebounced() ?? 1);
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.dataChanged.emit(this.data());
      },
      { allowSignalWrites: true }
    );
  }

  dataChanged = output<InvestmentYear[]>();

  inflationPercent = computed(() => this.inflationRate() / 100 + 1);
  savingsGrowPercent = computed(() => this.savingsGrow() / 100 + 1);
  growPercent = computed(() => 1 + this.grow() / 100);
  monthlyGrowPercent = computed(() => this.grow() / 12 / 100);

  changeYears(years: number) {
    this.yearsInternal.update((y) => Math.max(y + years, 1));
    this.yearsChanged.emit(this.yearsInternal());
  }

  data = computed(() => {
    const years = [...Array(this.yearsInternal())].map(
      (value, index) => this.startingYear() + index
    );

    return years.reduce((acc, curr, index) => {
      const startingMoney = round(
        acc.length === 0 ? this.initialCapital() : acc[index - 1].yearEndMoney,
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
          : acc[index - 1].savingsMonthly * this.savingsGrowPercent(),
        this.roundDigits
      );
      const totalInvested = round(
        acc.length === 0
          ? this.initialCapital() + savingsMonthly * 12
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
