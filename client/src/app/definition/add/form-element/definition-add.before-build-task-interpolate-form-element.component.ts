import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {InterpolateTaskFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-before-build-task-interpolate-form-element',
    templateUrl: './definition-add.before-build-task-interpolate-form-element.component.html',
    styles: []
})
export class DefinitionAddBeforeBuildTaskInterpolateFormElementComponent implements OnInit {

    @Input() task: InterpolateTaskFormElement;

    @Output() deleteTask: EventEmitter<InterpolateTaskFormElement> =
        new EventEmitter<InterpolateTaskFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteTask.emit(this.task);
    }

}
