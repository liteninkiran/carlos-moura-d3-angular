import { MapTooltipActions, MapTooltipActionsTypes, ShowMapTooltip } from '../actions/map-tooltip.actions';
import { ICountryCode, ICovidData, IMapData, IMapDataElement } from '../interfaces/chart.interfaces';
import * as d3 from 'd3';

export class MapHelper {

    public fullDataSet: IMapDataElement[] = [];
    public dataByDate = new Map<number, IMapDataElement[]>();
    public currentDate = 0;
    public dateRange: [number, number];
    public data: IMapData = {
        title: 'Covid-19 New Death Cases',
        data: [],
        thresholds: [],
    };
    public tooltipState = {
        visible: false,
        x: 0,
        y: 0,
    };

    private timeFormat: d3.timeFormat = d3.timeFormat('%B %Y');

    public setData(data: ICovidData, countryCodes: Array<ICountryCode>, dataAttr: string = 'new_deaths_smoothed_per_million'): void {
        const ids: Map<string, string> = new Map(countryCodes.map((code: ICountryCode) => [code.location, code.iso3]));
        this.fullDataSet = data.location.map((location: string, i: number) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i]),
        }));
        this.dataByDate = d3.group(this.fullDataSet, (d: ICovidData) => d.date);
        this.dateRange = d3.extent(this.fullDataSet, (d: ICovidData) => d.date);
        this.setMapData(this.dateRange[1]);
    }

    public tooltip = (action: MapTooltipActions) => {
        switch(action.type) {
            case MapTooltipActionsTypes.showTooltip:
                this.showTooltip(action);
                break;
            case MapTooltipActionsTypes.hideTooltip:
                this.hideTooltip();
                break;
        }
    }

    public showTooltip(action: ShowMapTooltip): void {
        // Set position
        this.tooltipState = {
            visible: true,
            x: action.payload.x,
            y: action.payload.y,
        };
        // Set data
        // Set visible to true
    }

    public hideTooltip(): void {
        // Set position
        this.tooltipState = {
            visible: false,
            x: 0,
            y: 0,
        };
        // Set visible to false
    }

    private parseDate(date: string): number {
        return Date.parse(date);
    }

    private setMapData(date: number): void {
        this.currentDate = date;
        this.data = {
            title: `Covid-19 New Death Cases - ${this.timeFormat(date)}`,
            data: this.dataByDate.get(date),
            thresholds: [null, 0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
        };
    }
}
