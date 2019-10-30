import { Component, Input } from '@angular/core';
import { RecipeFormElement } from '../recipe-form/recipe-form.model';

@Component({
    selector: 'app-definition-recipe-simplified-form',
    templateUrl: './definition-recipe-simplified-form.component.html',
    styles: [],
})
export class DefinitionRecipeSimplifiedFormComponent {
    @Input() recipe: RecipeFormElement;
}
