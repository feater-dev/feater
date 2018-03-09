/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildDefinitionDetailComponent } from './build-definition-detail.component';

describe('BuildDefinitionDetailComponent', () => {
    let component: BuildDefinitionDetailComponent;
    let fixture: ComponentFixture<BuildDefinitionDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildDefinitionDetailComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildDefinitionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
