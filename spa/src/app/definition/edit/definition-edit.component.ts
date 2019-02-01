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
import {DefinitionEditForm, ExecuteHostCommandTaskFormElement} from '../add/definition-add-form.model';
import * as _ from 'lodash';


@Component({
    selector: 'app-definition-edit',
    templateUrl: './../add/definition-add.component.html',
    styles: []
})
export class DefinitionEditComponent extends DefinitionAddComponent implements OnInit {

    item: DefinitionEditForm;

    action = 'edit';

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
                (item: GetDefinitionConfigQueryDefinitionFieldInterface) => {
                    this.project = item.project;
                    this.sourceDefinition = {
                        name: item.name,
                    };
                    this.item.id = item.id;
                    this.item.name = item.name;
                    this.importYamlConfig(item.configAsYaml);
                    this.spinner.hide();
                }
            );
    }

    submit(): void {
        this.apollo.mutate({
            mutation: gql`${this.getUpdateDefinitionMutation()}`,
        }).subscribe(
            ({data}) => {
                this.router.navigate(['/definition', data.updateDefinition.id]);
            },
            (error) => {
                console.log(error);
            }
        );
    }

    protected mapItem(): any {
        for (const afterBuildTask of this.item.config.afterBuildTasks) {
            if ('executeHostCommand' === afterBuildTask.type || 'executeServiceCommand' === afterBuildTask.type) {
                this.filterAfterBuildExecuteCommandTask(afterBuildTask as ExecuteHostCommandTaskFormElement);
            }
        }

        const mappedItem = {
            id: this.item.id,
            name: this.item.name,
            config: {
                sources: this.item.config.sources,
                volumes: this.item.config.volumes,
                proxiedPorts: this.item.config.proxiedPorts.map(proxiedPort => ({
                    id: proxiedPort.id,
                    serviceId: proxiedPort.serviceId,
                    port: parseInt(proxiedPort.port, 10),
                    name: proxiedPort.name,
                })),
                envVariables: this.item.config.envVariables,
                composeFiles: [
                    this.item.config.composeFile,
                ],
                afterBuildTasks: _.cloneDeep(this.item.config.afterBuildTasks),
                summaryItems: this.item.config.summaryItems,
            },
        };

        for (const afterBuildTask of mappedItem.config.afterBuildTasks) {
            if ('' === afterBuildTask.id) {
                delete afterBuildTask.id;
            }
            if (0 === afterBuildTask.dependsOn.length) {
                delete afterBuildTask.dependsOn;
            }
        }

        return mappedItem;
    }

    protected getUpdateDefinitionMutation(): string {
        const mutation = {
            mutation: {
                updateDefinition: {
                    __args: this.mapItem(),
                    id: true,
                }
            }
        };

        return jsonToGraphQLQuery(mutation);
    }
}
