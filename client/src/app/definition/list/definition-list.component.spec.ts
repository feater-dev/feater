/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DefinitionListComponent} from './definition-list.component';


describe('DefinitionListComponent', () => {
    let component: DefinitionListComponent;
    let fixture: ComponentFixture<DefinitionListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefinitionListComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
