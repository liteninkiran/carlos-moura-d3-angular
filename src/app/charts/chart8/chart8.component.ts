import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { IMapConfig, IMapData, IMapContainer } from 'src/app/interfaces/chart.interfaces';
import { DimensionService } from 'src/app/services/dimension.service';
import ObjectHelper from 'src/app/helpers/object.helper';
import * as topojson from 'topojson';
import * as d3 from 'd3';

@Component({
    selector: 'app-chart8',
    template: `
        <svg class="chart8">
            <style>
                .chart8 path.countries {
                    fill: #fff;
                    stroke: #aaa;
                }

                .chart8 path.data {
                    stroke: none;
                }

                .chart8 text.title {
                    text-anchor: middle;
                    font-size: 12px;
                    font-weight: bold;
                    dominant-baseline: middle;
                }

                .chart8 .highlighted rect, .chart8 path.data.highlighted {
                    stroke: black;
                }

                .chart8 .faded {
                    opacity: 0.3;
                }
            </style>
        </svg>
    `,
    providers: [DimensionService],
})
export class Chart8Component implements OnInit {

    @Input() set geodata(values) {
        this._geodata = values;
        this.updateChart();
    };
    @Input() set data(values) {
        this._data = values;
        this.updateChart();
    };
    @Input() set config(values) {
        this._config = ObjectHelper.UpdateObjectWithPartialValues<IMapConfig>(this._defaultConfig, values);
    };

    @Output() tooltip = new EventEmitter<any>();

    get geodata() {
        return this._geodata;
    }

    get data() {
        return this._data;
    }

    get config() {
        return this._config || this._defaultConfig;
    }

    // Main elements
    public host: d3.Selection<any, any, any, any>;
    public svg: d3.Selection<any, any, any, any>;

    public containers: any = {};
    public title: any;
    public projection: any;
    public path: any;
    public features: any;
    public dataFeatures: any;
    public colours: d3.ScaleThreshold;

    private _geodata: any;
    private _data: IMapData;
    private _config: IMapConfig;
    private _defaultConfig: IMapConfig = {
        margins: {
            top: 40,
            left: 20,
            right: 20,
            bottom: 40,
        },
    };

    constructor(
        element: ElementRef,
        public dimensions: DimensionService,
    ) {
        this.host = d3.select(element.nativeElement);
        console.log(this);
    }

    public ngOnInit(): void {
        this.setSvg();
        this.setDimensions();
        this.setElements();
        this.updateChart();
    }

