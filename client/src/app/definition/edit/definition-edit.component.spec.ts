/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DefinitionEditComponent} from './definition-edit.component';

describe('DefinitionEditComponent', () => {
    let component: DefinitionEditComponent;
    let fixture: ComponentFixture<DefinitionEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefinitionEditComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
