import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, EMPTY } from 'rxjs';
import { ChartData } from 'src/app/core/models/ChartData';
import { CountryStats } from 'src/app/core/models/Stats';
import { shareReplay, switchMap } from 'rxjs/operators';


@Component({  
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrl: './country-detail.component.scss',
  standalone: false,
})
export class CountryDetailComponent implements OnInit {
  country = '';
  barDataForCountryMedalsByParticipation$!: Observable<ChartData[]>;
  countryStats$!: Observable<CountryStats>;
  
  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.country = this.route.snapshot.paramMap.get('country') || '';

    const countryExists$ = this.olympicService.countryExists(this.country).pipe(
      shareReplay(1)
    );

    this.barDataForCountryMedalsByParticipation$ = countryExists$.pipe(
      switchMap(exists => {
        if (!exists) {
          this.router.navigate(['/not-found']);
          return EMPTY;
      }

      return this.olympicService.getBarChartDataForCountryMedalsByParticipation(this.country);
      })
    );


    this.countryStats$ = countryExists$.pipe(
      switchMap(exists => {
        if (!exists) {
          this.router.navigate(['/not-found']);
          return EMPTY;
      }
      return this.olympicService.getCountryStats(this.country);
      })
    );
  }
}
