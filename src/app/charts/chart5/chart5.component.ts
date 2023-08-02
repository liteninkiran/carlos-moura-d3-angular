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

    // Axes
    public xAxis: any;
    public yAxis: any;

    // Line generator
    public line: any;

    // Getters
    get lineData() {
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
        //console.log(this);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        if (this.data) {
            //console.log(this.data);
            this.setParams();
            this.setLabels();
            this.setAxis();
            this.setLegend();
            this.draw();
        }
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
        const parsedDates = this.data.map((d: any) => this.timeParse(d.date));

        // Set Domains
        const xDomain = d3.extent(parsedDates);
        const maxValues = this.lineData.map((series) => d3.max(series.data, (d) => d.y));
        const yDomain = [0, d3.max(maxValues)];
        const colourDomain = this.selected;

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

        this.line = d3.line()
            .x((d) => this.x(d.x))
            .y((d) => this.y(d.y))
    }

    private setLabels(): void {
        this.title.text('Covid Evolution in US');
    }

    private setAxis(): void {
        this.xAxis = d3
            .axisBottom(this.x)
            .ticks(d3.timeMonth.every(3))
            .tickFormat(d3.timeFormat('%b %Y'))
            .tickSizeOuter(0);

        this.xAxisContainer
            .transition()
            .duration(500)
            .call(this.xAxis);

        this.yAxis = d3.axisLeft(this.y)
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(-this.innerWidth)
            .tickFormat(d3.format('~s'));

        this.yAxisContainer
            .transition()
            .duration(500)
            .call(this.yAxis);

        // Apply dashes to all horizontal lines except the x-axis
        this.yAxisContainer
            .selectAll('.tick:not(:nth-child(2)) line')
            .style('stroke', '#ddd')
            .style('stroke-dasharray', '2 2');
    }

    private setLegend(): void {
        // 1 - Select item containers and bind data
        const itemContainers = this.legendContainer.selectAll('g.legend-item').data(this.selected);

        // 2 - Enter:
        //      a: Add new containers
        //      b: Add circle & text
        const newItems = itemContainers.enter()
            .append('g')
            .attr('class', 'legend-item')
            .each(function(d) {
                const g = d3.select(this);
                g.append('circle')
                    .attr('class', 'legend-icon')
                    .attr('cx', 3)
                    .attr('cy', -4)
                    .attr('r', 3);

                g.append('text')
                    .attr('class', 'legend-label')
                    .attr('x', 9)
                    .style('font-size', '0.8rem');
            });

        // 3 - Merge:
        //      a: Update circle & text (colour and label)
        //      b: Bind events (click and hover)
        const mergedSelection = newItems.merge(itemContainers);
        mergedSelection
            .selectAll('circle.legend-icon')
            .style('fill', (d) => this.colours(d));
        mergedSelection
            .selectAll('text.legend-label')
            .text((d) => d);

        // 4 - Update State:
        //      a: Transition
        //      b: Set opacity (if active => 1 else 0.3)

        // 5 - Remove unneeded groups
        itemContainers.exit().remove();

        // 6 - Repositioning Items
        let totalPadding = 0;
        this.legendContainer
            .selectAll('g.legend-item')
            .each(function() {
                const g = d3.select(this); // Arrow function will change scope of "this"
                g.attr('transform', `translate(${totalPadding}, 0)`);
                totalPadding += g.node().getBBox().width + 10;
            });

        // 7 - Repositioning Legend
        const legendWidth = this.legendContainer.node().getBBox().width;
        const x = this.margins.left + 0.5 * (this.innerWidth - legendWidth);
        const y = this.dimensions.height - 0.5 * this.margins.bottom + 10;
        this.legendContainer.attr('transform', `translate(${x}, ${y})`);

    }

    private draw(): void {
        // Bind data
        const lines = this.dataContainer.selectAll('path.data').data(this.lineData);

        // Enter and merge
        lines.enter()
            .append('path')
            .attr('class', 'data')
            .style('fill', 'none')
            .style('stroke-width', '2px')
            .merge(lines)
            .attr('d', (d) => this.line(d.data))
            .style('stroke', (d) => this.colours(d.name));

        // Exit
        lines.exit().remove();
    }
}
