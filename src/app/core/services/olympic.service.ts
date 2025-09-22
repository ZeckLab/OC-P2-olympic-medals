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
  // Indicates if the loaded data is valid for generating charts
  private hasValidData$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  /**
  * Loads Olympic data from the API.
  * Validates the consistency of the data, updates internal observables,
  * and handles errors gracefully if the request fails.
  *
  * @returns Observable<Olympic[] | null> - The Olympic data if valid, or null otherwise.
  */
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
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  getOlympics() : Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  getHasValidData(): Observable<boolean> {
  return this.hasValidData$.asObservable();
  }

  // ******* New methods to get global stats and pie chart data *******
  /**
  * Computes global statistics from the Olympic dataset.
  * Extracts the total number of countries and the number of participations
  * from the first Olympic entry as the data is consistent.
  *
  * @returns Observable<GlobalStats> - Contains countryCount and participationCount,
  * or default values (0) if an error occurs.
  */
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

  /**
  * Generates pie chart data representing the total number of medals per country.
  * Aggregates medal counts across all participations for each Olympic entry.
  *
  * @returns Observable<ChartData[]> - Array of chart data objects with country name and medal count,
  * or an empty array if an error occurs.
  */
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
  /**
  * Retrieves aggregated statistics for a specific country based on Olympic data.
  * Calculates total medals, total athletes, and number of participations.
  *
  * @param country - The name of the country to extract statistics for.
  * @returns Observable<CountryStats> - Object containing medal count, athlete count, and participation count,
  * or default values (0) if an error occurs.
  */
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

  /**
  * Generates bar chart data showing the number of medals won by a country across its participations.
  * Each data point represents a year and the corresponding medal count.
  *
  * @param country - The name of the country to generate chart data for.
  * @returns Observable<ChartData[]> - Array of chart entries with year and medal count,
  * or an empty array if no data is found or an error occurs.
  */
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

  /**
  * Checks whether a given country exists in the Olympic dataset.
  *
  * @param name - The name of the country to verify.
  * @returns Observable<boolean> - True if the country is found, false otherwise or if an error occurs.
  */
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

  /**
  * Searches for Olympic data corresponding to a specific country.
  *
  * @param name - The name of the country to search for.
  * @param olympics - The full Olympic dataset.
  * @returns Olympic | undefined - The matching Olympic entry, or undefined if not found.
  */
  private findCountryData(name: string, olympics: Olympic[]): Olympic | undefined {
    return olympics.find((olympic) => olympic.country.toLowerCase() === name.toLowerCase());
  }

  /**
  * Validates the consistency of the Olympic dataset.
  * Ensures all countries have the same number of participations and matching years.
  *
  * @param olympics - The Olympic dataset to validate.
  * @returns boolean - True if the data is consistent, false otherwise.
  */

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
