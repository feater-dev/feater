/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DefinitionTabsComponent } from './definition-tabs.component';

describe('DefinitionTabsComponent', () => {
    let component: DefinitionTabsComponent;
    let fixture: ComponentFixture<DefinitionTabsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DefinitionTabsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DefinitionTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
