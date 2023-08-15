import { Injectable } from '@angular/core';
import { Selection } from 'd3-selection';
import { ITooltipConfig, ITooltipData } from '../interfaces/tooltip.interfaces';
import ObjectHelper from '../helpers/object.helper';

@Injectable()
export class TooltipService {
    public host: Selection<SVGGElement, any, any, any> = {} as any;

    private _data: ITooltipData = undefined as any;
    private _config: ITooltipConfig = undefined as any;

    protected defaultData: ITooltipData = {
        title: '',
        colour: '',
        key: '',
        value: '',
    };
    protected defaultConfig: ITooltipConfig = {
        background: {
            xPadding: 10,
            yPadding: 10,
            colour: '#fff',
            opacity: 0.9,
            stroke: '#000',
            strokeWidth: 2,
            rx: 3,
            ry: 3,
        },
        labels: {
            symbolSize: 6,
            fontSize: 30,
            height: 30,
            textSeparator: 10,
        },
        symbol: {
            width: 6,
            height: 6,
        },
        offset: {
            x: 20,
            y: 20,
        },
    }

    public set data(data: ITooltipData) {
        this._data = data;
        this.onUpdateData();
    }

    public get data() {
        return this._data || this.defaultData;
    }

    public set config(config: ITooltipConfig) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues(this.defaultConfig, config);
        this.onUpdateConfig();
    }

    public get config() {
        return this._config || this.defaultConfig;
    }

    public onUpdateData = () => {}
    public onUpdateConfig = () => {}
}
