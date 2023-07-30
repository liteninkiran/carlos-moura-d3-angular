import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-chart1',
    templateUrl: './chart1.component.html',
    styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit {

    public data = [125, 100, 50, 75, 200, 60];
    public rectWidth: number;
    public max: number;
    public dimensions: DOMRect;

    constructor(private elementRef: ElementRef) {

    }

    public ngOnInit(): void {
        const svg = this.elementRef.nativeElement.getElementsByTagName('svg')[0];
        this.dimensions = svg.getBoundingClientRect();
        this.rectWidth = this.dimensions.width / this.data.length;
        this.max = Math.max(...this.data) * 1.2;
    }

}
