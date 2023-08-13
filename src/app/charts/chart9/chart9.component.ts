import { Component, ElementRef } from '@angular/core';
import { DimensionService } from 'src/app/services/dimension.service';
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

    protected _defaultConfig: any = {
        margins: {
            top: 30,
            left: 50,
            right: 50,
            bottom: 20,
        },
    };

    constructor(
        element: ElementRef,
        dimensions: DimensionService,
    ) {
        super(element, dimensions);
        console.log(this);
    }

    public setElements = (): void => {
        this.svg.append('g').attr('class', 'title')
            .append('text')
            .attr('class', 'title label');
        this.svg.append('g').attr('class', 'yAxis');
        this.svg.append('g').attr('class', 'xAxis');
        this.svg.append('g').attr('class', 'yLabel')
            .append('text')
            .attr('class', 'yLabel label')
            .attr('transform', 'rotate(-90)');
        this.svg.append('g').attr('class', 'data');
    }

    public positionElements = (): void => {
    }

    public setParams = (): void => {
    }

    public setLabels = (): void => {
    }

    public setLegend = (): void => {
    }

    public draw = (): void => {
    }

    public onSetData = (): void => {
    }

    public onSetConfig = (): void => {
    }

}
