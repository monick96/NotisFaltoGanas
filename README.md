## Pasos que segui
#### 1 - cree un proyecto en blanco, con angular y ng module
```
ionic start
```
#### 2 - creo un componente para mostrar hora y notificaciones(proximamente)(lógica y botón)
```
ionic generate component task-scheduler
```
#### 3 - creo un servicio que se encargara de ejecutar la funciones diarias 
```
ionic generate service scheduler
```
#### 4 - cree logica en la clase SchedulerService
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  //array de objetos con horarios fijos en hora:minutos (como number) en estos horarios lanzaremos la noficacion
  //era esto o hacerlo array de string y despues hacerle un map
  private taskTimes: {h:number, m:number} [] =[
    {h:9, m:0},
    {h:15, m:0},
    {h:21, m:0}
  ]
  
  //cuando se instancie el service se va a aejecutar automaticamente scheduleTasksForToday()
  //metodo que prorama la tarea
  constructor() { 
    this.scheduleTasksForToday();
  }
  
  //metodo que ejecuta la tarea y si ya paso la hora lo reprograma para el dia siguiente
  private scheduleTasksForToday() {
    const now = new Date();

    //usamos for each de la clase array para recorrerlo
    this.taskTimes.forEach(time => {
      //obtenemos la fecha con la hora objetivo de hoy
      //tipo date
      const target:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.h, time.m);

      // Si ya pasó esa hora hoy o esta ejecutamdose ahora,
      //  programa la tarea para mañana tambien, por que es diaria
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      //calculamos cuanto falta para ejecutar la tarea
      //fecha hora programada - fechahora actual(date) da un resultado tipo number
      //el delay es lo que falta en milisegundos
      const delay:number = target.getTime() - now.getTime();
      
      //setime out hace que se ejute un bloque de codigo, pasado cierto tipo  en milsegundos
      //aca le pasamos nuestra tarea a ejecutar y el tiempo calculado en delay que debe esperar
      //ademas usamos setInterval para que se ejeute otravez mañana
      setTimeout(() => {
        // ejecuta nuestra tarea programada
        this.runTask(); 
        
        //no estoy segura si funcionara para todos los dias esto //probando.. 
        // dejo corriendo la app para ver los console
        //el set interval toma un metodo y pasado el intervalo en milisegundos ejecuta el metodo
        //aca le estoy pasando 24 hs en milisegundos
        let delayRepeatTask:number = 24 * 60 * 60 * 1000;
        setInterval(() => this.runTask(), delayRepeatTask);

      }, delay);

    });
  }

   // metodo de nuestra tarea
   //es un console con la hora para probar 
   //todo esto no accede aun al dispositivo estoy probando que funcione y despues lo adapto
   private runTask() {

    console.log('Ejecutando tarea a las', new Date().toLocaleTimeString());
    // solo console por ahora
  }
}

```

#### 5 - Importamos el service  y agregamos un boton(muestra la hora actual si lo clickeamos) en el componente tarea task-scheduler.component.ts

```typescript
import { Component, OnInit } from '@angular/core';
//mis imports 
//servicio creado para manejar ejecucion d tarea
import { SchedulerService } from '../scheduler.service';
//clase alert controller de ionic para el boton mostrar hora
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task-scheduler',
  standalone:false,//importante esto por que da error si no 
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.scss'],
})

export class TaskSchedulerComponent  implements OnInit {

  constructor(
    //esto seria inyeccion de dependencias 
    //al hacer esto estamos inyectando el servicio y el alert controller
    //actualmente uso scheduler exlisitamente pero al  llegar los horarios del array lanza l console.log 
    private scheduler: SchedulerService,
    private alertCtrl: AlertController
  ) {}
  
  //este metodo se ejecua al iniciarse el componente
  //no hace falta agregar nada por que el service se ejecuta al inyectarlo
  ngOnInit() {}

