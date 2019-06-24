import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {
    getDefinitionRecipeQueryGql,
    GetDefinitionRecipeQueryInterface,
    GetDefinitionRecipeQueryDefinitionFieldInterface,
} from '../duplicate/get-definition-recipe.query';
import {DefinitionAddComponent} from '../add/definition-add.component';
import gql from 'graphql-tag';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {DefinitionRecipeFormElement} from '../recipe-form/definition-recipe-form.model';


interface DefinitionEditForm {
    id: string;
    name: string;
    recipe: DefinitionRecipeFormElement;
}

@Component({
    selector: 'app-definition-edit',
    templateUrl: './definition-edit.component.html',
    styles: []
})
export class DefinitionEditComponent extends DefinitionAddComponent implements OnInit {

    static readonly actionEdit = 'edit';

    definition: DefinitionEditForm;

    action = DefinitionEditComponent.actionEdit;

    sourceDefinition: {
        name: string;
    };

    ngOnInit() {
        this.getSourceDefinition();
    }

    protected getSourceDefinition(): void {
        this.spinner.show();
        this.route.params.pipe(
            switchMap(
                (params: Params) => {
                    return this.apollo
                        .watchQuery<GetDefinitionRecipeQueryInterface>({
                            query: getDefinitionRecipeQueryGql,
                            variables: {
                                id: params['id'],
                            },
                        })
                        .valueChanges
                        .pipe(
                            map(result => {
                                return result.data.definition;
                            })
                        );
                }
            ))
            .subscribe(
                (definition: GetDefinitionRecipeQueryDefinitionFieldInterface) => {
                    this.project = definition.project;
                    this.sourceDefinition = {
                        name: definition.name,
                    };
                    this.definition.id = definition.id;
                    this.definition.name = definition.name;
                    this.definition.recipe = this.definitionRecipeYamlMapperComponent.map(definition.recipeAsYaml);
                    this.spinner.hide();
                }
            );
    }

    createDefinition(): void {
        this.spinner.show();
        this.apollo.mutate({
            mutation: gql`${this.getUpdateDefinitionMutation()}`,
        }).subscribe(
            ({data}) => {
                this.spinner.hide();
                this.toastr.success(`Definition <em>${data.updateDefinition.name}</em> updated.`);
                this.router.navigate(['/definition', data.updateDefinition.id]);
            },
            () => {
                this.spinner.hide();
                this.toastr.error(`Failed to update definition <em>${this.definition.name}</em>.`);
            }
        );
    }

    protected mapDefinitionToDto(): any {
        const mappedItem = super.mapDefinitionToDto();
        delete mappedItem.projectId;
        mappedItem.id = this.definition.id;

        return mappedItem;
    }

    protected getUpdateDefinitionMutation(): string {
        const mutation = {
            mutation: {
                updateDefinition: {
                    __args: this.mapDefinitionToDto(),
                    id: true,
                    name: true,
                }
            }
        };

        return jsonToGraphQLQuery(mutation);
    }
}
