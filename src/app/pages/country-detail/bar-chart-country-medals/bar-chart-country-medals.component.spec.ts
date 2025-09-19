import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartCountryMedalsComponent } from './bar-chart-country-medals.component';

describe('BarChartCountryMedalsComponent', () => {
  let component: BarChartCountryMedalsComponent;
  let fixture: ComponentFixture<BarChartCountryMedalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartCountryMedalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartCountryMedalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});