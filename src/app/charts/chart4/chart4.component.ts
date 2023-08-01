import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart4',
    templateUrl: './chart4.component.html',
    styleUrls: ['./chart4.component.scss'],
})
export class Chart4Component implements OnInit, OnChanges {

    @Input() public data: any;

    public xValue: string;
    public yValue: string;

    public host: any;
    public svg: any;

    public dimensions: DOMRect;
    public innerWidth: number;
    public innerHeight: number;
    public margins = {
        left: 40,
        top: 10,
        right: 10,
        bottom: 40,
    };

    public dataContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;

    public xLabel: any;
    public yLabel: any;

    public x: any;
    public y: any;

    get scatterData() {
        if (!(this.xValue && this.yValue)) {
            return [];
        }
        return this.data.map((elem) => ({
            x: +elem[this.xValue],
            y: +elem[this.yValue],
        }));
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
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
        this.setParams();
        this.setLabels();
        this.setAxis();
        this.draw();
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setElements(): void {
        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.xAxisContainer = this.svg
            .append('g')
            .attr('class', 'x-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.bottom + this.innerHeight})`);

        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.xLabel = this.svg
            .append('g')
            .attr('class', 'x-label-container')
            .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${this.dimensions.height - 5})`)
            .append('text')
            .attr('class', 'label')
            .style('text-anchor', 'middle');

        this.yLabel = this.svg
            .append('g')
            .attr('class', 'y-label-container')
            .attr('transform', `translate(15, ${this.margins.top * this.innerHeight})`)
            .append('text')
            .attr('class', 'label')
            .style('text-anchor', 'middle');

    }

    private setParams(): void {
        const maxXValue = d3.max(this.data, (d) => +d[this.xValue]) || 1;
        const maxYValue = d3.max(this.data, (d) => +d[this.yValue]) || 1;

        this.x = d3.scaleLinear()
            .domain([0, maxXValue])
            .range([0, this.innerWidth]);

        this.y = d3.scaleLinear()
            .domain([0, maxYValue])
            .range([this.innerHeight, 0]);
    }

    private setLabels(): void {

    }

    private setAxis(): void {

    }

    private draw(): void {

    }
}
