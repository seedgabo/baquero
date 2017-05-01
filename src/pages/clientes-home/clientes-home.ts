import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { LoginPage } from '../login/login';
import { TicketPage } from '../ticket/ticket';
import { NotificacionesPage } from '../notificaciones/notificaciones';
import { Facturas } from '../facturas/facturas';
declare var moment: any;
@Component({
    selector: 'page-clientes-home',
    templateUrl: 'clientes-home.html'
})
export class ClientesHome {
    tickets: any;
    categorias = [];
    categoria_selected = 0;
    query: string = "";
    constructor(public navCtrl: NavController, public api: Api, public modal: ModalController) { }

    ionViewDidLoad() {
        window.setTimeout(() => {
            this.getTickets();

        }, 1000);
    }

    getTickets() {
        this.api.getTicketsClientes().then((data) => {
            this.tickets = data;
            this.getCategorias();
        }).catch((err) => {
            console.error("Error al obtener los tickets", err)
        });
    }

    ticketsFilters() {
        if (this.categoria_selected == 0) {
            return this.tickets;
        }
        return this.tickets.filter(ticket => {
            return ticket.categoria_id == this.categoria_selected;
        });
    }

    getCategorias() {
        this.tickets.forEach(ticket => {
            var agregar = true;
            this.categorias.forEach(cat => {
                if (ticket.categoria && cat.id == ticket.categoria.id) {
                    agregar = false;
                }
            });
            if (agregar) {
                this.categorias.push(ticket.categoria);
            }
        });
    }

    toLogin() {
        let root: NavController = this.navCtrl;
        this.api.user = {};
        this.api.storage.remove("user");
        root.setRoot(LoginPage);
    }

    verTicket(ticket) {
        this.navCtrl.push(TicketPage, { ticket: ticket });
    }


    perfil() {
        // this.navCtrl.push(Profile);
    }

    MisFacturas() {
        this.navCtrl.push(Facturas);
    }

    toNotificaciones() {
        this.navCtrl.push(NotificacionesPage);
    }

    fechar(fecha) {
        return moment(fecha).format("dddd,D MMMM  YYYY, h:mm:ss a");
    }


}
