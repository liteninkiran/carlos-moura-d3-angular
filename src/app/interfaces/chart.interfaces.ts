export interface IChartMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export interface IPieDataElements {
    id: string | number;
    label: string;
    value: number;
};

export interface IPieData {
    title: string;
    data: IPieDataElements[];
};

export interface IPieConfig {
    innerRadiusCoef: number;
    hiddenOpacity: number;
    legendItem: {
        symbolSize: number;
        height: number;
        fontSize: number;
        textSeparator: number;
    };
    transition: number;
    arcs: {
        stroke: string;
        strokeWidth: number;
        radius: number;
        padAngle: number;
    };
    margins: IChartMargins;
};

export interface IGroupStackDataElem {
    key?: string;
    domain: string;
    group: string;
    stack: string;
    value: number;
};

export interface IGroupStackData {
    title: string;
    yLabel: string;
    unit: string;
    data: IGroupStackDataElem[];
    stackOrder: string[];
};

export interface IGroupStackConfig {
    hiddenOpacity: number;
    fontSize: number;
    transition: number;
    margins: IChartMargins;
    tooltip: ITooltipConfig;
    transitions: {
        normal: number;
        slow: number;
    };
};

export interface IGroupStackRectData extends IGroupStackDataElem {
    min: number;
    max: number;
    key: string;
    index: number;
};

export interface ITooltipData {
    title: string;
    colour: string;
    key: string;
    value: number | string;
};

export interface ITooltipConfig {
    background: {
        xPadding: number;
        yPadding: number;
        colour: string;
        opacity: number;
        stroke: string;
        strokeWidth: number;
        rx: number;
        ry: number;
    };
    labels: {
        symbolSize: number;
        fontSize: number;
        height: number;
        textSeparator: number;
    };
    symbol: {
        width: number;
        height: number;
    };
    offset: {
        x: number;
        y: number;
    };
};

export interface ICovidData {
    cfr: Array<number>;
    cfr_short_term: Array<number>;
    continent: Array<string>;
    date: Array<string>;
    location: Array<string>;
    new_deaths: Array<number>;
    new_deaths_per_million: Array<number>;
    new_deaths_smoothed: Array<number>;
    new_deaths_smoothed_per_million: Array<number>;
    total_deaths: Array<number>;
    total_deaths_per_million: Array<number>;
};

export interface ICountryCode {
    location: string;
    iso3: string;
};

export interface IMapData {
    title: string;
    data: IMapDataElement[];
};

export interface IMapDataElement {
    id: string;
    value: number;
    date: number;
};

export interface IMapConfig {
    margins: IChartMargins;
};

export interface IMapContainer {
    countries: any;
    data: any;
    titleContainer: any;
    legend: any;
};
