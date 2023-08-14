import { Injectable } from '@angular/core';
import { Selection } from 'd3-selection';
import ObjectHelper from '../helpers/object.helper';
import * as d3 from 'd3';

@Injectable()
export abstract class LegendService<D, C> {
    public host: Selection<SVGGElement, any, any, any> = {} as any;

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

    abstract onUpdateData: () => void;
    abstract onUpdateConfig: () => void;
    abstract generateItem: (selection: any) => void;
    abstract updateItem: (selection: any) => void;
    abstract getItems: () => any;

    public setItems = () => {
        const data: any = this.getItems();
        this.host
            .selectAll('g.legend-item')
            .data(data)
            .join(
                (enter: any) => enter.append('g').call(this.generateItem),
                (update: any) => update.call(this.updateItem),
            )
            .attr('class', 'legend-item')
//            .attr('transform', (d: any, i: any) => this.getTranslations('legend-items', { i, width, noDataSeparator }))
            .on('mouseenter', (event: MouseEvent, data: any) => {
                // // Highlight legend items
                // this.highlightLegendItems(data);
                // // Highlight features
                // this.highlightFeatures(data);
            })
            .on('mouseleave', () => {
                // // Reset legend items
                // this.resetLegendItems();
                // // Reset features
                // this.resetFeatures();
            });
    }

    public repositionItems = () => {
        let padding = 0;
        const separator = 10;

        this.host
            .selectAll('g.legend-item')
            .each((d: any, i: number, items: any) => {
                const g = d3.select(items[i]);
                g.attr('transform', `translate(${padding}, 0)`);
                const dims = g.node()?.getBoundingClientRect() || new DOMRect();
                padding += dims.width + separator;
            });
    }

    public generate = () => {
        this.setItems();
        this.repositionItems();
    }
}
