/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InstanceListComponent } from './instance-list.component';

describe('InstanceListComponent', () => {
    let component: InstanceListComponent;
    let fixture: ComponentFixture<InstanceListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstanceListComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstanceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
