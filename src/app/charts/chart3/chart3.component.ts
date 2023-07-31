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
    public dataContainer: any;
    public xAxisContainer: any;
    public xAxis: any;
    public yAxisContainer: any;
    public yAxis: any;
    public dimensions: DOMRect;
    public rectWidth = 30;
    public padding = 5;
    public innerWidth: number;
    public innerHeight: number;
    public margin = {
        left: 60,
        right: 20,
        bottom: 16,
        top: 15,
    };

    public x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
    public y = d3.scaleLinear();

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.svg) {
            return;
        }
        this.setParams();
        this.setAxis();
        this.draw();
    }

    private setAxis(): void {

        // Set X Axis
        this.xAxis = d3.axisBottom(this.x);

        // Set Y Axis
        this.yAxis = d3.axisLeft(this.y);
        // this.yAxis.ticks(3);
        // const max = this.y.domain()[1];
        // const values = [0.00, 0.25, 0.50, 0.75, 1.00];
        // const valuesMapped = values.map((d) => d * max);
        // this.yAxis.tickValues(valuesMapped);
        this.yAxis.tickSize(-this.innerWidth);
        this.yAxis.tickSizeOuter(0);
        this.yAxis.tickPadding(10);
        //this.yAxis.tickFormat(d3.format('$,'));
        this.yAxis.tickFormat(d3.format('$~s'));

        // Set containers
        this.xAxisContainer.call(this.xAxis);
        this.yAxisContainer.call(this.yAxis);
    }

    private setElements(): void {
        this.xAxisContainer = this.svg.append('g')
            .attr('class', 'x-axis-container')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.innerHeight})`);
        this.yAxisContainer = this.svg.append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this.dataContainer = this.svg.append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margin.left - this.margin.right;
        this.innerHeight = this.dimensions.height - this.margin.top - this.margin.bottom;
    }

    private draw(): void {
        this.dataContainer
            .selectAll('rect')
            .data(this.data || [])
            .enter()
            .append('rect')
            .attr('x', (d) => this.x(d.id))
            .attr('width', this.x.bandwidth())
            .attr('height', (d) => this.innerHeight - this.y(d.employee_salary))
            .attr('y', (d) => this.y(d.employee_salary));
    }

    private setParams(): void {
        const ids = this.data.map((d: any) => d.id);
        this.x.domain(ids).range([0, this.innerWidth]);
        const maxSalary = Math.max(...this.data.map((item: any) => item.employee_salary)) * 1.3;
        this.y.domain([0, maxSalary]).range([this.innerHeight, 0]);
    }

}
