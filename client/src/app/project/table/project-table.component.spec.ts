/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProjectTableComponent } from './project-table.component';

describe('ProjectTableComponent', () => {
    let component: ProjectTableComponent;
    let fixture: ComponentFixture<ProjectTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
