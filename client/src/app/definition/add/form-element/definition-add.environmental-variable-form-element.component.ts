import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import {DefinitionEnvVariableFormElement} from '../../config-form/definition-config-form.model';


@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl: './definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class DefinitionAddEnvVariableFormElementComponent implements OnInit {

    @Input() envVariable: DefinitionEnvVariableFormElement;

    @Output() deleteEnvVariable: EventEmitter<DefinitionEnvVariableFormElement> =
        new EventEmitter<DefinitionEnvVariableFormElement>();

    ngOnInit() {}

    delete() {
        this.deleteEnvVariable.emit(this.envVariable);
    }
}
