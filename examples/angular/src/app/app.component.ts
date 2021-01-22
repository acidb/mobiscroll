import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    rating = 4;
    gender = 'male';
    height = 170;
    weight = 85;
    indoor = false;
    cheers = false;
    pause = true;
    heartRate = true;
    pace = 'current';
    countdown = 3;
}
