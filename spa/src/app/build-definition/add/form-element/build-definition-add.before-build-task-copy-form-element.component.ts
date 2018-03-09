import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormBeforeBuildCopyTaskFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-before-build-task-copy-form-element',
    template: `
        <div class="form-group">
            <label class="col-lg-2 control-label">Copy source</label>
            <div class="col-lg-3">
                <input type="text" class="form-control" [(ngModel)]="item.sourceRelativePath">
            </div>
            <label class="col-lg-2 control-label">to destination</label>
            <div class="col-lg-3">
                <input type="text" class="form-control" [(ngModel)]="item.destinationRelativePath">
            </div>
            <div class="col-lg-2">
                <a
                    class="btn btn-danger btn-sm pull-right"
                    style="position: relative; top: 8px;"
                    (click)="onDeleteItem()"
                >
                    Delete before build task
                </a>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddBeforeBuildTaskCopyFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormBeforeBuildCopyTaskFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormBeforeBuildCopyTaskFormElement> = new EventEmitter<BuildDefinitionAddFormBeforeBuildCopyTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
