import { ITooltipConfig } from "./tooltip.interfaces";

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
    thresholds: Array<number>;
};

export interface IMapDataElement {
    id: string;
    value: number;
    date: number;
};

export interface IMapConfig {
    margins: IChartMargins;
    title: {
        fontWeight: string;
        fontSize: number;
    };
    features: {
        base: {
            stroke: string;
            fill: string;
        };
        data: {
            stroke: string;
        };
        highlighted: {
            stroke: string;
        };
    };
    faded: {
        opacity: number;
    };
    noData: {
        colour: string;
        label: string;
    };
    legend: {
        width: number;
        height: number;
        fontSize: number;
        noDataSeparator: number;
    };
    colours: string[];
};

export interface IMapContainer {
    countries: any;
    data: any;
    titleContainer: any;
    legend: any;
};

export interface IMapFeature {
    geometry: {
        coordinates: any;
        type: string;
    };
    id: string;
    properties: {
        CNTR_ID: string;
        CNTR_NAME: string;
        FID: string;
        ISO3_CODE: string;
        NAME_ENGL: string;
    };
    type: string;
};

export interface ITooltipState {
    visible: boolean;
    x: number;
    y: number;
}

export interface ITimelineData {
    title: string;
    activeTime: number;
    data: IMapDataElement[];
    timeFormat: string;
}

export interface ITimelineConfig {
    margins: IChartMargins;
    dimensions: {
        width: number;
        height: number;
    };
    background: {
        colour: string;
    };
    title: {
        fontSize: number;
        fontWeight: string;
    };
    labels: {
        fontSize: number;
    };
    line: {
        stroke: string;
    };
    area: {
        fill: string;
        opacity: number;
    };
    axis: {
        colour: string;
    };
    circle: {
        stroke: string;
        fill: string;
        radius: number;
    };
    values: {
        decimalPlaces: number;
        xPadding: number;
        yPadding: number;
    };
}

export interface IPlaySlider {
    min: number;
    max: number;
    step: number;
    speed: number;
}

export interface ISwarmData {
    title: string;
    unit: string;
    data: ISwarmDataElement[];
}

export interface ISwarmDataElement {
    id: string | number;
    label: string;
    value: number;
    category: string | number;
    group: string | number;
}

export interface IBaseConfig {
    margins: IChartMargins;
}

export interface ISimulatedSwarmDataElement extends ISwarmDataElement {
    cx: number;
    cy: number;
    index: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}
