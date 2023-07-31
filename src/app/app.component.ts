import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Dashboard';
    public data1 = [125, 100, 50, 75, 200, 60, 70];
    public data2 = [50, 200, 150, 50, 100, 250, 120];

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
    }

}
