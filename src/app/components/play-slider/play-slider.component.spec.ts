import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySliderComponent } from './play-slider.component';

describe('PlaySliderComponent', () => {
    let component: PlaySliderComponent;
    let fixture: ComponentFixture<PlaySliderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlaySliderComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlaySliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
