import { Component, Input } from '@angular/core';
import { CustomEnvVarFormElement } from './custom-env-var-form-element';

@Component({
    selector: 'app-custom-env-vars-form-element',
    templateUrl: './custom-env-vars-form-element.component.html',
    styles: [],
})
export class CustomEnvVarsFormElementComponent {
    @Input() customEnvVars: CustomEnvVarFormElement[];

    addCustomEnvVar() {
        this.customEnvVars.push({
            name: '',
            value: '',
        });
    }

    deleteCustomEnvVar(i: number): void {
        this.customEnvVars.splice(i, 1);
    }

    trackByIndex(index: number, obj: any): any {
        return index;
    }
}
