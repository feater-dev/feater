/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceTabsComponent } from './instance-tabs.component';

describe('InstanceTabsComponent', () => {
    let component: InstanceTabsComponent;
    let fixture: ComponentFixture<InstanceTabsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceTabsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
