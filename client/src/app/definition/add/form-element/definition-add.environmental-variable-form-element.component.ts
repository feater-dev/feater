import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EnvVariableFormElement } from '../../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-add-environmental-variable-form-element',
    templateUrl:
        './definition-add.environmental-variable-form-element.component.html',
    styles: [],
})
export class DefinitionAddEnvVariableFormElementComponent {
    @Input() envVariable: EnvVariableFormElement;

    @Output() deleteEnvVariable: EventEmitter<
        EnvVariableFormElement
    > = new EventEmitter<EnvVariableFormElement>();

    delete(): void {
        this.deleteEnvVariable.emit(this.envVariable);
    }
}
