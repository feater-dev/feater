/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildInstanceDetailComponent } from './build-instance-detail.component';

describe('BuildInstanceDetailComponent', () => {
    let component: BuildInstanceDetailComponent;
    let fixture: ComponentFixture<BuildInstanceDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildInstanceDetailComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildInstanceDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
