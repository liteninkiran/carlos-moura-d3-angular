import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-chart4',
    templateUrl: './chart4.component.html',
    styleUrls: ['./chart4.component.scss'],
})
export class Chart4Component implements OnInit {

    @Input() public data: any;

    constructor() {

    }

    public ngOnInit(): void {
        
    }
}
