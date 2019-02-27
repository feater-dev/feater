import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {TaskFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-before-build-task-copy-form-element',
    templateUrl: './definition-add.before-build-task-copy-form-element.component.html',
    styles: []
})
export class DefinitionAddBeforeBuildTaskCopyFormElementComponent implements OnInit {

    @Input() item: TaskFormElement;

    @Output() deleteItem: EventEmitter<TaskFormElement> =
        new EventEmitter<TaskFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteItem.emit(this.item);
    }

}
