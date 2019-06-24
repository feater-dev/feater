/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {DefinitionRecipeComponent} from './definition-recipe.component';

describe('DefinitionRecipeComponent', () => {
    let component: DefinitionRecipeComponent;
    let fixture: ComponentFixture<DefinitionRecipeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DefinitionRecipeComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionRecipeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
