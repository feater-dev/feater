import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    GetDefinitionSummaryQueryDefinitionFieldInterface,
    GetDefinitionSummaryQueryInterface,
    getDefinitionSummaryQueryGql,
} from './get-definition-summary.query';
import gql from 'graphql-tag';
import { DialogService } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from '../../../modal/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { DefinitionTabs } from '../tabs/definition-tabs.component';

@Component({
    selector: 'app-definition-summary',
    templateUrl: './definition-summary.component.html',
    styles: [],
})
export class DefinitionSummaryComponent implements OnInit {
    readonly definitionTabs = DefinitionTabs;

    definition: GetDefinitionSummaryQueryDefinitionFieldInterface;

    protected readonly removeDefinitionMutation = gql`
        mutation($id: String!) {
            removeDefinition(id: $id)
        }
    `;

    constructor(
        protected route: ActivatedRoute,
        protected router: Router,
        protected apollo: Apollo,
        protected spinner: NgxSpinnerService,
        protected dialogService: DialogService,
        protected toastr: ToastrService,
    ) {}

    ngOnInit() {
        this.getDefinition();
    }

    removeDefinition() {
        if (this.definition.instances.length) {
            return;
        }

        this.dialogService
            .addDialog(ConfirmComponent, {
                title: 'Confirm',
                message:
                    'Are you sure you wish to remove this defintion? This operation cannot be reversed.',
                ok: 'Confirm removal',
                cancel: 'Cancel',
            })
            .subscribe(isConfirmed => {
                if (!isConfirmed) {
                    return;
                }
                this.apollo
                    .mutate({
                        mutation: this.removeDefinitionMutation,
                        variables: {
                            id: this.definition.id,
                        },
                    })
                    .subscribe(
                        () => {
                            this.toastr.success(
                                `Definition <em>${this.definition.name}</em> removed.`,
                            );
                            this.router.navigateByUrl(
                                `/project/${this.definition.project.id}`,
                            );
                        },
                        error => {
                            this.toastr.error(
                                `Failed to remove definition <em>${this.definition.name}</em>.`,
                            );
                        },
                    );
            });
    }

    protected getDefinition() {
        this.spinner.show();
        this.apollo
            .watchQuery<GetDefinitionSummaryQueryInterface>({
                query: getDefinitionSummaryQueryGql,
                variables: {
                    id: this.route.snapshot.params['id'],
                },
            })
            .valueChanges.subscribe(result => {
                const resultData: GetDefinitionSummaryQueryInterface =
                    result.data;
                this.definition = resultData.definition;
                this.spinner.hide();
            });
    }
}
