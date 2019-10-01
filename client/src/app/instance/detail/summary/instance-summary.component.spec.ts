/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceSummaryComponent } from './instance-summary.component';

describe('InstanceSummaryComponent', () => {
    let component: InstanceSummaryComponent;
    let fixture: ComponentFixture<InstanceSummaryComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceSummaryComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
