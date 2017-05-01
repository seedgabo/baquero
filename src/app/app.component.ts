import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { Api } from '../providers/api/api';
import { LoginPage } from '../pages/login/login';
import { ClientesHome } from '../pages/clientes-home/clientes-home';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CodePush, InstallMode } from '@ionic-native/code-push';
@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage: any;

    constructor(platform: Platform, public api: Api, public statusbar: StatusBar, public splashscreen: SplashScreen, public codepush: CodePush) {
        platform.ready().then(() => {
            this.api.storage.get('user').then(data => {
                if (data == undefined)
                    this.rootPage = LoginPage;
                else {
                    if (JSON.parse(data).modulos.clientes && JSON.parse(data).iscliente) {
                        this.rootPage = ClientesHome;
                    }
                    else {
                        this.rootPage = TabsPage;
                    }
                }
            });
            this.splashscreen.hide();
            this.statusbar.styleDefault();
            const downloadProgress = (progress) => { console.log(`Downloaded ${progress.receivedBytes} of ${progress.totalBytes}`); }
            this.codepush.sync({ updateDialog: false, installMode: InstallMode.IMMEDIATE, }, downloadProgress).subscribe(
                (syncStatus) => console.log(syncStatus),
                (err) => { console.warn(err) });
        });

    }
}
