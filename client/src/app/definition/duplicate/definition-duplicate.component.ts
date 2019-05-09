import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
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

    action = 'duplicate';

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
                    this.definition.name = `${definition.name} - copy`;
                    this.importYamlConfig(definition.configAsYaml);
                    this.spinner.hide();
                }
            );
    }

}
