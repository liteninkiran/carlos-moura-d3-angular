import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

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
        left: 50,
        top: 40,
        right: 20,
        bottom: 80,
    };

    // Config
    public config: any;

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
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

        }
    }

}
