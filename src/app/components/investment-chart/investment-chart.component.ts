import { Component, ViewChild, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { InvestmentYear } from '../../types';
import { ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
} from 'ng-apexcharts';
import { debounceTime } from 'rxjs';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-investment-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './investment-chart.component.html',
  styleUrl: './investment-chart.component.scss',
})
export class InvestmentChartComponent {
  data = input<InvestmentYear[] | null>(null);
  @ViewChild('chart') chart!: ChartComponent;

  data$ = toObservable(this.data);
  dataDebounced = toSignal(this.data$.pipe(debounceTime(1000)));

  categories = computed(() => {
    const data = this.dataDebounced();
    if (data) {
      return { categories: data.map((d) => d.year) };
    }
    return { categories: [] };
  });

  series = computed(() => {
    const data = this.data();
    if (data) {
      return [
        { name: 'Total Invested', data: data.map((d) => d.totalInvested) },
        { name: 'Year-End Value', data: data.map((d) => d.yearEndMoney) },
        {
          name: 'Today Value',
          data: data.map((d) => d.yearEndMoneyValueToday),
        },
        {
          name: 'Today Value of Total Invested',
          data: data.map((d) => d.totalInvestedValueToday),
        },
      ];
    }
    return [];
  });

  yAxis: ApexYAxis = {
    min: 0,
  };

  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    title: {
      text: 'Product Trends by Month',
      align: 'left',
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {},
  };
}
