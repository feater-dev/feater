/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceDetailEnvironmentComponent} from './instance-detail-environment.component';

describe('InstanceDetailEnvironmentComponent', () => {
    let component: InstanceDetailEnvironmentComponent;
    let fixture: ComponentFixture<InstanceDetailEnvironmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceDetailEnvironmentComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceDetailEnvironmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
