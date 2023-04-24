import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Transaction } from '../domain/transaction';

@Injectable()
export class TransactionService {

    constructor(private http: HttpClient) { }

    getTranactions() {
        return this.http.get<any>('assets/data/transactions.json')
        .toPromise()
        .then(res => <Transaction[]>res.data)
        .then(data => { return data; });
    }
}