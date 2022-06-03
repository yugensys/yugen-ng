import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonExampleComponent } from './component-examples/button-example/button-example.component';
import { SelectExampleComponent } from './component-examples/select-example/select-example.component';
import { ComponentsModule } from 'yugen-angular';
@NgModule({
  declarations: [
    AppComponent,
    ButtonExampleComponent,
    SelectExampleComponent, 
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
