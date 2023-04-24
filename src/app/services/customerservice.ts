import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Customer } from '../domain/customer';

@Injectable()
export class CustomerService {

    registerStatus: string[] = ['Register', 'Deregister'];

    genderStatus: string[] = ['Male', 'Female', 'Other'];
    
    //menuItems: string[] = ['Home', 'Customers', 'Transactions', 'Offers'];

    constructor(private http: HttpClient) { }

    getCustomers() {
        return this.http.get<any>('assets/data/customers.json')
        .toPromise()
        .then(res => <Customer[]>res.data)
        .then(data => { return data; });
    }
}