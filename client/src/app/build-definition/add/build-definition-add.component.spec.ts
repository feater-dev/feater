/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BuildDefinitionAddComponent } from './build-definition-add.component';

describe('BuildDefinitionAddComponent', () => {
    let component: BuildDefinitionAddComponent;
    let fixture: ComponentFixture<BuildDefinitionAddComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BuildDefinitionAddComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildDefinitionAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
