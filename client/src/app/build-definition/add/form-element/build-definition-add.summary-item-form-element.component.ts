import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormSummaryItemFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-summary-item-form-element',
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
                        Delete summary item
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddSummaryItemFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormSummaryItemFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormSummaryItemFormElement> = new EventEmitter<BuildDefinitionAddFormSummaryItemFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
