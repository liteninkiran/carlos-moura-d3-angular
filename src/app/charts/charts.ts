import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, fromEvent, Subscription, map } from 'rxjs';
import { DimensionService } from '../services/dimension.service';
import { ObjectHelper } from '../helpers/object.helper';
import { IBaseConfig } from '../interfaces/chart.interfaces';
import { Selection } from 'd3-selection';
import * as d3 from 'd3';

@Directive()
export abstract class Chart<D, C extends IBaseConfig> implements OnInit, OnDestroy {

    constructor(
        element: ElementRef,
        protected dimensions: DimensionService
    ) {
        this.host = d3.select(element.nativeElement);
    }

    // Properties
    @Input()
    public set data(data) {
        this._data = data;
        this.dataIsInitialized = true;
        this.onSetData();
    }

    @Input()
    public set config(config) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues(this._defaultConfig, config);
        this.onSetConfig();
    }

    @Output()
    public events = new EventEmitter<any>();

    public chartIsInitialized: boolean = false;
    public dataIsInitialized: boolean = false;
    public scales: any = {};

    public get data() {
        return this._data;
    }

    public get config() {
        return this._config || this._defaultConfig;
    }

    protected host: Selection<any, any, any, any> = null as any;
    protected svg: Selection<SVGSVGElement, any, any, any> = null as any;
    protected abstract _defaultConfig: C;

    private subscriptions: Subscription[] = [];
    private _data: D = null as any;
    private _config: C = null as any;

    // Methods
    public ngOnInit(): void {
        this.setSubscriptions();
        this.setSvg();
        this.setElements();
        this.chartIsInitialized = true;
        this.updateChart();
    }

    public ngOnDestroy(): void {
        this.unsubscribeAll();
    }

    public updateChart() {
        this.setDimensions();
        this.positionElements();
        this.setParams();
        this.setLabels();
        this.setLegend();
        this.draw();
    }

    public abstract setElements: () => void;
    public abstract positionElements: () => void;
    public abstract setParams: () => void;
    public abstract setLabels: () => void;
    public abstract setLegend: () => void;
    public abstract draw: () => void;
    public abstract onSetData: () => void;
    public abstract onSetConfig: () => void;

    private setSvg(): void {
        this.svg = this.host.select<SVGSVGElement>('svg')
            .attr('version', '1.1')
            .attr('baseProfile', 'full')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            .attr('xmlns:ev', 'http://www.w3.org/2001/xml-events');
    }

    private setDimensions(): void {
        const dimensions = this.svg?.node()?.getBoundingClientRect() || new DOMRect(300, 150);
        this.dimensions.setDimensions(dimensions);
        this.dimensions.setMargins(this.config.margins);
        this.svg.attr('viewbox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    // Subscriptions
    private subscribe(sub: Subscription): void {
        this.subscriptions.push(sub);
    }

    private unsubscribeAll(): void {
        this.subscriptions.map((sub: Subscription) => sub.unsubscribe());
    }

    private setSubscriptions(): void {
        this.setResize();
    }

    private setResize(): void {
        const resize$ = fromEvent(window, 'resize');
        const subs = resize$
            .pipe(
                map((event: any) => event),
                debounceTime(500)
            )
            .subscribe(() => this.updateChart());
        this.subscribe(subs);
    }
}
