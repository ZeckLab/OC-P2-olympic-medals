import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartMedalsByCountryComponent } from './pie-chart-medals-by-country.component';

describe('PieChartMedalsByCountryComponent', () => {
  let component: PieChartMedalsByCountryComponent;
  let fixture: ComponentFixture<PieChartMedalsByCountryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieChartMedalsByCountryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieChartMedalsByCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
