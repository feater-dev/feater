import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface ConfirmModel {
    title: string;
    message: string;
    ok: string;
    cancel: string;
}

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean>
    implements ConfirmModel {
    title: string;

    message: string;

    ok: string;

    cancel: string;

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    confirm() {
        this.result = true;
        this.close();
    }
}
