/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DeployKeyListComponent} from './deploy-key-list.component';

describe('DeployKeyListComponent', () => {
    let component: DeployKeyListComponent;
    let fixture: ComponentFixture<DeployKeyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DeployKeyListComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DeployKeyListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
