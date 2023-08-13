import { ISwarmData, ISwarmDataElement } from '../interfaces/chart.interfaces';

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
    ): void {
        let rounding: (value: number) => number;

        if (decimals === undefined) {
            rounding = (value: number) => value;
        } else {
            const factor = Math.pow(10, decimals);
            rounding = (value: number) => Math.round(factor * value) / factor;
        }

        const elements: ISwarmDataElement[] = data.map((item: any) => ({
            id: item[id],
            label: item[label],
            category: item[category],
            group: item[group],
            value: rounding(item[value]),
        }));
        
        this.data = {
            title,
            unit,
            data: elements,
        };
    }
}
