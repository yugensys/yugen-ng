import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent } from 'src/components/button/button.component';
import { SelectComponent } from 'src/components/select/select.component';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonExampleComponent } from './component-examples/button-example/button-example.component';

@NgModule({
  declarations: [
    AppComponent, ButtonComponent,SelectComponent, ButtonExampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
