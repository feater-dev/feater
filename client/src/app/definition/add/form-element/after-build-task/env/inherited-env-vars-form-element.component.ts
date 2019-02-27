import {Component, Input} from '@angular/core';
import {InheritedEnvVarFormElement} from './inherited-env-var-form-element';


@Component({
    selector: 'app-inherited-env-vars-form-element',
    templateUrl: './inherited-env-vars-form-element.component.html',
    styles: []
})
export class InheritedEnvVarsFormElementComponent {

    @Input() inheritedEnvVars: InheritedEnvVarFormElement[];

    @Input() availableEnvVarNames: string[];

    addInheritedEnvVar(): void {
        this.inheritedEnvVars.push({
            name: '',
            alias: '',
        });
    }

    deleteInheritedEnvVar(i: number): void {
        this.inheritedEnvVars.splice(i, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }

}