  // Método muestra alerta y el console.log
  //debemos usar async await por que alertCtrl.create devuelve una promesa, 
  // y tenemos que esperar que se complete para obtener unn valor en este caso la hora
  //si no se lo colocamos puede que nos de hora como vacio o null
  //por que no esperamos a que se complete el proceso de creacion del objeto alerta
  async showHourNow() {
    //obtenemos fecha y hora
    const dateNow = new Date();

    //hora actual
    // convertimos a formato HH:MM:SS
    const hour = dateNow.toLocaleTimeString();  

    //un log con lo mismo por las dudas
    console.log('Botón pulsado a las', hour);

    //aca creamos el alerta y esperamos que termine con await
    //la alerta tiene esta estructura
    const alert = await this.alertCtrl.create({
      header: 'Hora actual',//titulo
      message: `Son las ${hour}`,//mensaje
      buttons: ['OK']//boton confirmar y cerrar
    });

    //esperamos que la alerta se muestre para continuar
    // si no esta listo y lo mostramos aca da eeror
    await alert.present();
  }

}

```

#### 6 - Armar template para la interfaz del componente task-scheduler.component.html, con titulo y boton
```ionic
<ion-card>
  <ion-card-header>
    <ion-card-title>LA HORA ES...</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    <p>Se mostrara noti diaria a las: (9 am, 3 pm y 9 pm).</p>
    <ion-button expand="full" (click)="showHourNow()">
      Ver la hora
    </ion-button>
  </ion-card-content>
</ion-card>

```
#### 7 - importar al app.module.ts el componente (aca estuve un rato para darme cuenta que iba el import, por que no entiendo esto muy bien)
```typescript
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
  /*aca van los servicios externos, o servicios internos creados para usar info entre componentes*/
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  /*marca donde debe empezar la app*/
  bootstrap: [AppComponent],
})
export class AppModule {}

```

#### 8 - traer el template al html de la app (app.component.html)
```
<ion-header>
  <ion-toolbar>
    <ion-title>Mis Tasks</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">
  <app-task-scheduler></app-task-scheduler>
</ion-content>
```
#### 9 - hacer andar el servidor y todo deberia ir ok 
```
ionic serve
```
## Notificacion programada a las 9am y boton mostrando hora
![image](https://github.com/user-attachments/assets/4ba96b1b-55b6-41f7-b194-0549466ed3a6)


## Pasos para agregar capacitor y acceder a funciones nativas 
##### las funcionalidades se pueden probar en el navegador 
##### que buscamos
- que la app me envie notificacion local aun si estoy en otra ventana o haciendo otra cosa(segundo plano) pero que este corriendo en la terminal

#### 10 - agregar capacitor para acceder a funciones nativas 
```
ionic integrations enable capacitor
```
#### 11 - Habilito plugin notificaciones locales 
- es una librería oficial de Capacitor que permite programar notificaciones que se muestran en el dispositivo sin necesidad de conexión a internet 
```
npm install @capacitor/local-notifications
```
#### 12 - Arrancamos modificacion de codigo:
  ### scheduler.service.ts
```typescript
import { Injectable } from '@angular/core';
//importamos notificaciones capacitor
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  //hace que el servicio sea de uso global
  //por eso no necesite ponerlo en app.module.ts
  //pero no se si es buena practica esto 
  providedIn: 'root'
})
export class SchedulerService {
  //array de objetos con horarios fijos en hora:minutos (ambos como number) 
  // en estos horarios lanzaremos la noficacion
  //era esto o hacerlo array de string y despues hacerle un map
  //le agregamos un id a a cada hora por si en el futuro queremos modificar 
  //o mismo la app diferencie que son distintos obtetos
  private taskTimes: {id:number,h:number, m:number} [] =[
    {id:1, h:9, m:0},
    {id:2, h:15, m:0},
    {id:3, h:21, m:0}
  ];
  
