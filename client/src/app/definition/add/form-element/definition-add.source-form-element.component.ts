import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {
    DefinitionSourceFormElement,
    BeforeBuildTaskFormElement,
    TaskFormElement,
    InterpolateTaskFormElement,
} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-source-form-element',
    templateUrl: './definition-add.source-form-element.component.html',
    styles: []
})
export class DefinitionAddSourceFormElementComponent implements OnInit {

    @Input() source: DefinitionSourceFormElement;

    @Output() deleteSource: EventEmitter<DefinitionSourceFormElement> =
        new EventEmitter<DefinitionSourceFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteSource.emit(this.source);
    }

    isBeforeBuildTaskCopy(beforeBuildTask: BeforeBuildTaskFormElement) {
        return ('copy' === beforeBuildTask.type);
    }

    isBeforeBuildTaskInterpolate(beforeBuildTask: BeforeBuildTaskFormElement) {
        return ('interpolate' === beforeBuildTask.type);
    }

    addBeforeBuildTaskCopy() {
        this.source.beforeBuildTasks.push(<TaskFormElement>{
            type: 'copy',
            sourceRelativePath: '',
            destinationRelativePath: ''
        });
    }

    addBeforeBuildTaskInterpolate() {
        this.source.beforeBuildTasks.push(<InterpolateTaskFormElement>{

            type: 'interpolate',
            relativePath: ''
        });
    }

    deleteBeforeBuildTask(beforeBuildTask: BeforeBuildTaskFormElement) {
        const index = this.source.beforeBuildTasks.indexOf(beforeBuildTask);
        if (-1 !== index) {
            this.source.beforeBuildTasks.splice(index, 1);
        }
    }
}
