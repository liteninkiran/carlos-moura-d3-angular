import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-chart1',
    templateUrl: './chart1.component.html',
    styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit, OnChanges {

    @Input() public data: Array<number> = [];

    public xLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    public rectWidth: number = 80;
    public max: number = 250;
    public dimensions: DOMRect = new DOMRect();
    public outerPadding: number = 20;
    public padding: number = 0;
    public bandwidth: number = 0;
    public bandwidthCoef = 0.8;
    public left = 10;
    public right = 20;
    public bottom = 16;
    public top = 15;
    public innerWidth: number = 300;
    public innerHeight: number = 150;

    constructor(private elementRef: ElementRef) {

    }

    public ngOnInit(): void {
        const svg = this.elementRef.nativeElement.getElementsByTagName('svg')[0];
        this.dimensions = svg.getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.left - this.right;
        this.innerHeight = this.dimensions.height - this.top - this.bottom;
        this.setParams();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.setParams();
    }

    public setParams(): void {
        this.rectWidth = (this.innerWidth - 2 * this.outerPadding) / this.data.length;
        this.max = Math.max(...this.data) * 1.2;
        this.bandwidth = this.bandwidthCoef * this.rectWidth;
        this.padding = (1 - this.bandwidthCoef) * this.rectWidth;
    }
}
