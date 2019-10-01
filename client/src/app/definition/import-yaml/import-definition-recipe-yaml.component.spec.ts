/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ImportDefinitionRecipeYamlComponent } from './import-definition-recipe-yaml.component';

describe('ImportDefinitionRecipeYamlComponent', () => {
    let component: ImportDefinitionRecipeYamlComponent;
    let fixture: ComponentFixture<ImportDefinitionRecipeYamlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImportDefinitionRecipeYamlComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportDefinitionRecipeYamlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
