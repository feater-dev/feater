/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AssetListComponent } from './asset-list.component';

describe('AssetListComponent', () => {
    let component: AssetListComponent;
    let fixture: ComponentFixture<AssetListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssetListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
