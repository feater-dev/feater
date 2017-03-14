import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormEnvironmentalVariableFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-environmental-variable-form-element',
    template: `
        <div class="well well-sm">
            <div class="form-group">
                <label class="col-lg-1 control-label">Name</label>
                <div class="col-lg-3">
                    <input type="text" class="form-control" [(ngModel)]="item.name">
                </div>
                <label class="col-lg-1 control-label">Value</label>
                <div class="col-lg-4">
                    <input type="text" class="form-control" [(ngModel)]="item.value">
                </div>
                <div class="col-lg-3" style="text-align: right;">
                    <a
                        class="btn btn-danger btn-sm"
                        style="position: relative; top: 8px;"
                        (click)="onDeleteItem()"
                    >
                        Delete environmental variable
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddEnvironmentalVariableFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormEnvironmentalVariableFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormEnvironmentalVariableFormElement> = new EventEmitter<BuildDefinitionAddFormEnvironmentalVariableFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }
}
