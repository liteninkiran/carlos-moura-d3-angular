import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineTooltipComponent } from './timeline-tooltip.component';

describe('TimelineTooltipComponent', () => {
    let component: TimelineTooltipComponent;
    let fixture: ComponentFixture<TimelineTooltipComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimelineTooltipComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(TimelineTooltipComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
