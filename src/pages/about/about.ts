import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Api} from '../../providers/api/api';
import {DocumentosPage} from '../documentos/documentos';
@Component({
    templateUrl: 'about.html'
})
export class AboutPage {
    api:Api
    categorias:any;
    constructor(public navCtrl: NavController, api:Api) {
        this.api  =api;
        this.getCategorias();
    }


    getCategorias(){
        this.api.getCategoriasDocumentos().then((data:any) =>{
            this.categorias = data;
        });
    }

    navigate(cat){
          this.navCtrl.push(DocumentosPage, {categoria : cat});
    }
}
