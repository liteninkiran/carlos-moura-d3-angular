import { Component, ElementRef } from '@angular/core';
import { DimensionService } from 'src/app/services/dimension.service';
import { ISwarmData, ISwarmDataElement } from 'src/app/interfaces/chart.interfaces';
import { Chart } from '../charts';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart9',
    template: `
    <svg class="swarm-chart">
        <style>
            .swarm-chart .label {

            }

            .swarm-chart .title {

            }

            .swarm-chart .yLabel {

            }
        </style>
    </svg>
    `,
    providers: [DimensionService],
})
export class Chart9Component extends Chart<ISwarmData, any> {

    public groups: Array<string | number> = [];

    protected _defaultConfig: any = {
        margins: {
            top: 30,
            left: 50,
            right: 50,
            bottom: 20,
        },
    };

    constructor(
        element: ElementRef,
        dimensions: DimensionService,
    ) {
        super(element, dimensions);
        console.log(this);
    }

    public setElements = (): void => {
        this.svg.append('g').attr('class', 'title')
            .append('text')
            .attr('class', 'title label');
        this.svg.append('g').attr('class', 'yAxis');
        this.svg.append('g').attr('class', 'xAxis');
        this.svg.append('g').attr('class', 'yLabel')
            .append('text')
            .attr('class', 'yLabel label')
            .attr('transform', 'rotate(-90)');
        this.svg.append('g').attr('class', 'data');
    }

    public positionElements = (): void => {
        this.svg.select('g.title').attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
        this.svg.select('g.yAxis').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
        this.svg.select('g.xAxis').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginBottom})`);
        this.svg.select('g.yLabel').attr('transform', `translate(${12 + 5}, ${this.dimensions.midHeight})`);
        this.svg.select('g.data').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
        this.svg.select('g.voronoi').attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
    }

    public setParams = (): void => {
        this.setGroups();
        this.setScales();
        this.setScaledData();
        this.setSimulatedData();
        this.setAxis();
    }

    public setLabels = (): void => {
    }

    public setLegend = (): void => {
    }

    public draw = (): void => {
    }

    public onSetData = (): void => {
        if (!this.chartIsInitialized || !this.dataIsInitialized) { return; }
        this.updateChart();
    }

    public onSetConfig = (): void => {
    }

    private setGroups = (): void => {
        this.groups = d3.groups(this.data.data, (d: ISwarmDataElement) => d.group)
            .map((d: any) => d[0])
            .sort(d3.ascending);
    }

    private setScales = (): void => {
        this.setXScale();
        this.setYScale();
        this.setColourScale();
    }

    private setXScale = (): void => {
        const domain = d3.groups(this.data.data, (d: ISwarmDataElement) => d.category)
            .map((d: any) => d[0])
            .sort(d3.ascending);

        const range = [0, this.dimensions.innerWidth];

        this.scales['x'] = d3.scalePoint()
            .domain(domain)
            .range(range)
            .padding(0.5);
    }

    private setYScale = (): void => {
        let [min, max] = d3.extent(this.data.data, (d: ISwarmDataElement) => d.value);
        min = Math.min(min || 0, 0);
        const domain = [min === undefined ? 0 : min, max === undefined ? 1 : max];
        const range = [this.dimensions.innerHeight, 0];
        this.scales['y'] = d3.scaleLinear().domain(domain).range(range);
    }

    private setColourScale = (): void => {
        const domain = this.groups;
        const range = d3.schemeTableau10;
        this.scales.colours = d3.scaleOrdinal<string | number, string>()
            .domain(domain)
            .range(range);
    }

    private setScaledData = (): void => {
    }

    private setSimulatedData = (): void => {
    }

    private setAxis = (): void => {
    }
}