import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Dashboard';
    public data1 = [125, 100, 50, 75, 200, 60, 70];
    public data2$: Observable<any[]>;
    public iris$: Observable<any[]>;

    constructor(private api: ApiService) {

    }

    public ngOnInit(): void {
        this.data2$ = this.api.getEmployees();
        this.iris$ = this.api.getIris();
        this.iris$.subscribe((c) => console.log(c));
        setTimeout(() => {
            this.data1 = [...this.data1, 600];
        }, 5000);
    }

}
