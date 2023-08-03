import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { IPieConfig } from 'src/app/interfaces/chart.interfaces';

@Component({
    selector: 'app-chart6',
    templateUrl: './chart6.component.html',
    styleUrls: ['./chart6.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart6Component implements OnInit, OnChanges {
    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public legendContainer: any;
    public title: any;

    // Functions
    public pie: any;
    public arc: any;

    // Scales
    public colours: any;

    // State
    public hiddenIds = new Map();

    // Dimensions
    public dimensions: DOMRect;
    public innerWidth: number;
    public innerHeight: number;
    public radius: number;
    public innerRadius = 0;

    // Config
    public config: IPieConfig = {
        innerRadiusCoef: 0.7,
        hiddenOpacity: 0.3,
        legendItem: {
            symbolSize: 10,
            height: 20,
            fontSize: 12,
            textSeparator: 15,
        },
        transition: 800,
        arcs: {
            stroke: '#fff',
            strokeWidth: 2,
            radius: 6,
            padAngle: 0,
        },
        margins: {
            left: 10,
            top: 40,
            right: 130,
            bottom: 10,
        }
    };

    get margins() {
        return this.config.margins;
    }

    get ids() {
        return this.data.data.map((d) => d.id);
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
        if (this.data) {
            this.setParams();
            this.setLabels();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.radius = 0.5 * Math.min(this.innerWidth, this.innerHeight);
        this.innerRadius = this.radius * this.config.innerRadiusCoef;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setElements(): void {
        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${this.margins.left + 0.5 * this.innerWidth}, ${this.margins.top + 0.5 * this.innerHeight})`);

        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${this.innerWidth - 0.5 * this.margins.right}, ${this.margins.top + 0.5 * this.innerHeight})`);

        this.title = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${this.dimensions.width * 0.5}, ${this.margins.top * 0.5})`)
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');
    }

    private setParams(): void {
        // Arc generator
        this.arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.radius);

        // Pie generator
        this.pie = d3.pie()
            .value((d) => d.value);

        // Colour scale
        this.colours = d3
            .scaleOrdinal(d3.schemeCategory10)
            .domain(this.ids);
    }

    private setLabels(): void {
        this.title.text(this.data.title);
    }

    private setLegend(): void {
    }

    private draw(): void {
    }

    private highlight(): void {
    }

}
