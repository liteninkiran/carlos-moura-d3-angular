export enum MapTooltipActionsTypes {
    showTooltip = 'Show map tooltip',
    hideTooltip = 'Hide map tooltip',
}

export interface IChartActions {
    readonly type: string;
}

export interface IPayload {
    id: string;
    x: number;
    y: number;
};

export class ShowMapTooltip implements IChartActions {
    readonly type = MapTooltipActionsTypes.showTooltip;
    constructor(public payload: IPayload) {}
}

export class HideMapTooltip implements IChartActions {
    readonly type = MapTooltipActionsTypes.hideTooltip;
}

export type MapTooltipActions = ShowMapTooltip | HideMapTooltip;
