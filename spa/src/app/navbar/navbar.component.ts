import {environment} from './../../environments/environment';

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent implements OnInit {

    signinUrl: string = environment.signinUrl;

    signoutUrl: string = environment.signoutUrl;

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

    goToDefinitionList() {
        this.router.navigate(['/definitions']);
    }

    goToInstanceList() {
        this.router.navigate(['/instances']);
    }

}
