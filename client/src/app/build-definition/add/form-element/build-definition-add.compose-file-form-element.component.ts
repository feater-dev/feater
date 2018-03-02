import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
    BuildDefinitionAddFormSourceFormElement,
    BuildDefinitionAddComposeFileFormElement
} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-compose-file-form-element',
    template: `
        <div class="well well-sm">
            <div class="form-group">
                <label class="col-lg-2 control-label">Source id</label>
                <div class="col-lg-2">
                    <select class="form-control" [(ngModel)]="item.sourceId">
                        <option></option>
                        <option *ngFor="let source of sources" [value]="source.id" selected>{{ source.id }}</option>
                    </select>
                </div>
                <label class="col-lg-2 control-label">Relative path</label>
                <div class="col-lg-6">
                    <input type="text" class="form-control" [(ngModel)]="item.relativePath">
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddComposeFileFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddComposeFileFormElement;

    @Input() sources: BuildDefinitionAddFormSourceFormElement[];

    ngOnInit() {}

}
