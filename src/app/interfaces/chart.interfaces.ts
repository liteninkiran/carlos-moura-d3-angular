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
