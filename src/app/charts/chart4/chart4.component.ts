import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart4',
    templateUrl: './chart4.component.html',
    styleUrls: ['./chart4.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart4Component implements OnInit, OnChanges {

    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;

    // Labels
    public xLabel: any;
    public yLabel: any;

    // User options
    public xValue: string = '';
    public yValue: string = '';

    // Dimensions
    public dimensions: DOMRect = new DOMRect();
    public innerWidth: number = 300;
    public innerHeight: number = 150;

    public margins = {
        left: 40,
        top: 10,
        right: 20,
        bottom: 40,
    };

    // Scales
    public x: any;
    public y: any;

    // Axes
    public xAxis: any;
    public yAxis: any;

    public colours: any;

    get scatterData() {
        if (!(this.xValue && this.yValue)) {
            return [];
        }
        return this.data.map((elem: any) => ({
            x: +elem[this.xValue],
            y: +elem[this.yValue],
            species: elem.Species,
        }));
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
    }

    public setOption(option: string, event: any): void {
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
        this.xAxisContainer = this.svg
            .append('g')
            .attr('class', 'x-axis-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top + this.innerHeight})`);

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
            .attr('transform', `translate(15, ${this.margins.top + 0.5 * this.innerHeight})`)
            .append('text')
            .attr('class', 'label')
            .attr('transform', 'rotate(-90)')
            .style('text-anchor', 'middle');

        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);
    }

    private setParams(): void {
        const maxXValue: number = this.xValue ? d3.max(this.data, (d: any) => +d[this.xValue]) as number : 1;
        const maxYValue: number = this.yValue ? d3.max(this.data, (d: any) => +d[this.yValue]) as number : 1;
        const uniqueSpecies: any = new Set((this.data || []).map((d: any) => d.Species));

        this.x = d3.scaleLinear()
            .domain([0, maxXValue])
            .range([0, this.innerWidth]);

        this.y = d3.scaleLinear()
            .domain([0, maxYValue])
            .range([this.innerHeight, 0]);

        this.colours = d3
            .scaleOrdinal(d3.schemeCategory10)
            .domain(uniqueSpecies);
    }

    private setLabels(): void {
        this.xLabel.text(this.xValue);
        this.yLabel.text(this.yValue);
    }

    private setAxis(): void {
        this.xAxis = d3.axisBottom(this.x).tickSizeOuter(0);
        this.xAxisContainer
            .transition()
            .duration(500)
            .call(this.xAxis);

        this.yAxis = d3.axisLeft(this.y)
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(-this.innerWidth);
        this.yAxisContainer
            .transition()
            .duration(500)
            .call(this.yAxis);

        this.yAxisContainer
            .selectAll('.tick:not(:nth-child(2)) line')
            .style('stroke', '#ddd')
            .style('stroke-dasharray', '2 2');
    }

    private draw(): void {
        // Bind the data
        const scatter = this.dataContainer
            .selectAll('circle.data')
            .data(this.scatterData);

        // Enter and merge
        scatter
            .enter()
            .append('circle')
            .attr('class', 'data')
            .attr('r', 4)
            .style('fill', (d: any) => this.colours(d.species))
            .style('opacity', 0.4)
            .merge(scatter)
            .attr('cx', (d: any) => this.x(d.x))
            .attr('cy', (d: any) => this.y(d.y))

        // Exit
        scatter.exit().remove();
    }
}
