import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart3Component implements OnInit, OnChanges {

    @Input() public data: any;

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
        bottom: 80,
        top: 15,
    };
    public sortedBySalary = true;

    public x = d3.scaleBand().paddingInner(0.2).paddingOuter(0.2);
    public y = d3.scaleLinear();

    get barsData() {
        return this.sortedBySalary
        ? this.data.sort((a, b) => b.employee_salary - a.employee_salary)
        : this.data.sort((a, b) => (a.employee_name < b.employee_name) ? -1 : 1)
    }

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg').on('click', () => {
            this.dataChanged();
        });
        this.setDimensions();
        this.setElements();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.svg) {
            return;
        }
        this.updateChart();
    }

    private setAxis(): void {

        // Set X Axis
        this.xAxis = d3.axisBottom(this.x);

        // Set Y Axis
        this.yAxis = d3.axisLeft(this.y);
        this.yAxis.tickSizeInner(-this.innerWidth);
        this.yAxis.tickPadding(10);
        this.yAxis.tickFormat(d3.format('$~s'));

        // Set containers
        this.xAxisContainer.transition().duration(500).call(this.xAxis);
        this.xAxisContainer
            .selectAll('.tick text')
            .text((d: number) => this.getEmployeeName(d))
            .attr('transform', 'translate(-9, 2)rotate(-45)')
            .style('text-anchor', 'end');


        this.yAxisContainer.call(this.yAxis);
        this.yAxisContainer.selectAll('.tick line').style('stroke', '#ddd');
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
        const bars = this.dataContainer
            .selectAll('rect')
            .data(this.barsData, (d) => d.id);

        bars.enter()
            .append('rect')
            .merge(bars)
            .transition()
            .duration(500)
            .attr('x', (d) => this.x(d.id))
            .attr('width', this.x.bandwidth())
            .attr('height', (d) => this.innerHeight - this.y(d.employee_salary))
            .attr('y', (d) => this.y(d.employee_salary));

        bars.exit().remove();
    }

    private setParams(): void {
        const ids = this.barsData.map((d: any) => d.id);
        this.x.domain(ids).range([0, this.innerWidth]);
        const maxSalary = Math.max(...this.data.map((item: any) => item.employee_salary)) * 1.3;
        this.y.domain([0, maxSalary]).range([this.innerHeight, 0]);
    }

    private getEmployeeName(id: number): string {
        return this.data.find((d: any) => d.id === id).employee_name;
    }

    private setLabels(): void {
        this.svg
            .append('g')
            .attr('class', 'y-axis-label')
            .attr('transform', `translate(15, ${this.margin.top + 0.5 * this.innerHeight})`)
            .append('text')
            .attr('class', 'label')
            .text('Employee Salary')
            .attr('transform', `rotate(-90)`)
            .style('text-anchor', 'middle');
    }

    private dataChanged(): void {
        this.sortedBySalary = !this.sortedBySalary
        this.updateChart();
        console.log('Click');
    }

    private updateChart(): void {
        this.setParams();
        this.setAxis();
        this.setLabels();
        this.draw();
    }
}
