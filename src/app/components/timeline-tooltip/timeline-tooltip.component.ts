import { Component, ElementRef, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { DimensionService } from 'src/app/services/dimension.service';

@Component({
    selector: 'app-timeline-tooltip',
    template: `
    <svg class="timeline-tooltip">
        <style>

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
    };

    public host: any;
    public svg: any;
    public config = {
        margins: {
            left: 25,
            right: 20,
            top: 25,
            bottom: 20,
        },
    };

    private _data: any;

    get data() {
        return this._data;
    }

    constructor(
        element: ElementRef,
        public dimensions: DimensionService,
    ) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.setSvg();
        this.setDimensions();
    }

    private setSvg(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    }

    private setDimensions(): void {
        this.dimensions.setDimensions(this.svg.node().getBoundingClientRect());
        this.dimensions.setMargins(this.config.margins);
    }

}
