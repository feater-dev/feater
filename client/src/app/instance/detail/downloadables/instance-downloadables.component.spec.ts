/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceDownloadablesComponent } from './instance-downloadables.component';

describe('InstanceDownloadablesComponent', () => {
    let component: InstanceDownloadablesComponent;
    let fixture: ComponentFixture<InstanceDownloadablesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceDownloadablesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceDownloadablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
