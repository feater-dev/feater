import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';

if (environment.production) {
    enableProdMode();
}

// Capture and store authentication token sent via URL.
const parser = document.createElement('a');
parser.href = window.location.href;
const token = parser.hash.replace(/^#/, '');
if (token) {
    localStorage.setItem('token', token);
    window.location.replace(parser.href.substr(0, -token.length - 1));
}

platformBrowserDynamic().bootstrapModule(AppModule);