    private setSvg(): void {
        this.svg = this.host.select('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
    }

    private updateChart(): void {
        if (this.geodata && this.svg) {
            this.repositionElements();
            this.setParams();
            this.setDataFeatures();
            this.setLabels();
            this.setLegend();
            this.draw();
        }
    }

    private setDimensions(): void {
        const dimensions: DOMRect = this.svg.node().getBoundingClientRect();
        this.dimensions.setDimensions(dimensions);
        this.dimensions.setMargins(this.config.margins);
    }

    private setElements(): void {
        this.containers.countries = this.svg.append('g').attr('class', 'countries');
        this.containers.countries.append('path').attr('class', 'countries');
        this.containers.data = this.svg.append('g').attr('class', 'data');
        this.containers.titleContainer = this.svg.append('g').attr('class', 'title');
        this.title = this.containers.titleContainer.append('text').attr('class', 'title');
        this.containers.legend = this.svg.append('g').attr('class', 'legend');
    }

    private repositionElements(): void {
        this.containers.countries.attr('transform', this.getTranslations('countries-container'));
        this.containers.data.attr('transform', this.getTranslations('data-container'));
        this.containers.titleContainer.attr('transform', this.getTranslations('title-container'));
        this.containers.legend.attr('transform', this.getTranslations('legend-container'));
    }

    private setParams(): void {
        this.setFeatures();
        this.setProjection();
        this.setPath();
        this.setColours();
    }

    private setProjection(): void {
        const coords: Array<number> = [
            this.dimensions.innerWidth,
            this.dimensions.innerHeight,
        ];
        this.projection = d3
            .geoEquirectangular()
            .fitSize(coords, this.features);
    }

    private setPath(): void {
        this.path = d3.geoPath(this.projection);
    }

    private setFeatures(): void {
        this.features = topojson.feature(this.geodata, this.geodata.objects['CNTR_RG_60M_2020_4326']);
    }

    private setLabels(): void {
        this.title.text(this.data.title);
    }

    private setLegend(): void {
        const width = 35;
        const height = 12;
        const fontSize = 10;
        const noDataSeparator = 20;
        const noDataLabel = 'No Data';
        const data = this.data.thresholds;

        // Enter function
        const generateLegendItem = (selection) => {
            selection
                .append('rect')
                .attr('class', 'legend-icon')
                .attr('width', width)
                .attr('height', height)
                .style('fill', (d) => this.colour(d));

            selection
                .append('text')
                .attr('class', 'legend-label')
                .attr('x', d => d === null ? 0.5 * width : 0)
                .attr('y', height + fontSize + 1)
                .style('font-size', fontSize + 'px')
                .style('text-anchor', 'middle')
                .text(d => d === null ? noDataLabel : d);
        };

        // Update function
        const updateLegendItem = (selection) => {
            selection.selectAll('rect.lengend-icon').style('fill', (d) => d.colour);
            selection.select('text.legend-label').text((d) => d);
        }

        // Set legend items
        let coords: any;
        this.containers.legend
            .selectAll('g.legend-item')
            .data(data)
            .join(
                (enter: d3.Enter) => enter.append('g').call(generateLegendItem),
                (update: d3.Update) => update.call(updateLegendItem),
            )
            .attr('class', 'legend-item')
            .attr('transform', (d: any, i: any) => this.getTranslations('legend-items', { i, width, noDataSeparator }))
            .on('mouseenter', (event: MouseEvent, data: number | null) => {
                // Highlight legend items
                this.highlightLegendItems(data);
                // Highlight features
                this.highlightFeatures(data);
            })
            .on('mouseleave', () => {
                // Reset legend items
                this.resetLegendItems();
                // Reset features
                this.resetFeatures();
            });

        // Re-position legend
        this.containers.legend.attr('transform', this.getTranslations('legend'));
    }

    private draw(): void {
        this.drawBaseLayer();
        this.drawDataLayer();
    }

    private setScale(scale: number): void {
        this.projection.scale(scale);
        this.setPath();
        this.draw();
    }

    private setTranslate(x: number, y: number): void {
        this.projection.translate([x, y]);
        this.setPath();
        this.draw();
    }

    private setCentre(x: number, y: number): void {
        this.projection.center([x, y]);
        this.setPath();
        this.draw();
    }

    private setRotate(x: number, y: number, z: number): void {
        this.projection.rotate([x, y, z]);
        this.setPath();
        this.draw();
    }

    private setExtent(width: number, height: number): void {
        this.projection.fitSize([width, height], this.features);
        this.setPath();
        this.draw();
    }

    private setWidth(width: number): void {
        this.projection.fitWidth(width, this.features);
        this.setPath();
        this.draw();
    }

    private setHeight(height: number): void {
        this.projection.fitHeight(height, this.features);
        this.setPath();
        this.draw();
    }

    private drawBaseLayer(): void {
        this.containers.countries
            .select('path.countries')
            .datum(this.features)
            .attr('d', this.path);
    }

    private drawDataLayer(): void {
        this.containers.data
            .selectAll('path.data')
            .data(this.dataFeatures)
            .join('path')
            .attr('class', 'data')
            .attr('d', this.path)
            .style('fill', (d) => this.colour(this.getValueByFeature(d)));
    }

    private setColours(): void {
        this.colours = d3.scaleThreshold()
            .domain(this.data.thresholds.slice(2, this.data.thresholds.length))
            .range(d3.schemeOranges[9]);
    }

    private setDataFeatures(): void {
        const ids = new Set(this.data.data.map((d) => d.id));
        this.dataFeatures = this.features.features?.filter((feature) => ids.has(feature.properties.ISO3_CODE)) || [];
    }

    private getValueByFeature(feature: any): number {
        const id = feature.properties.ISO3_CODE;
        return this.data.data.find((d) => d.id === id)?.value || null;
    }

    private colour(value: number | null): string {
        return value === null ? '#b4b4b4' : this.colours(value);
    }

    private getTranslations(container: string, options: any = {}): string {
        switch (container) {

            case 'countries-container':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.marginTop}
                )`;

            case 'data-container':
                return `translate(
                    ${this.dimensions.marginLeft},
                    ${this.dimensions.marginTop}
                )`;

            case 'title-container':
                return `translate(
                    ${this.dimensions.midWidth},
                    ${this.dimensions.midMarginTop}
                )`;
    
            case 'legend-container':
                return `translate(
                    ${this.dimensions.midWidth},
                    ${this.dimensions.midMarginBottom}
                )`;

            case 'legend-items':
                return `translate(
                    ${options.i * options.width + (options.i && options.noDataSeparator || 0)},
                    ${0}
                )`;

            case 'legend':
                const legendBox = this.containers.legend.node().getBBox();
                return `translate(
                    ${this.dimensions.midWidth - 0.5 * legendBox.width},
                    ${this.dimensions.midMarginBottom - 0.5 * legendBox.height}
                )`;
        }
    }

    private highlightLegendItems = (value: number | null) => {
        this.containers.legend
            .selectAll('g.legend-item')
            .classed('highlighted', (d: number | null) => d === value);
    }

    private highlightFeatures = (value: number | null) => {
        const colour = d3.color(this.colour(value)).toString();
        this.containers.countries
            .selectAll('path')
            .classed('faded', true);

        this.containers.data
            .selectAll('path.data')
            .classed('highlighted', function (d) {
                const featureColour = d3.select(this).style('fill');
                return featureColour === colour
            })
            .classed('faded', function (d) {
                const featureColour = d3.select(this).style('fill');
                return featureColour !== colour
            });
    }

    private resetLegendItems = () => {
        this.containers.legend
            .selectAll('g.legend-item')
            .classed('highlighted', false);
    }

    private resetFeatures = () => {
        this.containers.countries
            .selectAll('path')
            .classed('faded', false);

        this.containers.data
            .selectAll('path.data')
            .classed('highlighted faded', false);
    }
}
