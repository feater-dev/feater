/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceProxyDomainsComponent } from './instance-proxy-domains.component';

describe('InstanceProxyDomainsComponent', () => {
    let component: InstanceProxyDomainsComponent;
    let fixture: ComponentFixture<InstanceProxyDomainsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceProxyDomainsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceProxyDomainsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
