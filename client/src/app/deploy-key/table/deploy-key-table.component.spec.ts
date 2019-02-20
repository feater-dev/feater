/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DeployKeyTableComponent} from './deploy-key-table.component';

describe('DeployKeyTableComponent', () => {
    let component: DeployKeyTableComponent;
    let fixture: ComponentFixture<DeployKeyTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeployKeyTableComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeployKeyTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
