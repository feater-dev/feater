/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {ImportDefinitionConfigYamlComponent} from './import-definition-config-yaml.component';

describe('ImportDefinitionConfigYamlComponent', () => {
    let component: ImportDefinitionConfigYamlComponent;
    let fixture: ComponentFixture<ImportDefinitionConfigYamlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ImportDefinitionConfigYamlComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImportDefinitionConfigYamlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
