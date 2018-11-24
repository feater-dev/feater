import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {jsonToGraphQLQuery} from 'json-to-graphql-query';
import {NgxSpinnerService} from 'ngx-spinner';
import * as _ from 'lodash';
import * as jsYaml from 'js-yaml';
import * as camelCaseKeys from 'camelcase-keys';
import {
    DefinitionAddForm,
    DefinitionAddFormSourceFormElement,
    DefinitionAddFormVolumeFormElement,
    DefinitionAddFormProxiedPortFormElement,
    DefinitionAddFormEnvVariableFormElement,
    DefinitionAddFormSummaryItemFormElement,
    DefinitionAddFormConfigFormElement,
    ExecuteHostCommandTaskFormElement,
    ExecuteServiceCommandTaskFormElement,
    AfterBuildTaskFormElement,
    CopyAssetIntoContainerTaskFormElement,
} from './../add/definition-add-form.model';
import {
    getDefinitionConfigQueryGql,
    GetDefinitionConfigQueryInterface,
    GetDefinitionConfigQueryDefinitionFieldInterface,
} from './get-definition-config.query';
import {DefinitionAddComponent} from '../add/definition-add.component';


@Component({
    selector: 'app-definition-duplicate',
    templateUrl: './../add/definition-add.component.html',
    styles: []
})
export class DefinitionDuplicateComponent extends DefinitionAddComponent implements OnInit {

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
                    this.item.name = `${item.name} - copy`;
                    this.importYamlConfig(item.configAsYaml);
                    this.spinner.hide();
                }
            );
    }

}
