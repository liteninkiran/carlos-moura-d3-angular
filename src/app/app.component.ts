import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable, Subscription, map } from 'rxjs';
import { IPieData } from './interfaces/chart.interfaces';

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

    constructor(private api: ApiService) {

    }
    public ngOnInit(): void {
        this.data2$ = this.api.getEmployees();
        this.iris$ = this.api.getIris();
        this.covid$ = this.api.getCovidData();
        this.browsers$ = this.api.getBrowsersData();
        this.sub = this.browsers$.subscribe((data) => {
            this.browser = data;
            this.pieData = this.convertBrowserToPieData('now');
            console.log(this.pieData);
        });
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private convertBrowserToPieData(valueAttr: string): IPieData {
        const data = this.browser.map((elem) => ({
            id: elem.name,
            label: elem.name,
            value: elem[valueAttr],
        }));
        return {
            title: 'Browser Market Share',
            data,
        };
    }
}
