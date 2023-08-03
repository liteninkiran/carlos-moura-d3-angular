export interface IChartMargins {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface IPieDataElements {
    id: string | number;
    label: string;
    value: number;
}

export interface IPieData {
    title: string;
    data: IPieDataElements[];
}

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
}

export interface IGroupStackDataElem {
    key?: string;
    domain: string;
    group: string;
    stack: string;
    value: number;
}

export interface IGroupStackData {
    title: string;
    yLabel: string;
    unit: string;
    data: IGroupStackDataElem[];
}

export interface IGroupStackConfig {
    hiddenOpacity: number;
    fontSize: number;
    margins: IChartMargins;
}
