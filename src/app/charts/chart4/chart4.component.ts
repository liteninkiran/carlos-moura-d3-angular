import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-chart4',
    templateUrl: './chart4.component.html',
    styleUrls: ['./chart4.component.scss'],
})
export class Chart4Component implements OnInit {

    @Input() public data: any;

    public xValue: string;
    public yValue: string;

    constructor() {
        console.log(this);
    }

    public ngOnInit(): void {
    }

    public setOption(option: string, event): void {
        const value = event && event.target && event.target.value;
        switch (option) {
            case 'x': this.xValue = value; break;
            case 'y': this.yValue = value; break;
        }

        this.updateChart();
    }

    private updateChart(): void {

    }
}
