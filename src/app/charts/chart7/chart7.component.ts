import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ChartDimensions } from 'src/app/helpers/chart.dimensions.helper';
import ObjectHelper from 'src/app/helpers/object.helper';
import { IGroupStackConfig, IGroupStackData } from 'src/app/interfaces/chart.interfaces';

@Component({
    selector: 'app-chart7',
    template: `
    <svg class="chart7">
        <style>
            .chart7 {
                font-size: 12px;
            }

            .chart7 text.title {
                font-weight: bold;
            }
        </style>
    </svg>`,
    styles: []
})
export class Chart7Component implements OnInit, OnChanges {
    @Input() set data(values) {
        this._data = ObjectHelper.UpdateObjectWithPartialValues(this._defaultData, values);
    };

    @Input() public set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IGroupStackConfig>(this._defaultConfig, values);
    };

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public legendContainer: any;
    public xAxisContainer: any;
    public yAxisContainer: any;
    public tooltipContainer: any;

    // Axes
    public xAxis: any;
    public yAxis: any;

    // Labels
    public title: any;
    public yLabel: any;

    // Scales
    public scales: any = {};

    // State
    public hiddenIds = new Set();

    // Dimensions
    public dimensions: ChartDimensions;

    // Config
    private _config: IGroupStackConfig;
    private _defaultConfig: IGroupStackConfig = {
        hiddenOpacity: 0.3,
        transition: 300,
        margins: {
            top: 40,
            right: 20,
            bottom: 60,
            left: 50,
        },
    };

    private _defaultData: IGroupStackData = {
        title: '',
        yLabel: '',
        unit: '',
        data: [],
    };

    private _data: IGroupStackData;

    get config(): IGroupStackConfig {
        if (!this._config) {
            this.config = this._defaultConfig;
        }

        return this._config;
    }

    get data(): IGroupStackData {
        if (!this._data) {
            this._data = this._defaultData;
        }
        return this._data;
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
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
        this.setLegend();
        this.draw();
    }

    private setDimensions(): void {
        this.dimensions = new ChartDimensions(this.svg.node().getBoundingClientRect(), this.config.margins);
    }

    private setElements(): void {
        const coords = {
            xAxis: this.getTranslations('x-axis-container'),
            yAxis: this.getTranslations('y-axis-container'),
            data: this.getTranslations('data-container'),
            legend: this.getTranslations('legend-container'),
            title: this.getTranslations('title'),
            yLabel: this.getTranslations('y-label'),
        };
        this.xAxisContainer = this.svg
            .append('g').attr('class', 'x-axis-container')
            .attr('transform', `translate(${coords.xAxis.x}, ${coords.xAxis.y})`);
  
        this.yAxisContainer = this.svg
            .append('g')
            .attr('class', 'y-axis-container')
            .attr('transform', `translate(${coords.yAxis.x}, ${coords.yAxis.y})`);
  
        this.dataContainer = this.svg
            .append('g').attr('class', 'data-container')
            .attr('transform', `translate(${coords.data.x}, ${coords.data.y})`);
  
        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${coords.legend.x}, ${coords.legend.y})`);
  
        this.title = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${coords.title.x}, ${coords.title.y})`)
            .append('text').attr('class', 'title')
            .style('text-anchor', 'middle');

        this.yLabel = this.svg
            .append('g')
            .attr('class', 'y-label-container')
            .attr('transform', `translate(${coords.yLabel.x}, ${coords.yLabel.y})`)
            .append('text').attr('class', 'yLabel')
            .style('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)');

        // TODO... add tooltip
    }

    private setParams(): void {
        this.setXScale();
        this.setYScale();
        this.setGroupScale();
        this.setColourScale();
    }

    private setLabels(): void {
        this.title.text(this.data.title);
        this.yLabel.text(this.data.yLabel);
    }

    private setAxis(): void {
        this.setXAxis();
        this.setYAxis();
    }

    private setLegend(): void {

    }

    private draw(): void {

    }

    private getTranslations(container: string): any {
        switch (container) {
            case 'x-axis-container': return {
                x: this.dimensions.marginLeft,
                y: this.dimensions.marginBottom + 1,
            };
            case 'y-axis-container': return {
                x: this.dimensions.marginLeft - 2,
                y: this.dimensions.marginTop,
            };
            case 'data-container': return {
                x: this.dimensions.marginLeft,
                y: this.dimensions.marginTop,
            };
            case 'legend-container': return {
                x: this.dimensions.marginLeft,
                y: this.dimensions.marginBottom + 30,
            };
            case 'title': return {
                x: this.dimensions.midWidth,
                y: this.dimensions.midMarginTop,
            };
            case 'y-label': return {
                x: this.dimensions.marginLeft - 30,
                y: this.dimensions.midHeight,
            };
        }
    }

    private setXScale(): void {
        const domain = Array.from(new Set(this.data.data.map((d) => d.domain))).sort(d3.ascending);
        const range = [0, this.dimensions.innerWidth];
        this.scales.x = d3.scaleBand().domain(domain).range(range).paddingInner(0.2);
    }

    private setYScale(): void {
        const minVal = Math.min(0, d3.min(this.data.data, d => d.value));
        const maxVal = d3.max(d3.flatRollup(this.data.data, v => d3.sum(v, d => d.value), d => d.domain, d => d.group), d => d[2]);
        const domain = [minVal, maxVal];
        const range = [this.dimensions.innerHeight, 0];
        this.scales.y = d3.scaleLinear().domain(domain).range(range);
    }

    private setGroupScale(): void {
        const domain = Array.from(new Set(this.data.data.map((d) => d.group))).sort(d3.ascending);
        const range = [0, this.scales.x.bandwidth()];
        this.scales.group = d3.scaleBand().domain(domain).range(range).paddingInner(0.15);
    }

    private setColourScale(): void {
        const stacks = Array.from(new Set(this.data.data.map((d) => d.stack)));
        const domain = [stacks.length - 1, 0];
        this.scales.colour = d3.scaleSequential(d3.interpolateSpectral).domain(domain);
    }

    private setXAxis(): void {
        this.xAxis = d3.axisBottom(this.scales.x).tickSizeOuter(0);
        this.xAxisContainer.call(this.xAxis);
    }

    private setYAxis(): void {
        this.yAxis = d3.axisLeft(this.scales.y)
            .ticks(5)
            .tickSizeOuter(0)
            .tickSizeInner(-this.dimensions.innerWidth);

        this.yAxisContainer.call(this.yAxis);

        this.yAxisContainer
            .selectAll('.tick line')
            .style('opacity', 0.3)
            .style('stroke-dasharray', '3 3');
    }

    // Tooltip methods...

    // Highlight methods...
}
