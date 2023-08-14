import { Injectable } from '@angular/core';
import { LegendService } from './legend.service';
import { ListLegendData } from '../interfaces/legend.interfaces';

@Injectable()
export class ListLegendService extends LegendService<ListLegendData, any> {

    protected override defaultData: ListLegendData = {
        items: [],
    };
    protected override defaultConfig: any = { };

    public onUpdateData = (): void => {

    }

    public onUpdateConfig = (): void => {

    }

    public generateItem = (selection: any): void => {

    }

    public updateItem = (selection: any): void => {

    }

    public getItems = (): void => {

    }

}
