import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rating: number = 4;
  gender: string = 'male';
  height: number = 170;
  weight: number = 85;
  indoor: boolean;
  cheers: boolean;
  pause: boolean = true;
  heartRate: boolean = true;
  pace: string = 'current';
  countdown: number = 3;
}
