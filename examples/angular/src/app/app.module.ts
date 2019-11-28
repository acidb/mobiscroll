import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MbscModule, mobiscroll } from '@mobiscroll/angular-lite';

import { AppComponent } from './app.component';

mobiscroll.settings = {
  theme: 'auto',
  themeVariant: 'auto'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MbscModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
