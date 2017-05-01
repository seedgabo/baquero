import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Push } from '@ionic-native/push';
import { Transfer } from '@ionic-native/transfer';
import { Http, Headers } from '@angular/http';
// import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class Api {

    username: string;
    password: string;
    token: string;
    url: string = 'http://newton.eycproveedores.com/baquero/public/';
    // url:string = 'http://localhost/newton/public/' ;
    user: any = { token: null };
    pushData: any;
    constructor(public http: Http, private platform: Platform, public storage: Storage, public push: Push, public transfer: Transfer) {
        this.initVar();
    }

    get(uri) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/" + uri, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    return reject(this.handleData(error));
                });
        });
    }

    post(uri, data) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "api/" + uri, data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    return reject(this.handleData(error));
                });
        });
    }

    urlAuth(uri) {
        return 'http://newton.eycproveedores.com/newton/public/' + uri;
    }

    initVar() {
        this.storage.get("username").then((data) => this.username = data);
        this.storage.get("password").then((data) => this.password = data);
        this.storage.get("user").then((data) => data != undefined ? this.user = JSON.parse(data) : {});
    }


    saveData() {
        this.storage.set("username", this.username);
        this.storage.set("password", this.password);
        this.storage.set("url", this.url);
    };

    saveUser(user) {
        this.storage.set("user", JSON.stringify(user));
    }

    doLogin() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/login", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    return reject(this.handleData(error));
                });
        });
    }

    getCategorias() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getCategorias", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    return reject(this.handleData(error));
                });
        });
    }

    getUsuarios() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getUsuarios", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => {
                    return reject(this.handleData(error));
                });
        });
    }

    getAllCategorias() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getAllCategorias", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getTickets(categoria_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/" + categoria_id + "/getTickets", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getCategoriasDocumentos() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/documentos/getCategorias", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getUsuariosCategoria(categoria_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getUsuariosCategoria/" + categoria_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getDocumentos(categoria) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/" + categoria + "/getDocumentos", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getTicket(ticket_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getTicket/" + ticket_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getClientes(search = []) {
        return new Promise((resolve, reject) => {
            let url = this.url + "api/clientes?with[]=tickets&paginate=100";
            // if (this.user.modulos.procesos_masivos) {
            //     url += "&with[]=procesosMasivos"
            // }
            if (this.user.modulos.procesos) {
                url += "&with[]=procesos.ticket.categoria"
            }
            if (this.user.modulos.consultas) {
                url += "&with[]=consultas.ticket.categoria"
            }

            for (let i = 0; i < search.length; i++) {
                url += `&orWhereLike[${search[i].index}]=${search[i].value}`;
            }
            this.http.get(url, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getMisTickets() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getMisTickets", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getAllTickets() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getAllTickets", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getTicketsAbiertos() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getTicketsAbiertos", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getTicketsVencidos() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getTicketsVencidos", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getSearch(query) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/search?query=" + query, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getNotificaciones() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getNotificaciones", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    leerNotificacion(id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/notificacion/" + id + "/leida", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getParameters() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getParameters", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    desleerNotificacion(id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/notificacion/" + id + "/noleida", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }
    getPacientes(query = "") {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getPacientes" + query, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getCaso(caso_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getCaso/" + caso_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getIncapacidad(incapacidad_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/getIncapacidad/" + incapacidad_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    iniciarSeguimiento(caso_id) {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/iniciar-seguimiento/" + caso_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    postTicket(data) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "api/addTicket", data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    postComentarioTicket(data, ticket_id) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "api/addComentario/" + ticket_id, data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    postAlerta(data) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "api/addAlerta", data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    putTicket(data, id) {
        return new Promise((resolve, reject) => {
            this.http.put(this.url + "api/editTicket/" + id, data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }



    deleteComenarioTicket(comentario_id) {
        return new Promise((resolve, reject) => {
            this.http.delete(this.url + "api/deleteComenarioTicket/" + comentario_id, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }


    postPushtoken(data) {
        return new Promise((resolve, reject) => {
            this.http.post(this.url + "api/dispositivos", data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    pushRegister() {
        let push: any = this.push.init({
            android: {
                senderID: "600000041642",
                clearNotifications: 'false',
            },
            ios: {
                alert: "true",
                badge: true,
                sound: 'true'
            },
            windows: {}
        });

        if (typeof push.error === 'undefined' || push.error === null) {
            let body;
            push.on('registration', (data) => {
                console.log(data.registrationId);
                if (this.platform.is('android'))
                    body = "token=" + data.registrationId + "&plataforma=android";
                else
                    body = "token=" + data.registrationId + "&plataforma=ios";

                this.postPushtoken(body).then(Response => {
                    this.pushData = Response;
                    this.savePushData(Response);
                });
            });

            push.on('notification', (data) => {
                console.log(data.message);
                console.log(data.title);
                console.log(data.count);
                console.log(data.sound);
                console.log(data.image);
                console.log(data.additionalData);
            });

            push.on('error', (e) => {
                console.log(e.message);
            });
            return true;
        }
        return false;
    }

    savePushData(pushData) {
        this.storage.set('pushData', JSON.stringify(pushData));
    }

    putPushData(id, data) {
        return new Promise((resolve, reject) => {
            this.http.put(this.url + "api/dispositivos/" + id, data, { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }






    postArchivoTicket(data, fileurl, nombre): Promise<any> {
        let fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'archivo',
            fileName: decodeURIComponent(nombre),
            headers: { "Authorization": "Basic " + btoa(this.username + ":" + this.password) },
            params: data
        }
        return fileTransfer.upload(fileurl, this.url + "api/addTicket", options, true);
    }

    postArchivoComentarioTicket(ticket_id, data, fileurl, nombre): Promise<any> {
        let fileTransfer = this.transfer.create();
        var options = {
            fileKey: 'archivo',
            fileName: decodeURIComponent(nombre),
            headers: { "Authorization": "Basic " + btoa(this.username + ":" + this.password) },
            params: data
        }
        return fileTransfer.upload(fileurl, this.url + "api/addComentario/" + ticket_id, options, true);
    }

    // Clientes Functions
    getTicketsClientes() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/clientes/getTickets", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    getFacturasClientes() {
        return new Promise((resolve, reject) => {
            this.http.get(this.url + "api/clientes/getInvoices", { headers: this.setHeaders() })
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, error => { return reject(this.handleData(error)) });
        });
    }

    private setHeaders() {
        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
        return headers;
    }

    private handleData(res) {
        if (res.statusText == "Ok") {
            return { status: "No Parace haber conexión con el servidor" };
        }

        // If request fails, throw an Error that will be caught
        if (res.status < 200 || res.status >= 300) {
            return { error: res.status }
        }
        // If everything went fine, return the response
        else {
            return res;
        }
    }
}
