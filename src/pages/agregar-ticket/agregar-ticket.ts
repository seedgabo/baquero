import { FileChooser } from '@ionic-native/file-chooser';
import { Component } from '@angular/core';
import { NavController, ViewController, NavParams, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Api } from '../../providers/api/api';
declare var window: any;
declare var moment: any;
@Component({
    templateUrl: 'agregar-ticket.html',
})
export class AgregarTicketPage {

    api: Api;
    categorias: any;
    usuarios: any;
    clientes;
    archivo;
    nombre;
    ticket: any = {
        titulo: '',
        contenido: '',
        guardian_id: '',
        transferible: '',
        categoria_id: '',
        clave: '',
        vencimiento: '',
        cliente_id: '',
        tipo: '',
    };

    proceso: any = {};
    consulta: any = {};
    constructor(public navCtrl: NavController, public viewctrl: ViewController, api: Api, params: NavParams,
        public loading: LoadingController, public alert: AlertController, public platform: Platform, public filechooser: FileChooser) {
        this.api = api;
        this.getCategorias();
        this.ticket.vencimiento = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString();
        this.proceso.fecha_proceso = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString();
        this.consulta.fecha_consulta = new Date(new Date().getTime() + 60 * 60 * 24 * 1000).toISOString();
        this.api.getClientes().then((data: any) => {
            this.clientes = data.data;
        })
    }

    getUsuarios(categoria_id) {
        this.api.getUsuariosCategoria(categoria_id).then((data: any) => {
            this.usuarios = data;
            if (data[0])
                this.ticket.guardian_id = data[0].id;
        });

    }

    getCategorias() {
        this.api.getAllCategorias().then((data) => {
            this.categorias = data;
        }).catch((err) => {
            console.error(err);
        });
    }

    reloadUsuarios() {
        this.getUsuarios(this.ticket.categoria_id)
    }

    dismiss() {
        this.viewctrl.dismiss({ agregado: false });
    }

    agregarTicket() {
        let loading = this.loading.create({ content: "Cargando" });
        loading.present();
        var data: any = this.ticket;
        data.vencimiento = moment(this.ticket.vencimiento).format('X');
        if (this.ticket.tipo == 'proceso') {
            data.proceso = this.proceso;
            if (data.proceso.fecha_proceso != undefined) {
                data.proceso.fecha_proceso = moment(data.proceso.fecha_proceso).format('X');
            }

        }
        if (this.ticket.tipo == 'consulta') {
            data.consulta = this.consulta;
            if (data.consula.fecha_consulta != undefined) {
                data.consula.fecha_consulta = moment(data.consulta.fecha_consulta).format('X');
            }
        }
        if (this.archivo == null) {
            this.api.postTicket(data).then((data) => {
                loading.dismiss().then(() => {
                    this.viewctrl.dismiss({ agregado: true, ticket: data });
                });
            });
        }
        else {
            if (this.ticket.clave.length > 0) {
                data.clave = this.ticket.clave;
                data.encriptado = "true";
            }
            this.api.postArchivoTicket(data, this.archivo, this.nombre).then((data) => {
                console.log(data);
                loading.dismiss().then(() => {
                    this.viewctrl.dismiss({ agregado: true, ticket: data });
                });
            }).catch((err) => {
                console.log(err)
                loading.dismiss().then(() => {
                    this.alert.create({ title: "Error", message: "Ocurrió un error al subir el archivo, si esto persiste por favor contacte al desarrollador", buttons: ["ok"] }).present();
                });
            });
        }
    }

    rellenado() {
        return !(this.ticket.titulo.length > 3 && this.ticket.contenido.length > 3 && this.ticket.guardian_id != "");
    }

    pickFile() {
        if (this.platform.is('ios')) {
            this.pickFileIos();
            return;
        }
        this.filechooser.open()
            .then((data) => {
                this.archivo = data;
                this.alert.create({
                    title: "Nombre del archivo", subTitle: "no olvide colocar la extension.(ej: archivo.pdf)", inputs: [
                        {
                            type: "url",
                            name: "nombre",
                            placeholder: "Nombre del archivo",
                            value: "." + data.split('.').pop()
                        },
                    ],
                    buttons: [
                        {
                            text: 'Cancelar',
                            handler: form => {
                                console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'Aceptar',
                            handler: (form) => {
                                this.nombre = form.nombre;
                            }
                        }
                    ]
                }).present();
            })
            .catch((data) => {
                console.log(data);
            });
    }

    pickFileIos() {
        window.FilePicker.pickFile((data) => {
            this.archivo = data;
            this.alert.create({
                title: "Nombre del archivo", subTitle: "no olvide colocar la extension.(ej: archivo.pdf)", inputs: [
                    {
                        type: "url",
                        name: "nombre",
                        placeholder: "Nombre del archivo",
                        value: "." + data.split('.').pop()
                    },
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        handler: form => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Aceptar',
                        handler: (form) => {
                            this.nombre = form.nombre;
                        }
                    }
                ]
            }).present();
        }, (data) => {
            console.log(data);
        });
    }
}
