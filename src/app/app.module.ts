import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { count, NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartMedalsByCountryComponent } from './pages/home/pie-chart-medals-by-country/pie-chart-medals-by-country.component';
import { HeaderComponent } from './shared/header/header.component';
import { CountryDetailComponent } from './pages/country-detail/country-detail.component';
import { BarChartCountryMedalsComponent } from './pages/country-detail/bar-chart-country-medals/bar-chart-country-medals.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, PieChartMedalsByCountryComponent, HeaderComponent, CountryDetailComponent, BarChartCountryMedalsComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, NgxChartsModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
