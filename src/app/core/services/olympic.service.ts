import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, tap, map, filter } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';



@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  // Holds Olympic data fetched from API. Null = not loaded or error.
  private olympics$ = new BehaviorSubject<Olympic[] |null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error("An error occurred while loading Olympic data.", error);
        // can be useful to end loading state and let the user know something went wrong
        // gestion simple de l'erreur, fault-il un retry ?
        this.olympics$.next(null);
        return of(null);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryCount(): Observable<number> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map(olympics => olympics.length)
    );
  }

  getParticipationCount(): Observable<number> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map(olympics => olympics[0].participations.length)
    );
  }

  getPieDataMedalsByCountry(): Observable<{ name: string; value: number }[]> {
    return this.getOlympics().pipe(
      filter((olympics): olympics is Olympic[] => olympics !== null),
      map(olympics =>
        olympics.map(olympic => ({
          name: olympic.country,
          value: olympic.participations.reduce(
            (sum, participation) => sum + participation.medalsCount,0
        )
      }))
    )
  );
}



}


