import {Component} from '@angular/core';
import {NavController, ToastController} from 'ionic-angular';
import {HomePage} from '../home/home';
import {AboutPage} from '../about/about';
import {ContactPage} from '../contact/contact';
import {LoginPage} from '../login/login';
import {MisTicketsPage} from '../mis-tickets/mis-tickets';
import {TicketsTodosPage} from '../tickets-todos/tickets-todos';
import {BuscadorPage} from '../buscador/buscador';
import {NotificacionesPage} from '../notificaciones/notificaciones';
import {Api} from '../../providers/api/api';
import { Calendar } from '../calendar/calendar';
import { Clientes } from '../clientes/clientes';

declare var window:any;
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root: any;
    tab2Root: any;
    tab3Root: any;
    tab4Root:any;
    constructor(public navCtrl: NavController, public api:Api, public toast:ToastController) {
        this.tab1Root = HomePage;
        this.tab2Root = AboutPage;
        this.tab3Root = ContactPage;
        this.tab4Root = Clientes;
    }

    toLogin(){
        let root:NavController = this.navCtrl;
        this.api.user = {};
        this.api.storage.remove("user");
        root.setRoot(LoginPage);
    }

    toNotificaciones(){
        this.navCtrl.push(NotificacionesPage);
    }

    MisTickets(){
        this.navCtrl.push(MisTicketsPage);
    }

    TicketTodos(){
        this.navCtrl.push(TicketsTodosPage);
    }

    Calendar(){
        this.navCtrl.push(Calendar);
    }

    openBuscador(){
        this.navCtrl.push(BuscadorPage);
    }
}
