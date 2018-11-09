/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {InstanceDetailProxyDomainsComponent} from './instance-detail-proxy-domains.component';

describe('InstanceDetailProxyDomainsComponent', () => {
    let component: InstanceDetailProxyDomainsComponent;
    let fixture: ComponentFixture<InstanceDetailProxyDomainsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InstanceDetailProxyDomainsComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceDetailProxyDomainsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
