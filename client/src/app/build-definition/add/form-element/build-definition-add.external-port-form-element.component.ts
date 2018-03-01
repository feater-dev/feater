import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormExternalPortFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-external-port-form-element',
    template: `
        <div class="well well-sm">
            <div class="form-group">
                <label class="col-lg-1 control-label">Id</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" [(ngModel)]="item.id">
                </div>
                <label class="col-lg-1 control-label">Port</label>
                <div class="col-lg-3">
                    <input type="text" class="form-control" [(ngModel)]="item.port">
                </div>
                <div class="col-lg-3" style="text-align: right;">
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
export class BuildDefinitionAddExternalPortFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormExternalPortFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormExternalPortFormElement> = new EventEmitter<BuildDefinitionAddFormExternalPortFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
