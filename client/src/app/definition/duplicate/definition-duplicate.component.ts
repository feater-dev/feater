import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import {
    getDefinitionRecipeQueryGql,
    GetDefinitionRecipeQueryInterface,
    GetDefinitionRecipeQueryDefinitionFieldInterface,
} from './get-definition-recipe.query';
import { DefinitionAddComponent } from '../add/definition-add.component';
import { RecipeFormElement } from '../recipe-form/recipe-form.model';

interface DefinitionDuplicateForm {
    name: string;
    recipe: RecipeFormElement;
}

@Component({
    selector: 'app-definition-duplicate',
    templateUrl: './definition-duplicate.component.html',
    styles: [],
})
export class DefinitionDuplicateComponent extends DefinitionAddComponent
    implements OnInit {
    action = 'duplicate';

    definition: DefinitionDuplicateForm;

    sourceDefinition: {
        name: string;
    };

    ngOnInit() {
        this.getSourceDefinition();
    }

    protected getSourceDefinition(): void {
        this.spinner.show();
        this.route.params
            .pipe(
                switchMap((params: Params) => {
                    return this.apollo
                        .watchQuery<GetDefinitionRecipeQueryInterface>({
                            query: getDefinitionRecipeQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges.pipe(
                            map(result => {
                                return result.data.definition;
                            }),
                        );
                }),
            )
            .subscribe(
                (
                    definition: GetDefinitionRecipeQueryDefinitionFieldInterface,
                ) => {
                    this.project = definition.project;
                    this.sourceDefinition = {
                        name: definition.name,
                    };
                    this.definition.name = `${definition.name} - copy`;
                    this.definition.recipe = this.definitionRecipeYamlMapperComponent.map(
                        definition.recipeAsYaml,
                    );
                    this.spinner.hide();
                },
            );
    }
}
