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

    // Dimensions
    public dimensions: DOMRect;
    public innerWidth: number;
    public innerHeight: number;

    public margins = {
        left: 50,
        top: 40,
        right: 20,
        bottom: 80,
    };

    // Containers
    public dataContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;
    public legendContainer: any;
    public title: any;

    // Time formatters
    public timeParse = d3.timeParse('%Y%m%d');
    public niceData = d3.timeFormat('%B %Y');

    // Scales
    public x: any;
    public y: any;
    public colours: any;

    // Selected Data
    public selected = ['hospitalized', 'death', 'hospitalizedCurrently'];

    // Getters
    get lineData() {
        // return !this.data ? [] : this.data.map((d: any) => ({
        //     x: this.timeParse(d.date),
        //     y: d.hospitalized,
        // }));
        return this.selected.map((item) => ({
            name: item,
            data: this.data.map((d) => ({
                x: this.timeParse(d.date),
                y: d[item],
            })).sort((a, b) => a.x < b.x ? -1 : 1),
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

        this.title = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${0.5 * this.margins.top})`)
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');

        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`);

        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${this.margins.left}, ${this.dimensions.height - 0.5 * this.margins.bottom + 10})`);
    }

    private setParams(): void {
        // Temporary solution
        const parsedDates = !this.data ? [] : this.data.map((d: any) => this.timeParse(d.date));

        // Set Domains
        const xDomain = !!parsedDates ? d3.extent(parsedDates) : [0, Date.now()];
        const yDomain = [0, 100];
        const colourDomain = ['A', 'B', 'C'];

        // Set Ranges
        const xRange = [0, this.innerWidth];
        const yRange = [this.innerHeight, 0];
        const colourRange = d3.schemeCategory10;

        // Set scales
        this.x = d3.scaleTime()
            .domain(xDomain)
            .range(xRange);

        this.y = d3.scaleLinear()
            .domain(yDomain)
            .range(yRange);

        this.colours = d3
            .scaleOrdinal()
            .domain(colourDomain)
            .range(colourRange);
    }

    private setLabels(): void {

    }

    private setAxis(): void {

    }

    private draw(): void {

    }
}
