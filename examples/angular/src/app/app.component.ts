import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rating = 4;
  gender = 'male';
  height = 170;
  weight = 85;
  indoor: boolean;
  cheers: boolean;
  pause = true;
  heartRate = true;
  pace = 'current';
  countdown = 3;
}
