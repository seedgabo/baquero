import { Component } from '@angular/core';
import { NavController, AlertController,LoadingController } from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {TabsPage}  from '../tabs/tabs';
import { ClientesHome } from '../clientes-home/clientes-home';

@Component({
    templateUrl: 'login.html'
})
export class LoginPage {
    api:Api;
    constructor(public navController: NavController, api:Api,public alert :AlertController, public loading:LoadingController) {
        this.api = api;

    }

    doLogin(){
        let loader = this.loading.create({
            content: "Iniciando Sesión...",
            duration: 3000
        });
        loader.present();
        this.api.doLogin().then((data:any) =>
        {
            if(data.nombre)
            {
                this.api.saveUser(data);
                this.api.saveData();
                this.api.pushRegister();
                loader.dismiss().then(()=>{
                    if(data.modulos.clientes && data.iscliente)
                    {
                        this.navController.setRoot(ClientesHome);
                    }
                    else
                    {
                        this.navController.setRoot(TabsPage);
                    }
                });
            }
            else
            {
                loader.dismiss().then(()=>{
                    this.alert.create({title:"Error",message:"Usuario y Contraseña Invalidos", buttons:["ok"]}).present();
                });
            }
        })
        .catch((err:any)=>{
            loader.dismiss().then(()=>{
                this.alert.create({title:"Error",message:"Error al iniciar sesión", buttons:["ok"]}).present();
            });
        });
    }
}
