import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart3Component implements OnInit, OnChanges {

    @Input() public data: Array<number>;

    public host: any;
    public svg: any;

    public rectWidth = 20;
    public padding = 3;

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.draw();
    }

    private draw() {
        this.svg
            .selectAll('rect')
            .data(this.data || [])
            .enter()
            .append('rect')
            .attr('x', (d, i) => i * (this.rectWidth + this.padding))
            .attr('width', this.rectWidth)
            .attr('height', (d) => d.employee_age);
    }
}
