import { Component, ElementRef, Input, OnInit, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart5',
    templateUrl: './chart5.component.html',
    styleUrls: ['./chart5.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart5Component implements OnInit, OnChanges {

    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
        console.log(this);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        this.setParams();
        this.setLabels();
        this.setAxis();
        this.draw();
    }

    private setDimensions(): void {

    }

    private setElements(): void {

    }

    private setParams(): void {

    }

    private setLabels(): void {

    }

    private setAxis(): void {

    }

    private draw(): void {

    }
}
