import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart4',
    templateUrl: './chart4.component.html',
    styleUrls: ['./chart4.component.scss'],
})
export class Chart4Component implements OnInit {

    @Input() public data: any;

    public xValue: string;
    public yValue: string;

    public host: any;
    public svg: any;

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
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
