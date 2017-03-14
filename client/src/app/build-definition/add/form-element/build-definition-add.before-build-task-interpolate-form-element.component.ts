import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement } from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-before-build-task-interpolate-form-element',
    template: `
        <div class="form-group">
            <label class="col-lg-2 control-label">Interpolate source</label>
            <div class="col-lg-8">
                <input type="text" class="form-control" [(ngModel)]="item.relativePath">
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
export class BuildDefinitionAddBeforeBuildTaskInterpolateFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement> = new EventEmitter<BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

}
