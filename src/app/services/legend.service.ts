import { EventEmitter, Injectable } from '@angular/core';
import { Selection } from 'd3-selection';
import { LegendConfig } from '../interfaces/legend.interfaces';
import ObjectHelper from '../helpers/object.helper';
import * as d3 from 'd3';

export enum LegendActionTypes {
    LegendItemHighlighted = '[Legend service] item highlighted',
    LegendItemClicked = '[Legend service] item clicked',
    LegendItemReset = '[Legend service] item reset',
}

export class LegendItemHighlighted {
    readonly type = LegendActionTypes.LegendItemHighlighted;
    constructor(public payload: { item: any }) { }
}

export class LegendItemClicked {
    readonly type = LegendActionTypes.LegendItemClicked;
    constructor(public payload: { item: any }) { }
}

export class LegendItemReset {
    readonly type = LegendActionTypes.LegendItemReset;
    constructor(public payload: { item: any }) { }
}

export type LegendActions = LegendItemHighlighted | LegendItemClicked | LegendItemReset;

@Injectable()
export abstract class LegendService<D, C extends LegendConfig> {
    public host: Selection<SVGGElement, any, any, any> = {} as any;
    public onLegendAction = new EventEmitter<any>();
    public hiddenIds = new Set();

    private _data: D = undefined as any;
    private _config: C = undefined as any;

    protected abstract defaultData: D;
    protected abstract defaultConfig: C;

    public set data(data: D) {
        this._data = data;
        this.onUpdateData();
    }

    public get data() {
        return this._data || this.defaultData;
    }

    public set config(config: C) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues(this.defaultConfig, config);
        this.onUpdateConfig();
    }

    public get config() {
        return this._config || this.defaultConfig;
    }

    public abstract onUpdateData: () => void;
    public abstract onUpdateConfig: () => void;
    public abstract generateItem: (selection: any) => void;
    public abstract updateItem: (selection: any) => void;
    public abstract updateItemStyles: () => void;
    public abstract getItems: () => any;
    public abstract onMouseEnter: (event: MouseEvent, data: any) => void;
    public abstract onMouseLeave: (event: MouseEvent, data: any) => void;
    public abstract onMouseClick: (event: MouseEvent, data: any) => void;

    public setItems = (): void => {
        const data: any = this.getItems();
        this.host
            .selectAll('g.legend-item')
            .data(data)
            .join(
                (enter: any) => enter.append('g').call(this.generateItem),
                (update: any) => update.call(this.updateItem),
            )
            .attr('class', 'legend-item')
            .style('cursor', this.config.item.cursor)
            .on('mouseenter', (event: MouseEvent, data: any) => this.onMouseEnter(event, data))
            .on('mouseleave', (event: MouseEvent, data: any) => this.onMouseLeave(event, data))
            .on('click'     , (event: MouseEvent, data: any) => this.onMouseClick(event, data));
    }

    public repositionItems = (): void => {
        let padding: number = 0;
        const separator: number = this.config.item.separator;

        this.host
            .selectAll('g.legend-item')
            .each((d: any, i: number, items: any) => {
                const g = d3.select(items[i]);
                g.attr('transform', `translate(${padding}, 0)`);
                const dims = g.node()?.getBoundingClientRect() || new DOMRect();
                padding += dims.width + separator;
            });
    }

    public generate = (): void => {
        this.setItems();
        this.repositionItems();
    }

    public toggleItem = (id: any): void => {
        this.hiddenIds.has(id) ? this.hiddenIds.delete(id) : this.hiddenIds.add(id);
    }
}
