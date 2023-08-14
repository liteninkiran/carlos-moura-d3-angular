import { Injectable } from '@angular/core';
import { LegendService } from './legend.service';
import { ListLegendData, ListLegendItem } from '../interfaces/legend.interfaces';

@Injectable()
export class ListLegendService extends LegendService<ListLegendData, any> {

    protected override defaultData: ListLegendData = {
        items: [],
    };
    protected override defaultConfig: any = { };

    public onUpdateData = (): void => {
        this.generate();
    }

    public onUpdateConfig = (): void => {

    }

    public generateItem = (selection: any): void => {
        selection
            .append('circle')
            .attr('class', 'legend-icon')
            .attr('cx', 3)
            .attr('cy', 3)
            .attr('r', 3)
            .style('fill', (d: any) => d.colour);

        selection
            .append('text')
            .attr('class', 'legend-label')
            .attr('x', 3 + 5)
            .attr('y', 3)
            .style('font-size', 12 + 'px')
            .style('dominant-baseline', 'middle')
            .text((d: any) => d.label);
    }

    public updateItem = (selection: any): void => {
        selection.selectAll('circle.lengend-icon').style('fill', (d: any) => d.colour);
        selection.select('text.legend-label').text((d: any) => d.label);
    }

    public getItems = (): Array<ListLegendItem> => {
        return this.data.items;
    }

    public onMouseEnter = (event: MouseEvent, d: any): void => {
        
    }

    public onMouseLeave = (event: MouseEvent, d: any): void => {
        
    }

    public onMouseClick = (event: MouseEvent, d: any): void => {
        
    }
}
