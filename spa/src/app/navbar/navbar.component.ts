import { environment } from './../../environments/environment';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    template: `
        <div class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" style="cursor: pointer;" (click)="goToHomepage()">XSolve Feat</a>
                    <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>
                <div class="navbar-collapse collapse" id="navbar-main">
                    <ul class="nav navbar-nav">
                        <li>
                            <a style="cursor: pointer;" (click)="goToUserList()">Users</a>
                        </li>
                        <li>
                            <a style="cursor: pointer;" (click)="goToProjectList()">Projects</a>
                        </li>
                        <li>
                            <a style="cursor: pointer;" (click)="goToBuildDefinitionList()">Build definitions</a>
                        </li>
                        <li>
                            <a style="cursor: pointer;" (click)="goToBuildInstanceList()">Build instances</a>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li>
                            <a href="${environment.signinUrl}">Sign in</a>
                        </li>
                        <li>
                            <a href="${environment.signoutUrl}">Sign out</a>
                        </li>
                        <li>
                            <a>Signed in as <em>Anonymous</em></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class NavbarComponent implements OnInit {

    constructor(
        private router: Router
    ) {}

    ngOnInit() {}

    goToHomepage() {
        this.router.navigate(['/']);
    }

    goToUserList() {
        this.router.navigate(['/users']);
    }

    goToProjectList() {
        this.router.navigate(['/projects']);
    }

    goToBuildDefinitionList() {
        this.router.navigate(['/build-definitions']);
    }

    goToBuildInstanceList() {
        this.router.navigate(['/build-instances']);
    }

}
