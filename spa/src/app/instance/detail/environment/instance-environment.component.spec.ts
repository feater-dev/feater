/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceEnvironmentComponent} from './instance-environment.component';

describe('InstanceEnvironmentComponent', () => {
    let component: InstanceEnvironmentComponent;
    let fixture: ComponentFixture<InstanceEnvironmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceEnvironmentComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceEnvironmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
