import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, tap, map, filter } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { ChartData } from '../models/ChartData';
import { CountryStats } from '../models/Stats';
import { GlobalStats } from '../models/Stats';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  // Holds Olympic data fetched from API. Null = not loaded or error.
  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
  private hasValidData$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      map(olympics => {
        const isValid = this.isConsistentData(olympics);
        this.hasValidData$.next(isValid);
        if (!isValid) {
          console.error('The data is inconsistent and prevents chart generation.');
          return null;
        }

        return olympics;
      }),
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error('An error occurred while loading Olympic data.', error);
        // can be useful to end loading state and let the user know something went wrong
        this.hasValidData$.next(false);
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getHasValidData(): Observable<boolean> {
  return this.hasValidData$.asObservable();
  }

  // ******* New methods to get global stats and pie chart data *******
  getGlobalStats(): Observable<GlobalStats> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map((olympics): GlobalStats => {
        const countryCount = olympics.length;
        const participationCount = olympics[0].participations.length;
        return { countryCount, participationCount };
      }),
      catchError(() => of({ countryCount: 0, participationCount: 0 }))
    );
  }

  getPieChartDataForMedalsByCountry(): Observable<ChartData[]> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map((olympics) =>
        olympics.map(
          (olympic): ChartData => ({
            name: olympic.country,
            value: olympic.participations.reduce(
              (sum, participation) => sum + participation.medalsCount,0
            ),
          })
        )
      ),
      catchError((error) => {
        console.error('An error occurred while processing bar chart data :', error);
        return of([]);
      })
    );
  }

  // ******* New methods to get country-specific stats and bar chart data *******
  getCountryStats(country: string): Observable<CountryStats> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map((olympics): CountryStats => {
        const olympic = this.findCountryData(country, olympics);
        const participations = olympic?.participations ?? [];

        const totalMedals = participations.reduce(
          (sum, participation) => sum + participation.medalsCount,
          0
        );
        const totalAthletes = participations.reduce(
          (sum, participation) => sum + participation.athleteCount,
          0
        );
        const participationCount = participations.length;

        return { totalMedals, totalAthletes, participationCount };
      }),
      catchError(() =>
        of({ totalMedals: 0, totalAthletes: 0, participationCount: 0 })
      )
    );
  }

  getBarChartDataForCountryMedalsByParticipation(country: string): Observable<ChartData[]> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map((olympics) => {
        const countryData = this.findCountryData(country, olympics);
        if (!countryData?.participations?.length) {
          return [];
        }
        return countryData.participations.map(
          (participation): ChartData => ({
            name: participation.year.toString(),
            value: participation.medalsCount,
          })
        );
      }),
      catchError((error) => {
        console.error('An error occurred while processing bar chart data :', error);
        return of([]);
      })
    );
  }

  countryExists(name: string): Observable<boolean> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map((olympics) => !!this.findCountryData(name, olympics)),
      catchError((error) => {
        console.error('Erreur lors de la vérification du pays :', error);
        return of(false);
      })
    );
  }


  private findCountryData(name: string, olympics: Olympic[]): Olympic | undefined {
    return olympics.find((olympic) => olympic.country.toLowerCase() === name.toLowerCase());
  }

  private isConsistentData(olympics: Olympic[] | null): boolean {
    if (!olympics || olympics.length === 0) return false;

    const referenceYears = olympics[0].participations.map(participation => participation.year).sort();

    const allSameCount = olympics.every(olympic => olympic.participations.length === referenceYears.length);
    if (!allSameCount) return false;

    const isConsistent = referenceYears.every(
      year => olympics.every(
        olympic => olympic.participations.some(
          participation => participation.year === year
        )
      )
    );

    return isConsistent;
  }

}
