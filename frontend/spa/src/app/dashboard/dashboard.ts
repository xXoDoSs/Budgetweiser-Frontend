import { Component, OnInit } from '@angular/core';
import { ChartService } from './chart.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxChartsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  expensesByCategory: any[] = [];
  incomeVsExpenses: any[] = [];
  savingsTrend: any[] = [];
  balance: number = 0;
  saved: number = 0;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Amount';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.chartService.getExpensesByCategory().subscribe(data => {
      this.expensesByCategory = data;
    });

    this.chartService.getIncomeVsExpenses().subscribe(data => {
      this.incomeVsExpenses = data;
    });

    this.chartService.getSavingsTrend().subscribe(data => {
      this.savingsTrend = data;
      this.balance = data.reduce((acc, cur) => acc + cur.value, 0);
      this.saved = data.filter(d => d.value > 0).reduce((acc, cur) => acc + cur.value, 0);
    });
  }
}
