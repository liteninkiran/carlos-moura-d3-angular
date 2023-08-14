import { Injectable } from '@angular/core';
import { LegendItemClicked, LegendItemHighlighted, LegendItemReset, LegendService } from './legend.service';
import { ListLegendConfig, ListLegendData, ListLegendItem } from '../interfaces/legend.interfaces';

@Injectable()
export class ListLegendService extends LegendService<ListLegendData, ListLegendConfig> {

    protected override defaultData: ListLegendData = {
        items: [

        ],
    };
    protected override defaultConfig: ListLegendConfig = {
        item: {
            separator: 10,
            cursor: 'pointer',
            opacity: 0.1,
        },
        circle: {
            radius: 5,
        },
        text: {
            separator: 5,
            font_size: 12,
        },
        highlighted: {
            font_weight: 'bold',
        },
    };

    public onUpdateData = (): void => {
        this.generate();
    }

    public onUpdateConfig = (): void => {

    }

    public generateItem = (selection: any): void => {
        selection
            .append('circle')
            .attr('class', 'legend-icon')
            .attr('cx', this.config.circle.radius)
            .attr('cy', this.config.circle.radius)
            .attr('r', this.config.circle.radius)
            .style('fill', (d: any) => d.colour);

        selection
            .append('text')
            .attr('class', 'legend-label')
            .attr('x', 2 * this.config.circle.radius + this.config.text.separator)
            .attr('y', this.config.circle.radius)
            .style('font-size', this.config.text.font_size + 'px')
            .style('dominant-baseline', 'middle')
            .text((d: any) => d.label);
    }

    public updateItem = (selection: any): void => {
        selection.selectAll('circle.lengend-icon').style('fill', (d: any) => d.colour);
        selection.select('text.legend-label').text((d: any) => d.label);
    }

    public updateItemStyles = (): void => {
        this.host
            .selectAll<SVGSVGElement, ListLegendItem>('g.legend-item')
            .style('opacity', (d: ListLegendItem) => this.hiddenIds.has(d.id) ? this.config.item.opacity : null);
    }

    public getItems = (): Array<ListLegendItem> => {
        return this.data.items;
    }

    public onMouseEnter = (event: MouseEvent, data: any): void => {
        this.host
            .selectAll<SVGSVGElement, ListLegendItem>('g.legend-item')
            .style('font-weight', (d: ListLegendItem) => d.id === data.id ? this.config.highlighted.font_weight : '');
        const action = new LegendItemHighlighted({ item: data.id });
        this.onLegendAction.emit(action)
    }

    public onMouseLeave = (event: MouseEvent, data: any): void => {
        this.host
            .selectAll<SVGSVGElement, ListLegendItem>('g.legend-item')
            .style('font-weight', null);
        const action = new LegendItemReset({ item: data.id });
        this.onLegendAction.emit(action);
    }

    public onMouseClick = (event: MouseEvent, data: any): void => {
        this.naturalClick(data.id);
        this.updateItemStyles();
        const action = new LegendItemClicked({ item: data.id });
        this.onLegendAction.emit(action);
    }

    private hideAllOthers = (id: any): void => {
        const ids = this.data.items.filter((item: any) => item.id !== id)
            .map((item: any) => item.id);

        this.hiddenIds = new Set(ids);
    }

    private reverseHidden = (): void => {
        this.data.items.map((item: any) => this.toggleItem(item.id));
    }

    private hiddenIsEmpty = (): boolean => {
        return this.hiddenIds.size === 0;
    }

    private allOthersHidden = (id: any): boolean => {
        return !this.hiddenIds.has(id) && this.hiddenIds.size === this.data.items.length - 1;
    }

    private naturalClick = (id: any): void => {
        if (this.hiddenIsEmpty()) {
            this.hideAllOthers(id);
        } else {
            if (this.allOthersHidden(id)) {
                this.reverseHidden();
            } else {
                this.toggleItem(id);
            }
        }
    }
}