  //cuando se instancie el service se va a ejecutar automaticamente scheduleTasksForToday()
  //metodo que prorama la tarea
  constructor() { 
    //solicitamos permiso al instanciar servicio
    this.requestPermission();
    
  }
  
  //metodo que solicita permiso , muestra un cuadro de dialogo al usuario
  //devuelve una promesa por eso debe ser async await
  private async requestPermission() {
    const permission = await LocalNotifications.requestPermissions();
    //un log para ver el valor de granted(false si fue rechazado)
    //Permiso:{ granted: false };
    console.log('Permiso:', permission);

    //agregar if para la tarea
    if (permission.display !== 'granted') {
      console.log("No se otorgo permiso, no vamos a ejecutar nada");
      return; //salimos 
    }
    //si se dio permiso no entra al if y llegamos aca
    //solo me arroja el log supongo por que estoy en el navegador 
    this.scheduleTasksForToday();

  }
  
  //metodo que ejecuta la tarea y si ya paso la hora lo reprograma para el dia siguiente
  private scheduleTasksForToday() {
    const now = new Date();

    //usamos for each de la clase array para recorrerlo
    this.taskTimes.forEach(time => {
      //obtenemos la fecha con la hora objetivo de hoy
      //tipo date
      const target:Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.h, time.m);

      // Si ya pasó esa hora hoy o esta ejecutamdose ahora,
      //  programa la tarea para mañana tambien, por que es diaria
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }
      
      //calculamos cuanto falta para ejecutar la tarea
      //fecha hora programada - fechahora actual(date) da un resultado tipo number
      //el delay es lo que falta en milisegundos
      const delay:number = target.getTime() - now.getTime();
      
      //setime out hace que se ejute un bloque de codigo, pasado cierto tipo  en milsegundos
      //aca le pasamos nuestra tarea a ejecutar y el tiempo calculado en delay que debe esperar
      //ademas usamos setInterval para que se ejeute otravez mañana
      setTimeout(() => {
        // ejecuta nuestra tarea programada
        this.runTask(time.id); 
        
        //no estoy segura si funcionara para todos los dias esto //probando.. 
        // dejo corriendo la app para ver los console
        //el set interval toma un metodo y pasado el intervalo en milisegundos ejecuta el metodo
        //aca le estoy pasando 24 hs en milisegundos
        let delayRepeatTask:number = 24 * 60 * 60 * 1000;
        setInterval(() => this.runTask(time.id), delayRepeatTask);

      }, delay);

    });
  }

   // metodo de nuestra tarea(una notificacion)
  //es async await porque tiene que comunicarse con la api del sistema operativo 
  //para armar la notificacion segun los parametros que le pasamos
  private async runTask(id: number) {
    // Obtener la hora actual y pasamos a string
    const hora = new Date().toLocaleTimeString();  
    //mostrar por console por las dudas
    console.log(`Ejecutando tarea con id ${id} a las ${hora}`);
    //el metodo schedule espera que le pasemos obligatoriamente
    //title, body, id, schedule
    //pasamos los parametros y esperamos
    await LocalNotifications.schedule({
      notifications: [
        {
          title: `📝 (Tarea #${id})`, // Título incluye el id
          body: `Hora de la tarea (hora: ${hora})`, // Mensaje con detalles de la hora
          id: id, // Usar el id único del objeto para la notificación
          schedule: { at: new Date() }, // Lanzar la notificación inmediatamente, por quesi llego hasta aca es por que debe ejecutarse
          sound: 'defaul', // sonido por defecto, pero se puede personalizar
          smallIcon: 'res://ic_launcher', // ruta a icono por defecto en sistema
          //attachments: ['data/image.jpg'], // aca podrian ir adjuntos, imagenes si es soportado 
          //actionTypeId: '', // aca prodian ir acciones personalizadas
          //extra: null // datos adicionales
        }
      ]
    });
  }
}

```


