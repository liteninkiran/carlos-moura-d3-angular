import { Injectable } from '@angular/core';
import { Selection } from 'd3-selection';
import { ITooltipConfig, ITooltipData, ITooltipPosition, XTooltipPosition, YTooltipPosition } from '../interfaces/tooltip.interfaces';
import ObjectHelper from '../helpers/object.helper';

@Injectable()
export class TooltipService {
    public template = `
        <rect class="tooltip__background"></rect>
        <g class="tooltip__box">
            <text class="tooltip__title"></text>
            <rect class="tooltip__symbol"></rect>
            <text class="tooltip__value">
                <tspan class="tooltip__value--key"></tspan>
                <tspan class="tooltip__value--value"></tspan>
            </text>
        </g>
    `;

    private _host: Selection<SVGGElement, any, any, any> = {} as any;
    private _data: ITooltipData = undefined as any;
    private _config: ITooltipConfig = undefined as any;

    protected defaultData: ITooltipData = {
        title: '',
        colour: '',
        key: '',
        value: '',
    };
    protected defaultConfig: ITooltipConfig = {
        background: {
            xPadding: 10,
            yPadding: 10,
            colour: '#fff',
            opacity: 0.9,
            stroke: '#000',
            strokeWidth: 2,
            rx: 3,
            ry: 3,
        },
        title: {
            fontSize: 12,
            fontWeight: 'bold',
        },
        labels: {
            symbolSize: 6,
            fontSize: 30,
            height: 30,
            textSeparator: 10,
        },
        value: {
            fontWeight: 'bold',
        },
        symbol: {
            width: 6,
            height: 6,
        },
        offset: {
            x: 20,
            y: 20,
        },
    };

    public set data(data: ITooltipData) {
        this._data = data;
        this.onUpdateData();
    };

    public get data() {
        return this._data || this.defaultData;
    };

    public set config(config: ITooltipConfig) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues(this.defaultConfig, config);
        this.onUpdateConfig();
    };

    public get config() {
        return this._config || this.defaultConfig;
    };

    public set host(host: Selection<SVGGElement, any, any, any>) {
        this._host = host.style('pointer-events', 'none');
        this._host.html(this.template);
    };

    public get host() {
        return this._host;
    };

    private _position: ITooltipPosition = {
        x: 0,
        y: 0,
        xPosition: XTooltipPosition.right,
        yPosition: YTooltipPosition.middle,
    };

    set position(position: Partial<ITooltipPosition>) {
        this._position = ObjectHelper.UpdateObjectWithPartialValues(this._position, position);
        this.moveTooltip();
    };

    get position(): ITooltipPosition {
        return this._position;
    };

    public onUpdateData = () => {
        // Title
        this.host.select('text.tooltip__title')
            .attr('y', this.config.title.fontSize + 'px')
            .style('font-weight', this.config.title.fontWeight)
            .text(this.data.title);

        // Set value
        this.host.select('text.tooltip__value')
            .attr('x', this.config.symbol.width + this.config.labels.textSeparator)
            .attr('y', this.config.labels.height + this.config.title.fontSize);

        this.host.select('tspan.tooltip__value--key')
            .text(this.data.key);

        this.host.select('tspan.tooltip__value--value')
            .style('font-size', this.config.labels.fontSize + 'px')
            .style('font-weight', this.config.value.fontWeight)
            .text(this.data.value);

        // Symbol
        this.host.select('rect.tooltip__symbol')
            .attr('y', this.config.labels.height + this.config.title.fontSize - this.config.symbol.height)
            .attr('width', this.config.symbol.width)
            .attr('height', this.config.symbol.height)
            .style('fill', this.data.colour);

        // Set background
        const tooltipDimensions: DOMRect = this.host.select<SVGGElement>('g.tooltip__box')
            .node()?.getBoundingClientRect() || new DOMRect(100, 60);

        this.host.select('rect.tooltip__background')
            .attr('width', tooltipDimensions.width + 2 * this.config.background.xPadding)
            .attr('height', tooltipDimensions.height + 2 * this.config.background.yPadding)
            .attr('x', -this.config.background.xPadding)
            .attr('y', -this.config.background.yPadding)
            .style('fill', this.config.background.colour)
            .style('fill-opacity', this.config.background.opacity)
            .style('stroke', this.config.background.stroke)
            .style('stroke-width', this.config.background.strokeWidth + 'px')
            .style('rx', this.config.background.rx + 'px')
            .style('ry', this.config.background.ry + 'px');
    };

    public onUpdateConfig = () => {
    };

    protected moveTooltip = () => {
        const x = this.position.x + this.config.background.xPadding + this.xPadding();
        const y = this.position.y + this.config.background.yPadding + this.yPadding();;
        this.host.attr('transform', `translate(${x}, ${y})`);
    };

    protected xPadding = (): number => {
        const dims = this.host.node()?.getBoundingClientRect() || new DOMRect();
        let padding: number;

        switch (this.position.xPosition) {
            case XTooltipPosition.left:
                padding = -(dims.width + this.config.offset.x);
                break;
            case XTooltipPosition.middle:
                padding = -0.5 * dims.width;
                break;
            case XTooltipPosition.right:
            default:
                padding = this.config.offset.x;
                break;
        }

        return padding;
    }

    protected yPadding = (): number => {
        const dims = this.host.node()?.getBoundingClientRect() || new DOMRect();
        let padding: number;

        switch (this.position.yPosition) {
            case YTooltipPosition.top:
                padding = -dims.height - this.config.offset.y;
                break;
            case YTooltipPosition.middle:
                padding = -0.5 * dims.height;
                break;
            case YTooltipPosition.bottom:
            default:
                padding = this.config.offset.y;
                break;
        }

        return padding;
    }
}
