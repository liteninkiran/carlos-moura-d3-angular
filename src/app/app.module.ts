import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Chart1Component } from './charts/chart1/chart1.component';
import { HttpClientModule } from '@angular/common/http';
import { Chart2Component } from './charts/chart2/chart2.component';
import { Chart3Component } from './charts/chart3/chart3.component';
import { Chart4Component } from './charts/chart4/chart4.component';
import { Chart5Component } from './charts/chart5/chart5.component';
import { Chart6Component } from './charts/chart6/chart6.component';
import { Chart7Component } from './charts/chart7/chart7.component';

@NgModule({
    declarations: [
        AppComponent,
        Chart1Component,
        Chart2Component,
        Chart3Component,
        Chart4Component,
        Chart5Component,
        Chart6Component,
        Chart7Component,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
