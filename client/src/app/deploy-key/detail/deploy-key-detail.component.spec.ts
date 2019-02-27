/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DeployKeyDetailComponent} from './deploy-key-detail.component';

describe('DeployKeyDetailComponent', () => {
    let component: DeployKeyDetailComponent;
    let fixture: ComponentFixture<DeployKeyDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeployKeyDetailComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeployKeyDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
