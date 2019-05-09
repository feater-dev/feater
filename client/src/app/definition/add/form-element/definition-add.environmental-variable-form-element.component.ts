import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionAddFormEnvVariableFormElement} from '../definition-add-form.model';


@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl: './definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class DefinitionAddEnvVariableFormElementComponent implements OnInit {

    @Input() envVariable: DefinitionAddFormEnvVariableFormElement;

    @Output() deleteEnvVariable: EventEmitter<DefinitionAddFormEnvVariableFormElement> =
        new EventEmitter<DefinitionAddFormEnvVariableFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteEnvVariable.emit(this.envVariable);
    }
}
