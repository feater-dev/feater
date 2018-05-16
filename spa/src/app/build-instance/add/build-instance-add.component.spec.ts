/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {BuildInstanceAddComponent} from './build-instance-add.component';

describe('BuildInstanceAddComponent', () => {
    let component: BuildInstanceAddComponent;
    let fixture: ComponentFixture<BuildInstanceAddComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildInstanceAddComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildInstanceAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
