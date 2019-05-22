import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {
    getDefinitionConfigQueryGql,
    GetDefinitionConfigQueryInterface,
    GetDefinitionConfigQueryDefinitionFieldInterface,
} from './../duplicate/get-definition-config.query';
import {DefinitionAddComponent} from '../add/definition-add.component';
import gql from 'graphql-tag';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {DefinitionConfigFormElement} from '../config-form/definition-config-form.model';


interface DefinitionEditForm {
    id: string;
    name: string;
    config: DefinitionConfigFormElement;
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
                        .watchQuery<GetDefinitionConfigQueryInterface>({
                            query: getDefinitionConfigQueryGql,
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
                (definition: GetDefinitionConfigQueryDefinitionFieldInterface) => {
                    this.project = definition.project;
                    this.sourceDefinition = {
                        name: definition.name,
                    };
                    this.definition.id = definition.id;
                    this.definition.name = definition.name;
                    this.definition.config = this.definitionConfigYamlMapperComponent.map(definition.configAsYaml);
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
