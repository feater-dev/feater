import {Component, OnInit} from '@angular/core';
import {Params} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {
    getDefinitionConfigQueryGql,
    GetDefinitionConfigQueryInterface,
    GetDefinitionConfigQueryDefinitionFieldInterface,
} from './get-definition-config.query';
import {DefinitionAddComponent} from '../add/definition-add.component';
import {DefinitionConfigFormElement} from '../config-form/definition-config-form.model';


interface DefinitionDuplicateForm {
    name: string;
    config: DefinitionConfigFormElement;
}

@Component({
    selector: 'app-definition-duplicate',
    templateUrl: './definition-duplicate.component.html',
    styles: []
})
export class DefinitionDuplicateComponent extends DefinitionAddComponent implements OnInit {

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
                    this.definition.config = this.definitionConfigYamlMapperComponent.map(definition.configAsYaml);
                    this.spinner.hide();
                }
            );
    }

}
