import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart3Component implements OnInit {

    public host: any;
    public svg: any;

    public rectWidth = 20;
    public padding = 3;

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.svg
            .selectAll('rect')
            .data([10, 20, 30])
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * (this.rectWidth + this.padding))
            .attr('width', this.rectWidth)
            .attr('height', (d) => d);
    }
}
