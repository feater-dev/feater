/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildDefinitionListComponent } from './build-definition-list.component';

describe('BuildDefinitionListComponent', () => {
    let component: BuildDefinitionListComponent;
    let fixture: ComponentFixture<BuildDefinitionListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildDefinitionListComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildDefinitionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
