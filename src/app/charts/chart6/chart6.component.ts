import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import { IPieConfig } from 'src/app/interfaces/chart.interfaces';
import ObjectHelper from 'src/app/helpers/object.helper';
import { PieHelper } from 'src/app/helpers/pie.helper';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart6',
    templateUrl: './chart6.component.html',
    styleUrls: ['./chart6.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Chart6Component implements OnInit, OnChanges {
    @Input() public data: any;

    // Main elements
    public host: any;
    public svg: any;

    // Containers
    public dataContainer: any;
    public legendContainer: any;
    public title: any;

    // Functions
    public pie: any;
    public arc: any;
    public arcTween: any;

    // Scales
    public colours: any;

    // State
    public hiddenIds = new Set();

    // Dimensions
    public dimensions: DOMRect;
    public innerWidth: number;
    public innerHeight: number;
    public radius: number;
    public innerRadius = 0;

    // Config
    @Input()
    public set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IPieConfig>(this._defaultConfig, values);
    };

    private _config: IPieConfig;
    private _defaultConfig: IPieConfig = {
        innerRadiusCoef: 0.7,
        hiddenOpacity: 0.3,
        legendItem: {
            symbolSize: 10,
            height: 20,
            fontSize: 12,
            textSeparator: 15,
        },
        transition: 800,
        arcs: {
            stroke: '#fff',
            strokeWidth: 2,
            radius: 6,
            padAngle: 0,
        },
        margins: {
            left: 10,
            top: 40,
            right: 130,
            bottom: 10,
        },
    };

    // Getters
    get margins() {
        return this.config.margins;
    }

    get ids() {
        return this.data.data.map((d) => d.id);
    }

    get pieData() {
        return this.pie(this.data.data.filter((elem) => !this.hiddenIds.has(elem.id)));
    }

    get config() {
        return this._config || this._defaultConfig;
    }

    constructor(element: ElementRef) {
        this.host = d3.select(element.nativeElement);
    }

    public ngOnInit(): void {
        this.svg = this.host.select('svg');
        this.setDimensions();
        this.setElements();
        this.updateChart();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.svg) {
            this.updateChart();
        }
    }

    private updateChart(): void {
        if (this.data) {
            this.setParams();
            this.setLabels();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        this.dimensions = this.svg.node().getBoundingClientRect();
        this.innerWidth = this.dimensions.width - this.margins.left - this.margins.right;
        this.innerHeight = this.dimensions.height - this.margins.top - this.margins.bottom;
        this.radius = 0.5 * Math.min(this.innerWidth, this.innerHeight);
        this.innerRadius = this.radius * this.config.innerRadiusCoef;
        this.svg.attr('viewBox', [0, 0, this.dimensions.width, this.dimensions.height]);
    }

    private setElements(): void {
        const coords = {
            data: this.getTranslations('data-container'),
            legend: this.getTranslations('legend-container'),
            title: this.getTranslations('title-container'),
        };
        // Data Container
        this.dataContainer = this.svg
            .append('g')
            .attr('class', 'data-container')
            .attr('transform', `translate(${coords.data.x}, ${coords.data.y})`);

        // Legend Container
        this.legendContainer = this.svg
            .append('g')
            .attr('class', 'legend-container')
            .attr('transform', `translate(${coords.legend.x}, ${coords.legend.y})`);

        // Title Container
        this.title = this.svg
            .append('g')
            .attr('class', 'title-container')
            .attr('transform', `translate(${coords.title.x}, ${coords.title.y})`)
            .append('text')
            .attr('class', 'title')
            .style('text-anchor', 'middle');
    }

    private getTranslations(container: string): any {
        switch (container) {
            case 'data-container': return {
                x: this.margins.left + 0.5 * this.innerWidth,
                y: this.margins.top + 0.5 * this.innerHeight,
            };
            case 'legend-container': return {
                x: this.innerWidth - 0.5 * this.margins.right,
                y: this.margins.top + 0.5 * this.innerHeight,
            };
            case 'title-container': return {
                x: this.dimensions.width * 0.5,
                y: this.margins.top * 0.5,
            };
            case 'legend':
                const dimensions = this.legendContainer.node().getBBox();
                return {
                    x: this.dimensions.width - this.margins.right,
                    y: this.margins.top + 0.5 * this.innerHeight - 0.5 * dimensions.height,
                };
        }
    }

    private setParams(): void {
        // Arc generator
        this.arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.radius)
            .cornerRadius(this.config.arcs.radius)
            .padAngle(this.config.arcs.padAngle);

        // Pie generator
        this.pie = d3.pie()
            .value((d) => d.value);

        // Colour scale
        this.colours = d3
            .scaleOrdinal(d3.schemeCategory10)
            .domain(this.ids);

        const chart = this;

        this.arcTween = function (d: any) {
            const current = d;
            const previous = this._previous;
            const interpolate = d3.interpolate(previous, current);
            this._previous = current;
            return function (t: any) {
                return chart.arc(interpolate(t));
            };
        };
    }

    private setLabels(): void {
        this.title.text(this.data.title);
    }

    private setLegend(): void {
        const data = this.data.data;
        // Add legend item containers
        this.legendContainer
            .selectAll('g.legend-item')
            .data(data)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * this.config.legendItem.height})`)
            .style('opacity', (d) => this.hiddenIds.has(d.id) ? this.config.hiddenOpacity : null)
            .on('mouseenter', (event, d) => this.setHighlights(d.id))
            .on('mouseleave', (d) => this.resetHighlights())
            .on('click', (event, d) => this.toggleHighlight(d.id));

        // Add symbols
        this.legendContainer
            .selectAll('g.legend-item')
            .selectAll('rect')
            .data((d) => [d])
            .join('rect')
            .attr('width', this.config.legendItem.symbolSize)
            .attr('height', this.config.legendItem.symbolSize)
            .style('fill', (d) => this.colours(d.id));

        // Add labels
        this.legendContainer
            .selectAll('g.legend-item')
            .selectAll('text')
            .data((d) => [d])
            .join('text')
            .style('font-size', this.config.legendItem.fontSize + 'px')
            .attr('x', this.config.legendItem.textSeparator)
            .attr('y', this.config.legendItem.symbolSize)
            .text((d) => d.label);

        // Reposition legend
        const coords = this.getTranslations('legend');
        this.legendContainer.attr('transform', `translate(${coords.x}, ${coords.y})`);
    }

    private draw(): void {
        const data = this.pieData;
        const previousData = this.dataContainer.selectAll('path.data').data();
        const extendedPreviousData = PieHelper.ExtendPreviousDataWithEnter(previousData, data);
        const extendedCurrentData = PieHelper.ExtendCurrentDataWithExit(previousData, data);
        const enterArcTween = PieHelper.ArcTweenFactory(extendedPreviousData, true, this.arc);
        const exitArcTween = PieHelper.ArcTweenFactory(extendedCurrentData, false, this.arc);

        this.dataContainer
            .selectAll('path.data')
            .data(data, (d: any) => d.data.id)
            .join(
                enter => enter.append('path'),
                update => update,
                exit => exit.transition()
                    .duration(1000)
                    .attrTween('d', exitArcTween)
                    .remove()
            )
            .attr('class', 'data')
            .style('fill', (d: any) => this.colours(d.data.id))
            .style('stroke', this.config.arcs.stroke)
            .style('stroke-width', this.config.arcs.strokeWidth)
            .on('mouseenter', (event, d) => this.setHighlights(d.data.id))
            .on('mouseleave', (d) => this.resetHighlights())
            .transition()
            .duration(1000)
            .attrTween('d', enterArcTween);
    }

    private setHighlights(id): void {
        this.dataContainer
            .selectAll('path')
            .style('opacity', (d) => d.data.id === id ? null : this.config.hiddenOpacity);

        this.legendContainer
            .selectAll('g.legend-item')
            .style('opacity', (d) => d.id === id ? null : this.config.hiddenOpacity);
    }

    private resetHighlights(): void {
        this.dataContainer
            .selectAll('path')
            .style('opacity', null);

        this.legendContainer
            .selectAll('g.legend-item')
            .style('opacity', null);
    }

    private toggleHighlight(id): void {
        this.hiddenIds.has(id) ? this.hiddenIds.delete(id) : this.hiddenIds.add(id);
        this.updateChart();
    }

}
