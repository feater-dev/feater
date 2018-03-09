import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-about',
    template: `
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="jumbotron" style="margin-top: 80px;">
                        <h1>XSolve Feat</h1>
                        <p>This application will allow you to easily deploy multiple features for any dockerized project.</p>
                        <p><a class="btn btn-primary btn-lg" (click)="goToProjectList()">Start using</a></p>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class AboutComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit() {}

    goToProjectList() {
        this.router.navigate(['/projects']);
    }

}
