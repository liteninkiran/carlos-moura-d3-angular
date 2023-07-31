import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-chart2',
    templateUrl: './chart2.component.html',
    styleUrls: ['./chart2.component.scss'],
})
export class Chart2Component implements OnInit, OnChanges {

    @Input() public data: Array<number>;

    public xLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    public rectWidth: number = 80;
    public max: number = 250;
    public dimensions: DOMRect;
    public outerPadding: number = 20;
    public padding: number = 0;
    public bandwidth: number = 0;
    public bandwidthCoef = 0.8;
    public left = 10;
    public right = 20;
    public bottom = 16;
    public top = 15;
    public innerWidth: number;
    public innerHeight: number;

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
        const data = this.data || [100];
        this.rectWidth = (this.innerWidth - 2 * this.outerPadding) / data.length;
        this.max = Math.max(...data.map((item: any) => item.employee_salary)) * 1.2;
        this.bandwidth = this.bandwidthCoef * this.rectWidth;
        this.padding = (1 - this.bandwidthCoef) * this.rectWidth;
    }
}
