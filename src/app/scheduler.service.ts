import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {
  //array de objetos con horarios fijos en hora:minutos (ambos como number) 
  // en estos horarios lanzaremos la noficacion
  //era esto o hacerlo array de string y despues hacerle un map
  private taskTimes: {h:number, m:number} [] =[
    {h:9, m:0},
    {h:15, m:0},
    {h:21, m:0}
  ]
  
  ;
  
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
