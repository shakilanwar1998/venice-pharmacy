import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {

  constructor() { }


  getTimeDifference(datetime: any) {
    var datetime: any = new Date(datetime).getTime();
    var now = new Date().getTime();

    if (datetime < now) {
      var milisec_diff = now - datetime;
    } else {
      var milisec_diff = datetime - now;
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));

    var date_diff = new Date(milisec_diff);

    return days + " Days " + date_diff.getHours() + " Hours " + date_diff.getMinutes() + " Minutes " + date_diff.getSeconds() + " Seconds";
  }

  getDateTime(value){
    var now = new Date().getTime();
    if(value=='1d'){
      var added = now + 1440*60000;
    }
    if(value=='4h'){
      var added = now + 240*60000;
    }
    if(value=='1h'){
      var added = now + 60*60000;
    }
    if(value=='30m'){
      var added = now + 30*60000;
    }
    if(value=='15m'){
      var added = now + 15*60000;
    }
    var date_string = new Date(added);
    var day = date_string.getDate();
    var month = date_string.getMonth()+1;
    var year = date_string.getFullYear();
    var hours = date_string.getHours();
    var minutes = date_string.getMinutes();
    var new_date = ""+year+"-"+month+"-"+day+" "+hours+":"+minutes+"";

    return new_date;
  }

  changeColor(id: string) {
    var element = document.getElementById(id);
    element.removeAttribute('color');
    element.setAttribute('color', 'medium');

    if (id == '1day') {
      var item1 = document.getElementById('15min');
      var item2 = document.getElementById('30min');
      var item3 = document.getElementById('4hour');
      var item4 = document.getElementById('1hour');
    }

    if (id == '15min') {
      var item1 = document.getElementById('1day');
      var item2 = document.getElementById('30min');
      var item3 = document.getElementById('4hour');
      var item4 = document.getElementById('1hour');
    }

    if (id == '30min') {
      var item1 = document.getElementById('15min');
      var item2 = document.getElementById('1day');
      var item3 = document.getElementById('4hour');
      var item4 = document.getElementById('1hour');
    }

    if (id == '1hour') {
      var item1 = document.getElementById('15min');
      var item2 = document.getElementById('30min');
      var item3 = document.getElementById('4hour');
      var item4 = document.getElementById('1day');
    }

    if (id == '4hour') {
      var item1 = document.getElementById('15min');
      var item2 = document.getElementById('30min');
      var item3 = document.getElementById('1hour');
      var item4 = document.getElementById('1day');
    }
    
      item1.removeAttribute('color');
      item1.setAttribute('color', 'secondary');

      item2.removeAttribute('color');
      item2.setAttribute('color', 'secondary');

      item3.removeAttribute('color');
      item3.setAttribute('color', 'secondary');

      item4.removeAttribute('color');
      item4.setAttribute('color', 'secondary');
  }
}
