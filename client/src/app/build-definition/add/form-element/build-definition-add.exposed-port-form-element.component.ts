import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormExposedPortFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-external-port-form-element',
    template: `
        <div class="well well-sm">
            <div class="form-group">
                <label class="col-lg-1 control-label">Service</label>
                <div class="col-lg-1">
                    <input type="text" class="form-control" [(ngModel)]="item.serviceId">
                </div>
                <label class="col-lg-1 control-label">Id</label>
                <div class="col-lg-1">
                    <input type="text" class="form-control" [(ngModel)]="item.id">
                </div>
                <label class="col-lg-1 control-label">Name</label>
                <div class="col-lg-3">
                    <input type="text" class="form-control" [(ngModel)]="item.name">
                </div>
                <label class="col-lg-1 control-label">Port</label>
                <div class="col-lg-1">
                    <input type="text" class="form-control" [(ngModel)]="item.port">
                </div>
                <div class="col-lg-2" style="text-align: right;">
                    <a
                        class="btn btn-danger btn-sm"
                        style="position: relative; top: 8px;"
                        (click)="onDeleteItem()"
                    >
                        Delete external port
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddExposedPortFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormExposedPortFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormExposedPortFormElement> = new EventEmitter<BuildDefinitionAddFormExposedPortFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
