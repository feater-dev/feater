/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DefinitionDuplicateComponent} from './definition-duplicate.component';

describe('DefinitionDuplicateComponent', () => {
    let component: DefinitionDuplicateComponent;
    let fixture: ComponentFixture<DefinitionDuplicateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefinitionDuplicateComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionDuplicateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
