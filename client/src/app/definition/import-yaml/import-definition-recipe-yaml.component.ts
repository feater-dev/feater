import {Component, EventEmitter, Output} from '@angular/core';
import {DefinitionRecipeFormElement} from '../recipe-form/definition-recipe-form.model';
import {DefinitionRecipeYamlMapperService} from './definition-recipe-yaml-mapper.service';


@Component({
    selector: 'app-import-definition-recipe-yaml',
    templateUrl: './import-definition-recipe-yaml.component.html',
    styles: []
})
export class ImportDefinitionRecipeYamlComponent {

    recipeYaml = '';

    @Output() importRecipeYaml = new EventEmitter<DefinitionRecipeFormElement>();

    constructor(
        protected readonly definitionRecipeYamlMapperComponent: DefinitionRecipeYamlMapperService,
    ) {}

    import(): void {
        this.importRecipeYaml.emit(
            this.definitionRecipeYamlMapperComponent.map(this.recipeYaml),
        );
        this.recipeYaml = '';
    }

}
