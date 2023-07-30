import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-chart1',
    templateUrl: './chart1.component.html',
    styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit {

    public data = [125, 100, 50, 75, 200];

    constructor() {

    }

    public ngOnInit(): void {

    }

}
