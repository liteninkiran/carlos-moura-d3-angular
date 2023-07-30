import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-chart1',
    templateUrl: './chart1.component.html',
    styleUrls: ['./chart1.component.scss'],
})
export class Chart1Component implements OnInit {

    public data = [125, 100, 50, 75, 200, 60];
    public width = 50;

    constructor(private elementRef: ElementRef) {

    }

    public ngOnInit(): void {
        const svg = this.elementRef.nativeElement.getElementsByTagName('svg')[0];
        const dimensions = svg.getBoundingClientRect();
        this.width = dimensions.width / this.data.length;
    }

}
