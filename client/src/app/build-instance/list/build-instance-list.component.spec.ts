/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildInstanceListComponent } from './build-instance-list.component';

describe('BuildInstanceListComponent', () => {
    let component: BuildInstanceListComponent;
    let fixture: ComponentFixture<BuildInstanceListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildInstanceListComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildInstanceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
