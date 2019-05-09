import {Component, Input} from '@angular/core';

export enum InstanceTabs {
    summary,
    environment,
    services,
    proxyDomains,
    buildLogs,
}

@Component({
    selector: 'app-instance-tabs',
    templateUrl: './instance-tabs.component.html',
    styles: []
})
export class InstanceTabsComponent {

    readonly instanceTabs = InstanceTabs;

    @Input() instanceId: string;

    @Input() activeTab: InstanceTabs;

}
