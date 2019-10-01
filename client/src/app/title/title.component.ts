import { Component, EventEmitter, Input } from '@angular/core';

export enum ActionButtonType {
    success,
    danger,
}

export interface ActionButtonInterface {
    type: ActionButtonType;
    label: string;
    routerLink?: string;
    eventEmitter?: EventEmitter<void>;
}

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styles: [],
})
export class TitleComponent {
    @Input() title: string;

    @Input() context: string;

    @Input() actions: ActionButtonInterface[];

    readonly actionButtonType = ActionButtonType;
}
