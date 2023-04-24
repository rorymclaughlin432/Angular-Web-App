import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = "Angular";
  tabItems: MenuItem[];

  ngOnInit() {
    this.tabItems = [
      { label: "Home", icon: "pi pi-fw pi-home", routerLink: 'home' },
      { label: "Customers", icon: "pi pi-fw pi-users", routerLink: 'customers', },
      { label: "Transactions", icon: "pi pi-fw pi-pound", routerLink: 'transactions' },
      { label: "Offers", icon: "pi pi-fw pi-database" , routerLink: 'offers'},
    ];
  }

}
