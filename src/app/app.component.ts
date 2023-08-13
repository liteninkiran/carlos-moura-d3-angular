import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { IGroupStackConfig, IGroupStackData, IPieConfig, IPieData } from './interfaces/chart.interfaces';
import { PieHelper } from './helpers/pie.helper';
import { StackHelper } from './helpers/stack.helper';
import { MapHelper } from './helpers/map.helper';
import { SwarmHelper } from './helpers/swarm.helper';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    public title = 'Dashboard';
    public data1 = [125, 100, 50, 75, 200, 60, 70];
    public data2$: Observable<any[]> = new Observable();
    public iris$: Observable<any> = new Observable();
    public covid$: Observable<any> = new Observable();
    public population$: Observable<any> = new Observable();
    public population: any;
    public browsers$: Observable<any> = new Observable();
    public browser: any;
    public pieData: IPieData = {
        title: '',
        data: [],
    };
    public pieConfig1: IPieConfig = {
        innerRadiusCoef: 0.5,
        transition: 800,
        arcs: {
            stroke: '#fff',
            strokeWidth: 2,
            radius: 6,
            padAngle: 0,
        },
        hiddenOpacity: 0,
        legendItem: {
            symbolSize: 0,
            height: 0,
            fontSize: 0,
            textSeparator: 0,
        },
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    };
    public pieConfig2: IPieConfig = {
        innerRadiusCoef: 0,
        arcs: {
            radius: 0,
            stroke: '',
            strokeWidth: 0,
            padAngle: 0,
        },
        hiddenOpacity: 0,
        legendItem: {
            symbolSize: 0,
            height: 0,
            fontSize: 0,
            textSeparator: 0,
        },
        transition: 0,
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    };
    public stackedData: IGroupStackData = {} as any;
    public config: IGroupStackConfig = {} as any;

    public geoCountries$: Observable<any> = new Observable();
    public covidByCountry$: Observable<any> = new Observable();
    public countryCodes$: Observable<any> = new Observable();
    public demographics$: Observable<any> = new Observable();
    public subscriptions: Subscription[] = [];
    public covidMap = new MapHelper();
    public swarmHelper = new SwarmHelper();

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        let sub: Subscription;
        this.data2$ = this.api.getEmployees();
        this.iris$ = this.api.getIris();
        this.covid$ = this.api.getCovidData();
        this.population$ = this.api.getPopulationData();
        sub = this.population$.subscribe(data => {
            this.population = data;
            const stacks = StackHelper.SetStacks(data, 'year', 'gender', 'age_group', 'value', (val) => val/1e6);
            this.stackedData = {
                title: 'Population by year, gender and age group (in millions)',
                yLabel: 'Population (millions)',
                unit: 'million',
                data: stacks,
                stackOrder: ['<3', '4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '>=40'],
            };
        });
        this.subscriptions.push(sub);
        this.browsers$ = this.api.getBrowsersData();
        sub = this.browsers$.subscribe((data) => {
            this.browser = data;
            this.setPieData('now');
        });
        this.subscriptions.push(sub);
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
        this.geoCountries$ = this.api.getCountriesGeoData();
        this.covidByCountry$ = this.api.getCovidByCountry();
        this.countryCodes$ = this.api.getCountryCodes();
        sub = combineLatest([
            this.covidByCountry$,
            this.countryCodes$,
        ]).subscribe(([data, codes]) => {
            this.covidMap.setData(data, codes);
        });
        this.subscriptions.push(sub);

        this.demographics$ = this.api.getDemographics();
        sub = this.demographics$.subscribe((data: any) => {
            this.swarmHelper.setData(
                data,
                'Demographics by Country and Year',
                'year',
                'code',
                'name',
                'median_age',
                'continent',
                'median age (years)',
                1
            );
            console.log(this.swarmHelper);
        });
        this.subscriptions.push(sub);
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe())
    }

    public setPieData(event: any): void {
        const valueAttr: string =  typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
        this.pieData = PieHelper.convert(this.browser, 'Browser Market Share', valueAttr, 'name', 'name');
    }
}
