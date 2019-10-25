import { Component, EventEmitter, Output } from '@angular/core';
import { RecipeFormElement } from '../recipe-form/recipe-form.model';
import { RecipeYamlMapperService } from './recipe-yaml-mapper.service';

@Component({
    selector: 'app-import-definition-recipe-yaml',
    templateUrl: './import-definition-recipe-yaml.component.html',
    styles: [],
})
export class ImportDefinitionRecipeYamlComponent {
    recipeYaml = '';

    @Output() importRecipeYaml = new EventEmitter<RecipeFormElement>();

    constructor(
        protected readonly definitionRecipeYamlMapperComponent: RecipeYamlMapperService,
    ) {}

    import(): void {
        this.importRecipeYaml.emit(
            this.definitionRecipeYamlMapperComponent.map(this.recipeYaml),
        );
        this.recipeYaml = '';
    }
}
