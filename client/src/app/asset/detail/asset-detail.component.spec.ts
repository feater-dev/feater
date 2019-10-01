/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AssetDetailComponent } from './asset-detail.component';

describe('AssetDetailComponent', () => {
    let component: AssetDetailComponent;
    let fixture: ComponentFixture<AssetDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AssetDetailComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AssetDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
