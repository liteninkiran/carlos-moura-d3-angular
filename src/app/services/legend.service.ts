import { Injectable } from '@angular/core';
import ObjectHelper from '../helpers/object.helper';

@Injectable()
export abstract class LegendService<D, C> {
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
}
