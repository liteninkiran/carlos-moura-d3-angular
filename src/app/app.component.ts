import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, Subscription } from 'rxjs';
import { IGroupStackData, IPieData } from './interfaces/chart.interfaces';
import { PieHelper } from './helpers/pie.helper';
import { StackHelper } from './helpers/stack.helper';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    public title = 'Dashboard';
    public data1 = [125, 100, 50, 75, 200, 60, 70];
    public data2$: Observable<any[]>;
    public iris$: Observable<any>;
    public covid$: Observable<any>;
    public population$: Observable<any>;
    public population: any;
    public browsers$: Observable<any>;
    public browser: any;
    public pieData: IPieData = {
        title: '',
        data: [],
    };
    public populationSub: Subscription;
    public browserSub: Subscription;
    public pieConfig1 = {
        innerRadiusCoef: 0.5,
        transition: 800,
        arcs: {
            stroke: '#fff',
            strokeWidth: 2,
            radius: 6,
            padAngle: 0,
        },
    };
    public pieConfig2 = {
        innerRadiusCoef: 0,
        arcs: {
            radius: 0,
        },
    };
    public stackedData: IGroupStackData;

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        this.data2$ = this.api.getEmployees();
        this.iris$ = this.api.getIris();
        this.covid$ = this.api.getCovidData();
        this.population$ = this.api.getPopulationData();
        this.populationSub = this.population$.subscribe(data => {
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
        this.browsers$ = this.api.getBrowsersData();
        this.browserSub = this.browsers$.subscribe((data) => {
            this.browser = data;
            this.setPieData('now');
        });
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
    }

    public ngOnDestroy(): void {
        this.populationSub.unsubscribe();
        this.browserSub.unsubscribe();
    }

    public setPieData(event: any): void {
        const valueAttr: string =  typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
        this.pieData = PieHelper.convert(this.browser, 'Browser Market Share', valueAttr, 'name', 'name');
    }
}
