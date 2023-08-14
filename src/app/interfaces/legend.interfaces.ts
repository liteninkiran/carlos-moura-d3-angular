export interface ListLegendItem {
    id: string | number;
    label: string;
    colour: string;
}

export interface ListLegendData {
    items: ListLegendItem[];
}

export interface LegendConfig {
    item: {
        separator: number;
        cursor: string;
    };
}

export interface ListLegendConfig extends LegendConfig {
    item: {
        separator: number;
        opacity: number;
        cursor: string;
    };
    circle: {
        radius: number;
    };
    text: {
        separator: number;
        font_size: number;
    };
    highlighted: {
        font_weight: string;
    };
}
