/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceLogsComponent} from './instance-logs.component';

describe('InstanceLogsComponent', () => {
    let component: InstanceLogsComponent;
    let fixture: ComponentFixture<InstanceLogsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceLogsComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceLogsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
