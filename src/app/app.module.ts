import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//mis import
//import { TaskSchedulerComponent } from "./task-scheduler.component";//no anda ver que pasa
import { TaskSchedulerComponent } from './task-scheduler/task-scheduler.component';


@NgModule({
  /*en declarations van mis componentes*/
  declarations: [AppComponent, TaskSchedulerComponent],
  /*en imports los modulos como FormsModule, HttpClientModule, etc*/
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  /*aca van los servicios externos, o servicios internos creados para usar info entre comonentes*/
  /*supongo que si quisiera compartir globalmente mi servicio deberia traerlo aca.. pero no estoy segura */
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  /*marca donde debe empezar la app*/
  bootstrap: [AppComponent],
})
export class AppModule {}
