import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, Subscription } from 'rxjs';
import { IPieConfig, IPieData } from './interfaces/chart.interfaces';
import { PieHelper } from './helpers/pie.helper';

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
    public browsers$: Observable<any>;
    public browser: any;
    public pieData: IPieData = {
        title: '',
        data: [],
    };
    public sub: Subscription;
    public pieConfig = {
        innerRadiusCoef: 0,
        arcs: {
            radius: 0,
        },
    };

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        this.data2$ = this.api.getEmployees();
        this.iris$ = this.api.getIris();
        this.covid$ = this.api.getCovidData();
        this.browsers$ = this.api.getBrowsersData();
        this.sub = this.browsers$.subscribe((data) => {
            this.browser = data;
            this.setPieData('now');
        });
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    public setPieData(event: any): void {
        const valueAttr: string =  typeof event === 'string' ? event : (event.target as HTMLInputElement).value;
        this.pieData = PieHelper.convert(this.browser, 'Browser Market Share', valueAttr, 'name', 'name');
    }
}
