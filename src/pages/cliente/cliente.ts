import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { TicketPage } from '../ticket/ticket';
import { Consulta } from '../consulta/consulta';
import { Proceso } from '../proceso/proceso';
import { ProcesoMasivoPage } from '../proceso-masivo/proceso-masivo';
@Component({
    selector: 'page-cliente',
    templateUrl: 'cliente.html'
})
export class Cliente {
    cliente: any;
    procesos = [];
    consultas = [];
    query = "";
    constructor(public navCtrl: NavController, public api: Api, public params: NavParams) {
        this.cliente = this.params.get('cliente');
        this.procesos = this.cliente.procesos;
        this.consultas = this.cliente.consultas;
        // console.log(this.cliente);
    }

    ionViewDidLoad() {
    }
    verTicket(ticket_id) {
        this.navCtrl.push(TicketPage, { ticket: { id: ticket_id } });
    }

    verProceso(proceso) {
        this.navCtrl.push(Proceso, { proceso: proceso, cliente: this.cliente });
    }

    verConsulta(consulta) {
        this.navCtrl.push(Consulta, { consulta: consulta, cliente: this.cliente });
    }

    filtrar() {
        if (this.query == "") {
            this.procesos = this.cliente.procesos.slice(0);
            this.consultas = this.cliente.consultas.slice(0);
            return;
        }

        this.procesos = this.cliente.procesos.filter(proceso => {
            return proceso.radicado.indexOf(this.query) > -1 ||
                (proceso.ticket &&
                    proceso.ticket.titulo.toLowerCase().indexOf(this.query) > -1
                ) ||
                (proceso.ticket &&
                    proceso.ticket.contenido.toLowerCase().indexOf(this.query) > -1
                )
                ||
                (proceso.ticket && proceso.ticket.categoria &&
                    proceso.ticket.categoria.nombre.toLowerCase().indexOf(this.query) > -1
                )
        });
        this.consultas = this.cliente.consultas.filter(consulta => {
            return consulta.consulta.indexOf(this.query) > -1 ||
                (consulta.ticket &&
                    consulta.ticket.titulo.toLowerCase().indexOf(this.query) > -1
                ) ||
                (consulta.ticket &&
                    consulta.ticket.contenido.toLowerCase().indexOf(this.query) > -1
                ) ||
                (consulta.ticket && consulta.ticket.categoria &&
                    consulta.ticket.categoria.nombre.toLowerCase().indexOf(this.query) > -1
                )
        });
    }


    verProcesoMasivo(proceso) {
        this.navCtrl.push(ProcesoMasivoPage, { proceso: proceso, cliente: this.cliente });
    }
}
