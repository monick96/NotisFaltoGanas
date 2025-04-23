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
