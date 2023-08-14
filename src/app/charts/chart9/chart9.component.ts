import { ISimulatedSwarmDataElement, ISwarmData, ISwarmDataElement } from 'src/app/interfaces/chart.interfaces';
import { Component, ElementRef } from '@angular/core';
import { ListLegendService } from 'src/app/services/list-legend.service';
import { DimensionService } from 'src/app/services/dimension.service';
import { Chart } from '../charts';
import * as d3 from 'd3';
import { LegendActionTypes, LegendActions } from 'src/app/services/legend.service';

@Component({
    selector: 'app-chart9',
    template: `
    <svg class="swarm-chart">
        <style>
            .swarm-chart .label {
                text-anchor: middle;
                dominant-baseline: central;
            }

            .swarm-chart .title {
                font-weight: bold;
                font-size: 12px;
            }

            .swarm-chart .yLabel {
                font-size: 12px;
            }
        </style>
    </svg>
    `,
    providers: [DimensionService, ListLegendService],
})
export class Chart9Component extends Chart<ISwarmData, any> {

    public groups: Array<string | number> = [];
    public scaledData: ISimulatedSwarmDataElement[] = [];

    protected _defaultConfig: any = {
        margins: {
            top: 30,
            left: 50,
            right: 50,
            bottom: 50,
        },
    };

    constructor(
        element: ElementRef,
        dimensions: DimensionService,
        protected legend: ListLegendService,
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
        this.legend.host = this.svg.append('g').attr('class', 'legend');
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
        this.svg.select('text.title').text(this.data.title);
        this.svg.select('text.yLabel').text(this.data.unit);
    }

    public setLegend = (): void => {
        const items = this.groups.map((d: string | number) => ({
            colour: this.scales.colours(d),
            id: d,
            label: d + '',
        }));
        this.legend.data = {
            items,
        };

        const transform: string = this.getTranslations('legend');
        this.svg
            .select('g.legend')
            .attr('transform', transform);
    }

    public draw = (): void => {
        this.drawCircles();
        this.drawVoronoi();
    }

    public onSetData = (): void => {
        if (!this.chartIsInitialized || !this.dataIsInitialized) { return; }
        this.updateChart();
    }

    public onSetConfig = (): void => {
    }

    public override setSubscriptions(): void {
        super.setSubscriptions();
        const sub = this.legend.onLegendAction.subscribe(this.onLegendAction);
        this.subscribe(sub);
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
        this.scaledData = this.data.data.map((d: ISwarmDataElement) => ({
            ...d,
            cx: this.scales.x(d.category),
            cy: this.scales.y(d.value),
            index: 0,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
        }));
    }

    private setSimulatedData = (): void => {
        const data = this.scaledData;
        const simulation = d3.forceSimulation<ISimulatedSwarmDataElement>(data)
            .force('x', d3.forceX((d: any) => d.cx).strength(0.8))
            .force('y', d3.forceY((d: any) => d.cy).strength(1))
            .force('collide', d3.forceCollide().radius(2))
            .stop();
        simulation.tick(50);

/*
        // Simulate data
        let i = 0;
        const interval = setInterval(() => {
            if (i > 50) {
                clearInterval(interval)
            }
            i++;
            simulation.tick();
            this.runSimulation();
        }, 500);
*/
    }

    private setAxis = (): void => {
        const xAxis: d3.Axis<d3.AxisDomain> = d3
            .axisBottom(this.scales.x)
            .tickSizeOuter(0);

        this.svg
            .select<SVGGElement>('g.xAxis')
            .call(xAxis);

        const yAxis: d3.Axis<d3.AxisDomain> = d3
            .axisLeft(this.scales.y)
            .tickSizeOuter(0)
            .tickSizeInner(-this.dimensions.innerWidth);

        this.svg
            .select<SVGGElement>('g.yAxis')
            .call(yAxis);

        this.svg
            .select('g.yAxis')
            .selectAll('.tick line')
            .style('stroke', '#ddd')
            .style('stroke-dasharray', '2 2');
    }

    private drawCircles = (): void => {
        const data = this.scaledData;

        this.svg.select('g.data').selectAll<SVGCircleElement, ISimulatedSwarmDataElement>('circle.data')
            .data(data)
            .join('circle')
            .attr('class', 'data')
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y)
            .attr('r', 2)
            .style('fill', (d: any) => this.scales.colours(d.group));
    }

    private drawVoronoi = (): void => {
    }

    private runSimulation = () => {
        const data = this.scaledData;
        this.svg.select('g.data').selectAll('circle.data')
            .data(data)
            .join('circle')
            .attr('class', 'data')
            .attr('r', 2)
            .style('fill', (d: any) => this.scales.colours(d.group))
            .transition()
            .attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y);
    }

    private getTranslations(container: string): string {
        switch (container) {
            case 'legend':
                const dims = this.legend.host.node()?.getBoundingClientRect() || new DOMRect();
                return `translate(
                    ${this.dimensions.midWidth - 0.5 * dims.width},
                    ${this.dimensions.bottom - dims.height - 5}
                )`;
        }
        return '';
    }

    private onLegendAction = (action: LegendActions) => {
        switch (action.type) {
            case LegendActionTypes.LegendItemHighlighted: this.highlightGroup(action.payload.item); break;
            case LegendActionTypes.LegendItemClicked: break;
            default: this.drawVoronoi(); this.resetHighlights(); break;
        }
    }

    private highlightGroup = (id: string | number) => {
        this.svg
            .select('g.data')
            .selectAll<SVGCircleElement, ISimulatedSwarmDataElement>('circle.data')
            .style('opacity', (d: ISimulatedSwarmDataElement) => d.group === id ? null : 0.3);
    }

    private resetHighlights = () => {
        this.svg
            .select('g.data')
            .selectAll<SVGCircleElement, ISimulatedSwarmDataElement>('circle.data')
            .style('opacity', null);
    }
}
