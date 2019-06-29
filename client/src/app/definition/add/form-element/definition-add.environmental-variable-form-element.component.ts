import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DefinitionEnvVariableFormElement} from '../../recipe-form/definition-recipe-form.model';


@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl: './definition-add.environmental-variable-form-element.component.html',
    styles: []
})
export class DefinitionAddEnvVariableFormElementComponent {

    @Input() envVariable: DefinitionEnvVariableFormElement;

    @Output() deleteEnvVariable: EventEmitter<DefinitionEnvVariableFormElement> =
        new EventEmitter<DefinitionEnvVariableFormElement>();

    delete(): void {
        this.deleteEnvVariable.emit(this.envVariable);
    }
}
