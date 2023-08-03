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

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {

    }

    public ngOnChanges(changes: SimpleChanges): void {

    }
}
