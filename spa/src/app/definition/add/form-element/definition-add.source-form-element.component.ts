import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {
    DefinitionAddFormSourceFormElement,
    DefinitionAddFormBeforeBuildTaskFormElement,
    DefinitionAddFormBeforeBuildCopyTaskFormElement,
    DefinitionAddFormBeforeBuildInterpolateTaskFormElement,
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

    onDeleteItem() {
        this.deleteItem.emit(this.item);
    }

    isBeforeBuildTaskCopy(beforeBuildTask: DefinitionAddFormBeforeBuildTaskFormElement) {
        return ('copy' === beforeBuildTask.type);
    }

    isBeforeBuildTaskInterpolate(beforeBuildTask: DefinitionAddFormBeforeBuildTaskFormElement) {
        return ('interpolate' === beforeBuildTask.type);
    }

    addBeforeBuildTaskCopy() {
        this.item.beforeBuildTasks.push(<DefinitionAddFormBeforeBuildCopyTaskFormElement>{
            type: 'copy',
            sourceRelativePath: '',
            destinationRelativePath: ''
        });
    }

    addBeforeBuildTaskInterpolate() {
        this.item.beforeBuildTasks.push(<DefinitionAddFormBeforeBuildInterpolateTaskFormElement>{
            type: 'interpolate',
            relativePath: ''
        });
    }

    deleteBeforeBuildTask(beforeBuildTask: DefinitionAddFormBeforeBuildTaskFormElement) {
        var index = this.item.beforeBuildTasks.indexOf(beforeBuildTask);
        if (-1 !== index) {
            this.item.beforeBuildTasks.splice(index, 1);
        }
    }
}
