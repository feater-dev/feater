import {environment} from './../../environments/environment';
import {Component} from '@angular/core';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styles: []
})
export class NavbarComponent {

    signinUrl: string = environment.signinUrl;

    signoutUrl: string = environment.signoutUrl;

}
