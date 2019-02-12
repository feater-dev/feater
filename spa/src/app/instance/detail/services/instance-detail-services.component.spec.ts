/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceServicesComponent} from './instance-services.component';

describe('InstanceServicesComponent', () => {
    let component: InstanceServicesComponent;
    let fixture: ComponentFixture<InstanceServicesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceServicesComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
