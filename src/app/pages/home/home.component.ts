import { Component } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
  pieDataMedalsByCountry$ = this.olympicService.getPieChartDataForMedalsByCountry();
  globalStats$ = this.olympicService.getGlobalStats();
  isValid$ = this.olympicService.getHasValidData();

  constructor(private olympicService: OlympicService) {}
}
