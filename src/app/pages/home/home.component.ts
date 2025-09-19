import { Component } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
  pieDataMedalsByCountry$ = this.olympicService.getPieDataMedalsByCountry();
  countryCount$ = this.olympicService.getCountryCount();
  participationCount$ = this.olympicService.getParticipationCount();

  constructor(private olympicService: OlympicService) {}
}
