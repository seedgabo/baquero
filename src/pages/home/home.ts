import { Component } from '@angular/core';
import { LoginPage } from '../login/login';
import { Calendar } from '../calendar/calendar';
import { NavController, ModalController, ToastController, Platform } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { CategoriaPage } from '../categoria/categoria';
import { TicketPage } from '../ticket/ticket';
import { BuscadorPage } from '../buscador/buscador';
import { AgregarTicketPage } from '../agregar-ticket/agregar-ticket';
import { NotificacionesPage } from '../notificaciones/notificaciones';
import { AgregarNotificacionPage } from '../agregar-notificacion/agregar-notificacion';
declare var $: any;
@Component({
    templateUrl: 'home.html'
})
export class HomePage {
    categorias: any;
    buscar: boolean;
    first = true;
    interval;
    constructor(platform: Platform, public navCtrl: NavController, public api: Api, public modal: ModalController, public toast: ToastController) {
    }

    ionViewDidLoad() {
        this.api.storage.ready().then(() => {
            this.api.storage.get("user").then(() => {
                this.load();
            });
        });

        this.interval = setInterval(() => {
            this.load();
        }, 30000);
    }

    ionViewWillLeave() {
        clearInterval(this.interval);
    }

    load(refresher = null) {
        this.api.doLogin().then((data: any) => {
            if (data.nombre) {
                this.first = false;
                this.api.user = data;
                this.api.saveUser(data);
                this.api.saveData();
                this.api.pushRegister();
                this.getCategorias();
                if (refresher != null)
                    refresher.complete();
                $('#calendar').fullCalendar({
                    locale: 'es',
                    defaultView: 'listMonth',
                    buttonIcons: true,
                    editable: false,
                    eventLimit: true,
                    events: data.events,
                    customButtons: {
                        verCalendar: {
                            text: 'Ver Calendario',
                            click: () => {
                                this.navCtrl.push(Calendar);
                            }
                        },
                    },
                    header: {
                        left: 'prev,next today',
                        center: 'verCalendar',
                    },
                    eventClick: (event) => {
                        if (event.type == 'ticket') {
                            this.navCtrl.push(TicketPage, { ticket: event });
                        }
                        else {
                            return;
                        }
                    },
                    eventRender: (event) => {
                        event.url = null;
                    }
                })
            }
        }).catch(err => {
            this.toast.create({ message: "Ocurrió un problema de autenticación", duration: 3000 }).present().then(() => {
                if (refresher != null)
                    refresher.complete();
                if (this.first)
                    this.navCtrl.parent.parent.root = LoginPage;
            })
            console.error(err);
        });
    }

    getCategorias() {
        this.api.getCategorias().then((data: any) => {
            this.categorias = data;
        })
    }

    navigate(cat) {
        this.navCtrl.push(CategoriaPage, { categoria: cat });
    }

    agregarTicket() {
        let modal = this.modal.create(AgregarTicketPage);
        modal.present();
        modal.onWillDismiss((data) => {
            console.log(data);
        })
    }

    toNotificaciones() {
        this.navCtrl.push(NotificacionesPage);
    }

    agregaNotificacion() {
        let modal = this.modal.create(AgregarNotificacionPage);
        modal.present();
    }

    openBuscador() {
        this.navCtrl.push(BuscadorPage);
    }

}
