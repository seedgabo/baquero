import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html'
})
export class Invoice {
  invoice:any;
  constructor(public navCtrl: NavController, nav:NavParams) {
    this.invoice = nav.get("invoice");
  }

  ionViewDidLoad() {
  }

  subtotal(item){
    return parseFloat(item.precio) * parseInt(item.cantidad);
  }

}
