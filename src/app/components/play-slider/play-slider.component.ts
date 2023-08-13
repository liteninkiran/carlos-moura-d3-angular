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
        if (!this.paused) {
            return;
        }

        this.paused = false;

        this.interval = setInterval(() => {
            if (this.value < this.max) {
                this.value += this.step;
                this.changeValue.emit(this.value);
            } else {
                clearInterval(this.interval);
            }
        }, this.speed);
    }

    public pause(): void {
        this.paused = true;
        clearInterval(this.interval);
    }

    public toggle(): void {
        this.paused ? this.play() : this.pause();
    }

    public onChangeValue(event): void {
        const value: number = +event.target.value;
        this.value = value;
        this.changeValue.emit(value);
    }
}
