import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) { }

    public getEmployees(): Observable<any> {
        const url = 'assets/employees.json';
        return this.http.get<any>(url).pipe(
            map((answer) => answer.data)
        );
    }
}
