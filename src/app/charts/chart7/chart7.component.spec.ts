import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chart7Component } from './chart7.component';

describe('Chart7Component', () => {
    let component: Chart7Component;
    let fixture: ComponentFixture<Chart7Component>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Chart7Component]
        })
            .compileComponents();

        fixture = TestBed.createComponent(Chart7Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
