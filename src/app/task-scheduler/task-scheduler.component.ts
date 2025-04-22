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
