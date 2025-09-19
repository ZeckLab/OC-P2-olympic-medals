import { Component, Input, OnChanges, HostListener } from '@angular/core';
import { ChartData } from 'src/app/core/models/ChartData';

@Component({
  selector: 'app-bar-chart-country-medals',
  templateUrl: './bar-chart-country-medals.component.html',
  styleUrl: './bar-chart-country-medals.component.scss',
  standalone: false,
})

export class BarChartCountryMedalsComponent implements OnChanges {
  @Input() barDataCountryMedalsByParticipation: ChartData[] = [];

  view: [number, number] = [880, 500];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Years';
  showYAxisLabel = true;
  yAxisLabel = 'Medals';

  ngOnChanges(): void {
    this.setResponsiveView(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setResponsiveView(event.target.innerWidth);
  }

  // Adjust chart size based on window width with min and max constraints
  setResponsiveView(width: number) {
    const chartWidth = Math.min(Math.max(width - 20, 320), 900);
    const chartHeight = Math.round(chartWidth * 0.57);
    this.view = [chartWidth, chartHeight];
  }
}
