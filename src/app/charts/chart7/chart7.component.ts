import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart7',
    templateUrl: './chart7.component.html',
})
export class Chart7Component implements OnInit, OnChanges {
    @Input() public data: any;
    @Input() public config: any;

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
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
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
