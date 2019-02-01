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
