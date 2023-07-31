import { Component, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart3',
    templateUrl: './chart3.component.html',
    styleUrls: ['./chart3.component.scss'],
})
export class Chart3Component {

    public host: any;

    constructor(elementRef: ElementRef) {
        this.host = d3.select(elementRef.nativeElement);
        console.log(this);
    }
}
