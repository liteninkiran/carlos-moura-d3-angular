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
