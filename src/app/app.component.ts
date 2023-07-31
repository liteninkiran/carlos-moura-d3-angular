import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    public title = 'Dashboard';
    public data = [125, 100, 50, 75, 200, 60, 70];

    public ngOnInit(): void {
        setTimeout(() => {
            console.log('updated');
            this.data = [...this.data, 600];
        }, 5000);
    }

}
