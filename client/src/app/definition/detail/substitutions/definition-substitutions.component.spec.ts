/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefinitionSubstitutionsComponent } from './definition-substitutions.component';

describe('DefinitionSubstitutionsComponent', () => {
    let component: DefinitionSubstitutionsComponent;
    let fixture: ComponentFixture<DefinitionSubstitutionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionSubstitutionsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionSubstitutionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
