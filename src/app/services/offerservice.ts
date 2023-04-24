import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Offer } from '../domain/offer';

@Injectable()
export class OfferService {

    constructor(private http: HttpClient) { }

    getOffers() {
        return this.http.get<any>('assets/data/offers.json')
        .toPromise()
        .then(res => <Offer[]>res.data)
        .then(data => { return data; });
    }
}