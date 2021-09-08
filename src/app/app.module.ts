import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AddPatientPage } from 'src/app/public/add-patient/add-patient.page';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
const config: SocketIoConfig = { url: 'https://sisdemo.club:3001', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    AddPatientPage,
  ],
  entryComponents: [AddPatientPage],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      Camera,
      File,
      FileTransfer,
      FileTransferObject,
      ScreenOrientation,
      SocialSharing,
      Clipboard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
