import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {
    BuildDefinitionAddFormSourceFormElement,
    BuildDefinitionAddFormBeforeBuildTaskFormElement,
    BuildDefinitionAddFormBeforeBuildCopyTaskFormElement,
    BuildDefinitionAddFormBeforeBuildInterpolateTaskFormElement
} from '../../build-definition-add-form.model';

@Component({
    selector: 'app-build-definition-add-source-form-element',
    templateUrl: './build-definition-add.source-form-element.component.html',
    styles: []
})
export class BuildDefinitionAddSourceFormElementComponent implements OnInit {

    @Input() item: BuildDefinitionAddFormSourceFormElement;

    @Output() deleteItem: EventEmitter<BuildDefinitionAddFormSourceFormElement> =
        new EventEmitter<BuildDefinitionAddFormSourceFormElement>();

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
