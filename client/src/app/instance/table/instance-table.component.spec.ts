/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceTableComponent } from './instance-table.component';

describe('InstanceTableComponent', () => {
    let component: InstanceTableComponent;
    let fixture: ComponentFixture<InstanceTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
