/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {AssetTableComponent} from './asset-table.component';

describe('AssetTableComponent', () => {
    let component: AssetTableComponent;
    let fixture: ComponentFixture<AssetTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ AssetTableComponent ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
