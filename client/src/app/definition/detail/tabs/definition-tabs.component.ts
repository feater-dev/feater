import {Component, Input} from '@angular/core';

export enum DefinitionTabs {
    summary,
    recipe,
    deployKeys,
    predictedEnvironment,
    predictedSubstitutions,
    instances,
}

@Component({
    selector: 'app-definition-tabs',
    templateUrl: './definition-tabs.component.html',
    styles: []
})
export class DefinitionTabsComponent {

    readonly definitionTabs = DefinitionTabs;

    @Input() definitionId: string;

    @Input() activeTab: DefinitionTabs;

}
