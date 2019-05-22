import {Component, EventEmitter, Output} from '@angular/core';
import {DefinitionConfigFormElement} from '../config-form/definition-config-form.model';
import {DefinitionConfigYamlMapperService} from './definition-config-yaml-mapper.service';


@Component({
    selector: 'app-import-definition-config-yaml',
    templateUrl: './import-definition-config-yaml.component.html',
    styles: []
})
export class ImportDefinitionConfigYamlComponent {

    configYaml = '';

    @Output() importConfigYaml = new EventEmitter<DefinitionConfigFormElement>();

    import(): void {
        this.importConfigYaml.emit(
            this.definitionConfigYamlMapperComponent.map(this.configYaml),
        );
        this.configYaml = '';
    }

    constructor(
        protected readonly definitionConfigYamlMapperComponent: DefinitionConfigYamlMapperService,
    ) {}

}
