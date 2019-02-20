/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DefinitionEnvironmentComponent} from './definition-environment.component';

describe('DefinitionEnvironmentComponent', () => {
    let component: DefinitionEnvironmentComponent;
    let fixture: ComponentFixture<DefinitionEnvironmentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefinitionEnvironmentComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionEnvironmentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
