import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ChartDimensions } from 'src/app/helpers/chart.dimensions.helper';
import ObjectHelper from 'src/app/helpers/object.helper';
import { IGroupStackConfig } from 'src/app/interfaces/chart.interfaces';

@Component({
    selector: 'app-chart7',
    templateUrl: './chart7.component.html',
})
export class Chart7Component implements OnInit, OnChanges {
    @Input() public data: any;
    @Input() public set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IGroupStackConfig>(this._defaultConfig, values);
    };

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public legendContainer: any;
    public title: any;

    // Functions

    // Scales
    public colours: any;

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

    get config() {
        if (!this._config) {
            this.config = this._defaultConfig;
        }

        return this._config;
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
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
        if (this.data) {
            this.setParams();
            this.setLabels();
            this.setAxis();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        this.dimensions = new ChartDimensions(this.svg.node().getBoundingClientRect(), this.config.margins);
    }

    private setElements(): void {

    }

    private setParams(): void {

    }

    private setLabels(): void {

    }

    private setAxis(): void {

    }

    private setLegend(): void {

    }

    private draw(): void {

    }

    // Tooltip methods...

    // Highlight methods...
}
