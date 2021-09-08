import { Injectable } from '@angular/core';
import { ConfigService, STORAGE_KEY } from 'src/app/services/config/config.service';
import { Events} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userData: any = {};
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(
    public events: Events,
    public http: HttpClient,
    public config: ConfigService,
    public localStorage: LocalStorage,
  ) {
    this.getItem();
  }

  setUser(token, remember) {
    this.http.get(this.config.yourSiteUrl + "getuser?token=" + token + "", this.headers)
      .subscribe(data => {
        this.userData = data['data']['user'];
        if(remember == true){
          this.localStorage.setItem('user', data['data']['user']).subscribe(() => { }, () => { });
        }
      });
  }

  async getItem() {
    await this.localStorage.getItem('user').subscribe((data: any) => {
      this.userData = data;
    }, () => { });
  }

}
