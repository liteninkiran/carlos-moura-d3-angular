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

    public x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
    public y = d3.scaleLinear();

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
            .attr('x', (d) => this.x(d.id))
            .attr('width', this.x.bandwidth())
            .attr('height', (d) => this.dimensions.height - this.y(d.employee_salary))
            .attr('y', (d) => this.y(d.employee_salary));
    }

    private setParams(): void {
        const ids = this.data.map((d: any) => d.id);
        this.x.domain(ids).range([0, this.dimensions.width]);
        const maxSalary = Math.max(...this.data.map((item: any) => item.employee_salary)) * 1.2;
        this.y.domain([0, maxSalary]).range([this.dimensions.height, 0]);
    }

}
