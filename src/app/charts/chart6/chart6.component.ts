import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { IPieConfig } from 'src/app/interfaces/chart.interfaces';

@Component({
    selector: 'app-chart6',
    templateUrl: './chart6.component.html',
    styleUrls: ['./chart6.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart6Component implements OnInit, OnChanges {
    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public legendContainer: any;
    public title: any;

    // Functions
    public pie: any;
    public arc: any;

    // Scales
    public colours: any;

    // State
    public hiddenIds = new Map();

    // Dimensions
    public dimensions: DOMRect;
    public innerWidth: number;
    public innerHeight: number;
    public radius: number;
    public innerRadius = 0;
    public margins = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    };

    // Config
    public config: IPieConfig = {
        innerRadiusCoef: 0.7,
        hiddenOpacity: 0.3,
        legendItem: {
            symbolSize: 10,
            height: 20,
            fontSize: 12,
            textSeparator: 15,
        },
        transition: 800,
        arcs: {
            stroke: '#fff',
            strokeWidth: 2,
            radius: 6,
            padAngle: 0,
        },
        margins: {
            left: 10,
            top: 40,
            right: 130,
            bottom: 10,
        }
    };

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
        console.log(this);
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
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
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

    private highlight(): void {
    }

}
