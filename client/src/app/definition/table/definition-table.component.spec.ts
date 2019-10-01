/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefinitionTableComponent } from './definition-table.component';

describe('DefinitionTableComponent', () => {
    let component: DefinitionTableComponent;
    let fixture: ComponentFixture<DefinitionTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
