import { Component, OnInit, OnChanges, ElementRef, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { IMapConfig, IMapData, IMapContainer } from 'src/app/interfaces/chart.interfaces';
import { DimensionService } from 'src/app/services/dimension.service';
import ObjectHelper from 'src/app/helpers/object.helper';
import * as topojson from 'topojson';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart8',
    template: `
        <svg class="chart8"></svg>
        <style>

        </style>
    `,
    providers: [DimensionService],
})
export class Chart8Component implements OnInit, OnChanges {

    @Input() set geodata(values) {
        this._geodata = values;
        this.updateChart();
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

    public containers: IMapContainer = {
        countries: undefined,
        data: undefined,
        titleContainer: undefined,
        legend: undefined,
    };
    public title: any;
    public projection: any;
    public path: any;
    public features: any;

    private _geodata: any;
    private _data: IMapData;
    private _config: IMapConfig;
    private _defaultConfig: IMapConfig = {
        margins: {
            top: 40,
            left: 20,
            right: 20,
            bottom: 40,
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
        if (this.geodata && this.svg) {
            this.repositionElements();
            this.setParams();
            this.setLabels();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        const dimensions: DOMRect = this.svg.node().getBoundingClientRect();
        this.dimensions.setDimensions(dimensions);
        this.dimensions.setMargins(this.config.margins);
    }

    private setElements(): void {
        this.containers.countries = this.svg.append('g').attr('class', 'countries');
        this.containers.countries.append('path').attr('class', 'countries');
        this.containers.data = this.svg.append('g').attr('class', 'data');
        this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
        this.title = this.containers.titleContainer.append('text').attr('class', 'title');
        this.containers.legend = this.svg.append('g').attr('class', 'legend');
    }

    private repositionElements(): void {
        this.containers.countries.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
        this.containers.data.attr('transform', `translate(${this.dimensions.marginLeft}, ${this.dimensions.marginTop})`);
        this.containers.titleContainer.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginTop})`);
        this.containers.legend.attr('transform', `translate(${this.dimensions.midWidth}, ${this.dimensions.midMarginBottom})`);
    }

    private setParams(): void {
        this.setProjection();
        this.setPath();
        this.setFeatures();
    }

    private setProjection(): void {
        this.projection = d3
            .geoEquirectangular();
            //.geoOrthographic()
            // .scale(80)
            // .translate([this.dimensions.midWidth, this.dimensions.midHeight + 20]);
    }

    private setPath(): void {
        this.path = d3.geoPath(this.projection);
    }

    private setFeatures(): void {
        this.features = topojson.feature(this.geodata, this.geodata.objects['CNTR_RG_60M_2020_4326']);
    }

    private setLabels(): void {

    }

    private setLegend(): void {

    }

    private draw(): void {
        this.containers.countries
            .select('path')
            .datum(this.features)
            .attr('d', this.path);
    }

    private setScale(scale: number): void {
        this.projection.scale(scale);
        this.setPath();
        this.draw();
    }

    private setTranslate(x: number, y: number): void {
        this.projection.translate([x, y]);
        this.setPath();
        this.draw();
    }

    private setCentre(x: number, y: number): void {
        this.projection.center([x, y]);
        this.setPath();
        this.draw();
    }

    private setRotate(x: number, y: number, z: number): void {
        this.projection.rotate([x, y, z]);
        this.setPath();
        this.draw();
    }

    private setExtent(width: number, height: number): void {
        this.projection.fitSize([width, height], this.features);
        this.setPath();
        this.draw();
    }

    private setWidth(width: number): void {
        this.projection.fitWidth(width, this.features);
        this.setPath();
        this.draw();
    }

    private setHeight(height: number): void {
        this.projection.fitHeight(height, this.features);
        this.setPath();
        this.draw();
    }
}
