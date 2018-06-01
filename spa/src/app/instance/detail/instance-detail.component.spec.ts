/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceDetailComponent} from './instance-detail.component';

describe('InstanceDetailComponent', () => {
    let component: InstanceDetailComponent;
    let fixture: ComponentFixture<InstanceDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceDetailComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
