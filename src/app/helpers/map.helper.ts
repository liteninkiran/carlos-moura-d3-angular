import { MapTooltipActions, MapTooltipActionsTypes, ShowMapTooltip } from '../actions/map-tooltip.actions';
import { ICountryCode, ICovidData, IMapData, IMapDataElement, IPlaySlider, ITimelineData, ITooltipState } from '../interfaces/chart.interfaces';
import * as d3 from 'd3';

export class MapHelper {

    public fullDataSet: IMapDataElement[] = [];
    public dataByDate = new Map<number, IMapDataElement[]>();
    public dataByCountry = new Map<string, IMapDataElement[]>();
    public countriesById = new Map<string, string>();
    public currentDate = 0;
    public dateRange: [number, number];
    public data: IMapData = {
        title: 'Covid-19 New Death Cases',
        data: [],
        thresholds: [],
    };
    public tooltipState: ITooltipState = {
        visible: false,
        x: 0,
        y: 0,
    };
    public tooltipData: ITimelineData = {
        title: '',
        activeTime: null,
        data: [],
        timeFormat: '',
    };
    public sliderState: IPlaySlider = {
        min: 0,
        max: 100,
        step: 1000 * 60 * 60 * 24,
        speed: 300,
    };

    private timeFormatString = '%B %Y';
    private timeFormat: d3.timeFormat = d3.timeFormat(this.timeFormatString);

    public setData(data: ICovidData, countryCodes: Array<ICountryCode>, dataAttr: string = 'new_deaths_smoothed_per_million'): void {
        const ids: Map<string, string> = new Map(countryCodes.map((code: ICountryCode) => [code.location, code.iso3]));
        this.countriesById = new Map(countryCodes.map((code: ICountryCode) => [code.iso3, code.location]));
        this.fullDataSet = data.location.map((location: string, i: number) => ({
            id: ids.get(location),
            value: data[dataAttr][i],
            date: this.parseDate(data.date[i]),
        }));
        this.dataByDate = d3.group(this.fullDataSet, (d: ICovidData) => d.date);
        this.dataByCountry = d3.group(this.fullDataSet, (d: any) => d.id);
        this.dateRange = d3.extent(this.fullDataSet, (d: ICovidData) => d.date);
        this.setMapData(this.dateRange[1]);
        this.setSlider();
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
        // Set visible to true
        this.tooltipState = {
            visible: true,
            x: action.payload.x - 125,
            y: action.payload.y - 170,
        };
        // Set data
        this.setTooltipData(action.payload.id);
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

    public setTooltipData(id: string) {
        this.tooltipData = {
            title: this.countriesById.get(id),
            activeTime: this.currentDate,
            data: this.dataByCountry.get(id),
            timeFormat: this.timeFormatString,
        };
    }

    public setMapData(date: number): void {
        this.currentDate = date;
        this.data = {
            title: `Covid-19 New Death Cases - ${this.timeFormat(date)}`,
            data: this.dataByDate.get(date),
            thresholds: [null, 0, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20],
        };
    }

    private parseDate(date: string): number {
        return Date.parse(date);
    }

    private setSlider(): void {
        this.sliderState = {
            ...this.sliderState,
            min: this.dateRange[0],
            max: this.dateRange[1],
        };

    }
}
