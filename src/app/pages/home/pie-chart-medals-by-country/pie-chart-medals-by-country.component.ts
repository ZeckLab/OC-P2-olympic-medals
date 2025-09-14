import { Component, Input, OnChanges } from '@angular/core';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
    selector: 'app-pie-chart-medals-by-country',
    templateUrl: './pie-chart-medals-by-country.component.html',
    styleUrl: './pie-chart-medals-by-country.component.scss',
    standalone: false
})
export class PieChartMedalsByCountryComponent implements OnChanges{
  @Input() data: Olympic[] = [];

  pieDataMedalsByCountry: { name: string; value: number }[] = [];

  ngOnChanges(): void {
    this.preparePieDataMedalsByCountry();
  }

  private preparePieDataMedalsByCountry(): void {
    console.log('*******Données reçues pour le pie chart :', this.data);
    this.pieDataMedalsByCountry = this.data.map(country => ({
      name: country.country,
      value: country.participations.reduce((sum, participation) => sum + participation.medalsCount, 0)
    }));
  }
}
