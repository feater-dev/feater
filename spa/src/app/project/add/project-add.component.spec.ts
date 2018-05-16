/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {ProjectAddComponent} from './project-add.component';

describe('ProjectAddComponent', () => {
    let component: ProjectAddComponent;
    let fixture: ComponentFixture<ProjectAddComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ProjectAddComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
