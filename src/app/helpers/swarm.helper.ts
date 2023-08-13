import { ISwarmData } from '../interfaces/chart.interfaces';

export class SwarmHelper {
    public data: ISwarmData = {
        title: '',
        unit: '',
        data: [],
    };

    public setData(
        data: any,
        title: string,
        category: string,
        id: string,
        label: string,
        value: string,
        group: string,
        unit: string,
        decimals?: number
    ) {
        this.data = {
            title,
            unit,
            data: [],
        };
    }
}
