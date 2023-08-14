import { Injectable } from '@angular/core';
import { LegendService } from './legend.service';

@Injectable()
export class ListLegendService extends LegendService<any, any> {

    protected override defaultData: any = { };
    protected override defaultConfig: any = { };

    public onUpdateData = (): void => {

    }

    public onUpdateConfig = (): void => {

    }

    public generateItem = (selection: any): void => {

    }

    public updateItem = (selection: any): void => {

    }

}
