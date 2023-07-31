import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Chart1Component } from './charts/chart1/chart1.component';
import { HttpClientModule } from '@angular/common/http';
import { Chart2Component } from './charts/chart2/chart2.component';

@NgModule({
    declarations: [
        AppComponent,
        Chart1Component,
        Chart2Component,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
