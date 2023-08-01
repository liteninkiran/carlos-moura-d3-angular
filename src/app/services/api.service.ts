import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, retry } from 'rxjs';
import * as d3 from 'd3';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public getEmployees(): Observable<any> {
        const url = 'assets/employees.json';
        return this.http.get<any>(url).pipe(
            retry(3),
            map((answer) => answer.data),
        );
    }

    public getIris(): Observable<any> {
        const url = 'assets/iris.csv';
        return this.getParsedData(url);
    }

    private getParsedData(url: string): Observable<any> {
        return this.http.get(url, { responseType: 'text' }).pipe(
            retry(3),
            map((csv) => d3.csvParse(csv)),
        );
    }
}
