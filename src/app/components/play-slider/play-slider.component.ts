import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-play-slider',
    templateUrl: './play-slider.component.html',
    styleUrls: ['./play-slider.component.scss'],
})
export class PlaySliderComponent implements OnInit {

    @Input() public min = 0;
    @Input() public max = 100;
    @Input() public step = 1;
    @Input() public speed = 300;
    @Input() public set value(value: number) {
        this._value = value;
    }

    @Output() public changeValue = new EventEmitter<number>;

    public interval: any;
    public paused = true;

    private _value: number = 0;

    get value() {
        return this._value;
    }

    constructor() {
        
    }

    public ngOnInit(): void {

    }

    public play(): void {

    }

    public pause(): void {

    }

    public toggle(): void {

    }

    public onChangeValue(event: Event): void {
        console.log(event);
    }
}
