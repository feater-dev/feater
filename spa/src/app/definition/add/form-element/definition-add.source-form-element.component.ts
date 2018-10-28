import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    DefinitionAddFormSourceFormElement,
    BeforeBuildTaskFormElement,
    TaskFormElement,
    InterpolateTaskFormElement,
} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-source-form-element',
    templateUrl: './definition-add.source-form-element.component.html',
    styles: []
})
export class DefinitionAddSourceFormElementComponent implements OnInit {

    @Input() item: DefinitionAddFormSourceFormElement;

    @Output() deleteItem: EventEmitter<DefinitionAddFormSourceFormElement> =
        new EventEmitter<DefinitionAddFormSourceFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteItem.emit(this.item);
    }

    isBeforeBuildTaskCopy(beforeBuildTask: BeforeBuildTaskFormElement) {
        return ('copy' === beforeBuildTask.type);
    }

    isBeforeBuildTaskInterpolate(beforeBuildTask: BeforeBuildTaskFormElement) {
        return ('interpolate' === beforeBuildTask.type);
    }

    addBeforeBuildTaskCopy() {
        this.item.beforeBuildTasks.push(<TaskFormElement>{
            type: 'copy',
            sourceRelativePath: '',
            destinationRelativePath: ''
        });
    }

    addBeforeBuildTaskInterpolate() {
        this.item.beforeBuildTasks.push(<InterpolateTaskFormElement>{

            type: 'interpolate',
            relativePath: ''
        });
    }

    deleteBeforeBuildTask(beforeBuildTask: BeforeBuildTaskFormElement) {
        const index = this.item.beforeBuildTasks.indexOf(beforeBuildTask);
        if (-1 !== index) {
            this.item.beforeBuildTasks.splice(index, 1);
        }
    }
}
