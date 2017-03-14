import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
    BuildDefinitionAddFormComponentFormElement,
    BuildDefinitionAddFormBeforeBuildTaskFormElement,
    BuildDefinitionAddFormBeforeBuildCopyTaskFormElement,
    BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement
} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-component-form-element',
    template: `
        <div class="well well-sm">
            <div class="form-group">
                <label class="col-lg-2 control-label">Id</label>
                <div class="col-lg-8">
                    <input type="text" class="form-control" [(ngModel)]="item.id">
                </div>
                <div class="col-lg-2">
                    <a
                        class="btn btn-danger btn-sm pull-right"
                        style="position: relative; top: 8px;"
                        (click)="onDeleteItem()"
                    >
                        Delete component
                    </a>
                </div>
            </div>
            <div class="form-group">
                <label class="col-lg-2 control-label">GitHub repository</label>
                <div class="col-lg-10">
                    <input type="text" class="form-control" [(ngModel)]="item.source.name">
                </div>
            </div>
            <div class="form-group">
                <label class="col-lg-2 control-label">Source reference</label>
                <div class="col-lg-3">
                    <select class="form-control" [(ngModel)]="item.reference.type">
                        <option></option>
                        <option value="tag">Tag</option>
                        <option value="branch" selected>Branch</option>
                        <option value="commit">Commit</option>
                    </select>
                </div>
                <div class="col-lg-7">
                    <input type="text" class="form-control" [(ngModel)]="item.reference.name">
                </div>
            </div>

            <hr style="border-color: rgba(44,62,80,0.15);">

            <div *ngFor="let beforeBuildTask of item.beforeBuildTasks">

                <app-build-definition-add-before-build-task-copy-form-element
                    *ngIf="isBeforeBuildTaskCopy(beforeBuildTask)"
                    [item]="beforeBuildTask"
                    (deleteItem)="deleteBeforeBuildTask($event)"
                ></app-build-definition-add-before-build-task-copy-form-element>

                <app-build-definition-add-before-build-task-interpolate-form-element
                    *ngIf="isBeforeBuildTaskInterpolate(beforeBuildTask)"
                    [item]="beforeBuildTask"
                    (deleteItem)="deleteBeforeBuildTask($event)"
                ></app-build-definition-add-before-build-task-interpolate-form-element>

            </div>

            <div class="form-group">
                <div class="col-lg-12">
                    <a class="btn btn-success btn-sm" (click)="addBeforeBuildTaskCopy()">Add copy before build task</a>
                    <a class="btn btn-success btn-sm" (click)="addBeforeBuildTaskInterpolate()">Add interpolate before build task</a>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class BuildDefinitionAddComponentFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormComponentFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormComponentFormElement> = new EventEmitter<BuildDefinitionAddFormComponentFormElement>();

    ngOnInit() {}

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

    isBeforeBuildTaskCopy(beforeBuildTask: BuildDefinitionAddFormBeforeBuildTaskFormElement) {
        return ('copy' === beforeBuildTask.type);
    }

    isBeforeBuildTaskInterpolate(beforeBuildTask: BuildDefinitionAddFormBeforeBuildTaskFormElement) {
        return ('interpolate' === beforeBuildTask.type);
    }

    addBeforeBuildTaskCopy() {
        this.item.beforeBuildTasks.push(<BuildDefinitionAddFormBeforeBuildCopyTaskFormElement>{
            type: 'copy',
            sourceRelativePath: '',
            destinationRelativePath: ''
        });
    }

    addBeforeBuildTaskInterpolate() {
        this.item.beforeBuildTasks.push(<BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement>{
            type: 'interpolate',
            relativePath: ''
        });
    }

    deleteBeforeBuildTask(beforeBuildTask: BuildDefinitionAddFormBeforeBuildTaskFormElement) {
        var index = this.item.beforeBuildTasks.indexOf(beforeBuildTask);
        if (-1 !== index) {
            this.item.beforeBuildTasks.splice(index, 1);
        }
    }
}
