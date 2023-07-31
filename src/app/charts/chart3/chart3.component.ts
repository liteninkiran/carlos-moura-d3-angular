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
    public dimensions: DOMRect;
    public rectWidth = 20;
    public padding = 3;

    public x = d3.scaleLinear();

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.dimensions = this.svg.node().getBoundingClientRect();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.svg) {
            return;
        }
        this.setParams();
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
            .attr('height', (d) => this.dimensions.height - this.x(d.employee_salary))
            .attr('y', (d) => this.x(d.employee_salary));
    }

    private setParams(): void {
        const maxSalary = Math.max(...this.data.map((item: any) => item.employee_salary)) * 1.2;
        this.x.domain([0, maxSalary]).range([
            this.dimensions.height,
            0,
        ]);
    }

}
