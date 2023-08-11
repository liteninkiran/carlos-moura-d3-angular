import { ICountryCodes, ICovidData, IHelperData } from '../interfaces/chart.interfaces';
import * as d3 from 'd3';

export class MapHelper {

    public fullDataSet = [];
    public dataByDate = new Map<number, any>();
    public currentDate = 0;
    public dateRange: [number, number];
    public data: IHelperData;

    public setData(data: ICovidData, countryCodes: Array<ICountryCodes>, dataAttr: string = 'new_deaths_smoothed_per_million'): void {
        const ids = new Map(countryCodes.map((code) => [code.location, code.iso3]));
        this.fullDataSet = data.location.map((location, i) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i]),
        }));

        this.dataByDate = d3.group(this.fullDataSet, (d) => d.date);
        this.dateRange = d3.extent(this.fullDataSet, (d) => d.date);
        this.currentDate = this.dateRange[1];
        this.data = {
            title: `Covid-19 new death cases (${this.timeFormat(this.currentDate)})`,
            data: this.dataByDate.get(this.currentDate),
        };
    
        console.log(this);
    }

    private parseDate(date: string): number {
        return Date.parse(date);
    }

    private timeFormat(date: number): d3.timeFormat {
        return d3.timeFormat('%Y-%m-%d')(date);
    }
}
