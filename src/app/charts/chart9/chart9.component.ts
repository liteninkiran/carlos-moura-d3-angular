import { Component, ElementRef, OnInit } from '@angular/core';
import { DimensionService } from 'src/app/services/dimension.service';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart9',
    template: `
    <p>
        chart9 works!
    </p>
    `,
    styles: [],
    providers: [DimensionService],
})
export class Chart9Component implements OnInit {

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any> = d3.selection();

    constructor(
        element: ElementRef,
        public dimensions: DimensionService,
    ) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {

    }

}
