import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChartMedalsByCountryComponent } from './pie-chart-medals-by-country/pie-chart-medals-by-country.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  public olympicsData: Olympic[] = [];


  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.loadOlympics();
  }

  private loadOlympics(): void {
  this.olympics$?.subscribe((data) => {
    console.log('****Données des jeux olympiques reçues dans le component home :', data);
    if (data) {
      this.olympicsData = data;
    }
  });
}

}
