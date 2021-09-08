import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AlertController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.page.html',
  styleUrls: ['./chatting.page.scss'],
})
export class ChattingPage implements OnInit {
  result: Observable<any>;
  messages: any = [];
  message = '';
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');


  phone_model = 'iPhone';
  input = '';

  constructor(private platform: Platform,
    public alertController: AlertController, private menuCtrl: MenuController,
    private api:ApiService,public localStorage: LocalStorage,
    private alertService:AlertService,private socket: Socket
  ) {
      this.getMessages();
  }

  ngOnInit() {
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllMessages(data.id);
      this.result.subscribe(data => {
        this.messages = data;
      });
    });
}

reload(){
  this.localStorage.getItem('user').subscribe((data: any) => {
    this.result = this.api.getAllMessages(data.id);
    this.result.subscribe(data => {
      this.messages = data;
    });
  });
}

  getMessages(){
      this.socket.on('message', (data) => {
        this.localStorage.getItem('user').subscribe((value: any) => {
          if(data.message_to == value.id || data.message_from == value.id){
            if(data.message_from == value.id){
              this.reload();
            }
            else{
              this.messages.push(data);
            }
          }
        });
      });
  }

  sendMessage(){
    if(this.message != ''){
      this.localStorage.getItem('user').subscribe((value: any) => {
        this.socket.emit('add-message', {text: this.message,message_from: value.id, message_to:'admin'});
        this.api.sendMessage(this.message);
        this.message = '';
      });
    }
  }

  async loadAgain(){
      this.localStorage.getItem('user').subscribe((data: any) => {
        this.result = this.api.getAllMessages(data.id);
        this.result.subscribe(data => {
          this.messages = data;
        });
      });
    }

  ionViewDidEnter() {
    this.menuCtrl.enable(false, 'end');
    this.menuCtrl.enable(true, 'start');

    setTimeout(() => {
      this.scrollToBottom();
    }, 10)
    setTimeout(() => {
    }, 100)


  }

  scrollToBottom(){
    let content = document.getElementById("chat-container");
    let parent = document.getElementById("chat-parent");
    let scrollOptions = {
      left: 0,
      top: content.offsetHeight
    }
    parent.scrollTo(scrollOptions)
  }


}
