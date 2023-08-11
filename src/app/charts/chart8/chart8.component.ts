import { Component, OnInit, OnChanges, ElementRef, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart8',
    template: `
        <p>Chart 8</p>
        <svg class="chart8"></svg>
        <style>

        </style>
    `,
})
export class Chart8Component implements OnInit, OnChanges {

    @Input() set geodata(values) {
        this._geodata = values;
    };
    @Input() set data(values) {
        this._data = values;
    };
    @Input() set config(values) {
        this._config = values;
    };

    @Output() tooltip = new EventEmitter<any>();

    get geodata() {
        return this._geodata;
    }

    get data() {
        return this._data;
    }

    get config() {
        return this._config;
    }

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any>;

    private _geodata: any;
    private _data: any;
    private _config: any;

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
        //console.log(this);
    }

    public ngOnInit(): void {
        this.setSvg();
    }

    public ngOnChanges(changes: SimpleChanges): void {

    }

    private setSvg(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    }
}
