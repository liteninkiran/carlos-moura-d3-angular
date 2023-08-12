import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { ITimelineConfig, ITimelineData } from 'src/app/interfaces/chart.interfaces';
import { DimensionService } from 'src/app/services/dimension.service';

@Component({
    selector: 'app-timeline-tooltip',
    template: `
    <svg class="timeline-tooltip">
        <style>
            .timeline-tooltip {
                background-color: red;
                box-shadow: rgba(158, 158, 158, 0.16) 1px 1px 8px 0px;
            }

        </style>
        <g class="title">
            <text class="title"></text>
        </g>
        <g class="container">
            <line class="axis axis--x"></line>
            <line class="axis axis--max"></line>
            <text class="label max-value"></text>
            <path class="area"></path>
            <path class="line"></path>
        </g>
        <g class="active-container">
            <line class="active active-horizontal"></line>
            <line class="active active-vertical"></line>
            <circle class="active-circle"></circle>
            <text class="label active-value"></text>
            <text class="label active-date"></text>
        </g>
    </svg>
    `,
    providers: [DimensionService],
})
export class TimelineTooltipComponent implements OnInit {

    @Input() set data(values: any) {
        this._data = values;
        this.updateChart();
    };

    public host: any;
    public svg: any;
    public config: ITimelineConfig = {
        margins: {
            left: 25,
            right: 20,
            top: 25,
            bottom: 20,
        },
        dimensions: {
            width: 270,
            height: 150,
        },
        title: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        background: {
            color: '#fff',
        },
        labels: {
            fontSize: 9,
        },
    };
    public maxValue: number;
    public activeValue: number;
    public scales: any = {};
    public line: any;
    public area: any;

    private _data: ITimelineData;

    get data(): ITimelineData {
        return this._data || { title: '', activeTime: null, data: [], timeFormat: '' };
    }

    constructor(
        element: ElementRef,
        public dimensions: DimensionService,
    ) {
        this.host = d3.select(element.nativeElement);
        //console.log(this);
    }

    public ngOnInit(): void {
        this.setSvg();
        this.setDimensions();
        this.updateChart();
    }

    private setSvg(): void {
        this.svg = this.host
            .select('svg')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .style('width', this.config.dimensions.width + 'px')
            .style('height', this.config.dimensions.height + 'px');
    }

    private setDimensions(): void {
        this.dimensions.setDimensions(this.svg.node().getBoundingClientRect());
        this.dimensions.setMargins(this.config.margins);
    }

    private updateChart(): void {
        if (this.svg) {
            this.setParams();
            this.setLabels();
            this.setLines();
            this.setActiveData();
        }
    }

    private positionElements(): void {
        const title = this.getTranslations('title');
        const titleContainer = this.getTranslations('title-container');
        this.svg
            .select('g.title')
            .attr('transform', title);

        this.svg
            .selectAll('g.container, g.active-container')
            .attr('transform', titleContainer);
    }

    private getTranslations(container: string, options: any = {}): string {
        switch (container) {
            case 'title':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.midMarginTop}
                )`;
            case 'title-container':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.marginTop}
                )`;
        }
    }

    private setParams(): void {
        this.calculateMaxValue();
        this.getActiveValue();
        this.setScales();
    }

    private setScales(): void {
        const xDomain = d3.extent(this.data.data, (d) => d.date);
        this.scales.x = d3.scaleLinear()
            .domain(xDomain)
            .range([0, this.dimensions.innerWidth]);

        const yDomain = [0, this.maxValue];
        this.scales.y = d3.scaleLinear()
            .domain(yDomain)
            .range([this.dimensions.innerHeight, 0]);
    }

    private calculateMaxValue(): void {
        const maxIndex = d3.maxIndex(this.data.data, (d) => d.value);
        this.maxValue = maxIndex > 0 ? this.data.data[maxIndex].value : 0;
    }

    private getActiveValue(): void {
        this.activeValue = this.data.data.find((d) => d.date === this.data.activeTime)?.value || null;
    }

    private setLabels(): void {

    }

    private setLines(): void {

    }

    private setActiveData(): void {

    }
}
