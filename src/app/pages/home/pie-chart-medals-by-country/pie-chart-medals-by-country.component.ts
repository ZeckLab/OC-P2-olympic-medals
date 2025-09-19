import { Component, Input, OnChanges } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';
import { HostListener } from '@angular/core';
import { ChartData } from 'src/app/core/models/ChartData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pie-chart-medals-by-country',
  templateUrl: './pie-chart-medals-by-country.component.html',
  styleUrl: './pie-chart-medals-by-country.component.scss',
  standalone: false,
})
export class PieChartMedalsByCountryComponent implements OnChanges {
  @Input() pieDataMedalsByCountry: ChartData[] = [];
  view: [number, number] = [880, 500];
  showLegend = false;
  showLabels = true;
  maxLabelLength = 20;

  constructor(private router: Router) {}

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

  onSelect(event: any): void {
    const countryName = event?.name;
    if (countryName) {
      const formatted = countryName.toLowerCase(); // ou encodeURIComponent si besoin
      this.router.navigate(['/country-detail', formatted]);
    }
  }

}
