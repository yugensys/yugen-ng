import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonExampleComponent } from './component-examples/button-example/button-example.component';
import { SelectExampleComponent } from './component-examples/select-example/select-example.component';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: 'example',
    component: AppComponent,
    children: [
      { path: 'button', component: ButtonExampleComponent },
      { path: 'select', component: SelectExampleComponent }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
