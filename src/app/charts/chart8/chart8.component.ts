import { Component, OnInit, OnChanges, ElementRef, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { IMapConfig, IMapData } from 'src/app/interfaces/chart.interfaces';
import { DimensionService } from 'src/app/services/dimension.service';
import ObjectHelper from 'src/app/helpers/object.helper';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart8',
    template: `
        <p>Chart 8</p>
        <svg class="chart8"></svg>
        <style>

        </style>
    `,
    providers: [DimensionService],
})
export class Chart8Component implements OnInit, OnChanges {

    @Input() set geodata(values) {
        this._geodata = values;
    };
    @Input() set data(values) {
        this._data = values;
    };
    @Input() set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IMapConfig>(this._defaultConfig, values);
    };

    @Output() tooltip = new EventEmitter<any>();

    get geodata() {
        return this._geodata;
    }

    get data() {
        return this._data;
    }

    get config() {
        return this._config || this._defaultConfig;
    }

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any>;

    private _geodata: any;
    private _data: IMapData;
    private _config: IMapConfig;
    private _defaultConfig: IMapConfig = {
        margins: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    };

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
        this.setElements();
        this.updateChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.updateChart();
    }

    private setSvg(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    }

    private updateChart(): void {
        this.setParams();
        this.setLabels();
        this.setLegend();
        this.draw();
    }

    private setDimensions(): void {
        const dimensions: DOMRect = this.svg.node().getBoundingClientRect();
        this.dimensions.setDimensions(dimensions);
        this.dimensions.setMargins(this.config.margins);
    }

    private setElements(): void {

    }

    private setParams(): void {

    }

    private setLabels(): void {

    }

    private setLegend(): void {

    }

    private draw(): void {

    }
}
