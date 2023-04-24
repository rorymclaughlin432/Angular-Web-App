import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { OffersComponent } from './components/offers/offers.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent,
  },

  {
    path: 'customers',
    pathMatch: 'full',
    component: CustomersComponent,
  },
  {
    path: 'transactions',
    pathMatch: 'full',
    component: TransactionsComponent
  },
  {
    path: 'offers',
    pathMatch: 'full',
    component: OffersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ]
})
export class AppRoutingModule {}
