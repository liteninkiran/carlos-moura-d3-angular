import { Component, ElementRef } from '@angular/core';
import { DimensionService } from 'src/app/services/dimension.service';
import * as d3 from 'd3';
import { ISwarmData } from 'src/app/interfaces/chart.interfaces';
import { Chart } from '../charts';

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
export class Chart9Component extends Chart<ISwarmData, any> {

    constructor(
        element: ElementRef,
        dimensions: DimensionService,
    ) {
        super(element, dimensions);
        console.log(this);
    }

}
