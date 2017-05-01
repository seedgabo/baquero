import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Cliente } from '../cliente/cliente';
@Component({
    selector: 'page-clientes',
    templateUrl: 'clientes.html'
})
export class Clientes {
    clientes: any;
    query = "";
    loading = false;
    constructor(public navCtrl: NavController, public api: Api) { }

    ionViewDidLoad() {
        this.loading = true;
        this.api.getClientes()
            .then((data: any) => {
                this.clientes = data.data;
                this.loading = false;
                console.log(data);
            })
            .catch(
            (err) => {
                this.loading = false;
            });
    }

    buscar() {
        this.loading = true;
        let searcher = [{ index: 'nombres', value: this.query }, { index: 'apellidos', value: this.query }, { index: 'nit', value: this.query }, { index: 'cedula', value: this.query }];
        this.api.getClientes(searcher)
            .then(
            (data: any) => {
                this.loading = false;
                this.clientes = data.data;
            })
            .catch(
            (err) => {
                this.loading = false;
            });
    }

    verCliente(cliente) {
        this.navCtrl.push(Cliente, { cliente: cliente });
    }

}
