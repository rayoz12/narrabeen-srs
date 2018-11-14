import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderItem } from './shared/models/orderitem';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable, BehaviorSubject } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';
import { MenuItem } from './shared/models/menuitem';
import { TableAuthService } from './auth/table-auth.service';
import * as moment from 'moment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  public http1;
  private baseRoute = 'https://jakeholmes.me:5000/';

  constructor(private http: HttpClient, private tableAuth: TableAuthService) {
    this.http1 = http;
  }

  GetOrder() {
    let orderRoute = 'order/items/all';
    return this.http.get<OrderItem[]>(this.baseRoute + orderRoute);
  }

  createTakeawayOrder(menuitems: MenuItem[]) {
    let now = moment().format().split("+")[0] + "Z";
    const orderRoute = 'order/takeaway?id=' + Math.floor(Math.random() * Math.floor(300)) + '&time=' + now;
    const menuItemIds = menuitems.map((menuItem: MenuItem) => menuItem.id);

    return this.http.post(this.baseRoute + orderRoute, JSON.stringify(menuItemIds), httpOptions);
  }

  createOrder(menuitems: MenuItem[], qrCode: String) {
    let now = moment().format().split("+")[0] + "Z"; // add this 2 of 4
    const orderRoute = 'order/table?code=' + qrCode;
    const menuItemIds = menuitems.map((menuItem: MenuItem) => menuItem.id);

    return this.http.post(this.baseRoute + orderRoute, JSON.stringify(menuItemIds), httpOptions);
  }

  getOrderItem(id: number) {
    return this.http.get<OrderItem>(this.baseRoute + 'order?id=' + id);
  }

  createOrderItem(orderItem: OrderItem) {
    return this.http.post(this.baseRoute + 'order',  JSON.stringify(orderItem), httpOptions);
  }

  editOrderItem(ordr: OrderItem) {
    const orderUpdateData = {
      id: ordr.id,
      status: "inprogress"
    };

    return this.http.put(this.baseRoute + 'order/items', JSON.stringify(orderUpdateData), httpOptions);
  }


  public putUrl(url, data?: Object, cb?: Function, options?: Object) {
    const vm = this;
    vm.http.put(url, data, options)
      .subscribe(res => {
        cb(res);
      });
  }


  changeStatus(orderitem, i) {
    let that = this;
    let urlStr = 'https://jakeholmes.me:5000/order/items?id='+orderitem.id+'&status='+orderitem.status+'&slot='+orderitem.slot
    this.http1.putUrl(urlStr, {}, res => {
      console.dir(res);
      orderitem.status = "orderitem.status";
    });
  }
}