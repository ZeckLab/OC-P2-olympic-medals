import { Component, Input, OnChanges } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-pie-chart-medals-by-country',
  templateUrl: './pie-chart-medals-by-country.component.html',
  styleUrl: './pie-chart-medals-by-country.component.scss',
  standalone: false,
})
export class PieChartMedalsByCountryComponent implements OnChanges {
  @Input() data: Olympic[] = [];
  view: [number, number] = [880, 500];

  pieDataMedalsByCountry: { name: string; value: number }[] = [];

  ngOnChanges(): void {
    this.preparePieDataMedalsByCountry();
    this.setResponsiveView(window.innerWidth);
  }

  private preparePieDataMedalsByCountry(): void {
    this.pieDataMedalsByCountry = this.data.map((country) => ({
      name: country.country,
      value: country.participations.reduce(
        (sum, participation) => sum + participation.medalsCount, 0
      ),
    }));
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
