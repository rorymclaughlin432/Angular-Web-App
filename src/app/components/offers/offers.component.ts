import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Offer } from '../../domain/offer';
import { OfferService } from '../../services/offerservice';
import { Parser } from '@json2csv/plainjs';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [ConfirmationService, MessageService, OfferService]
})
export class OffersComponent implements OnInit {
  title = 'Angular';

  offerDialog: boolean;

  offers: Offer[];

  offer: Offer;

  selectedOffers: Offer[];

  submitted: boolean;

  constructor(
    private offerService: OfferService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.offerService.getOffers().then((data) => (this.offers = data));
  }
  public saveFileExtension = 'json';

  onSaveFile() {
    let fileName = `offers.${this.saveFileExtension}`;

    this.confirmationService.confirm({
      message: 'Are you sure you want to download the selected offer(s)?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offers = this.offers.filter((val) => this.selectedOffers.includes(val));
        const link = document.createElement('a');
        let fileContent = JSON.stringify( {offers: this.offers} );
        const file = new Blob([fileContent as BlobPart], { type: 'text/json' });
        const objectUrl = URL.createObjectURL(file);
        link.href = objectUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(objectUrl);

        this.selectedOffers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer(s) downloaded',
          life: 3000
        });
      }
    });
  }

  openNew() {
    this.offer = {};
    this.submitted = false;
    this.offerDialog = true;
  }

  deleteSelectedOffers() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected offer(s)?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offers = this.offers.filter((val) => !this.selectedOffers.includes(val));
        this.selectedOffers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Deleted',
          life: 3000
        });
      }
    });
  }

  editOffer(offer: Offer) {
    this.offer = { ...offer };
    this.offerDialog = true;
  }

  deleteOffer(offer: Offer) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete offer: ' + offer.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.offers = this.offers.filter((val) => val.id !== offer.id);
        this.offer = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.offerDialog = false;
    this.submitted = false;
  }

  saveOffer() {
    this.submitted = true;

    if (this.offer.id.trim()) {
      if (this.offer.id) {
        this.offers[this.findIndexById(this.offer.id)] = this.offer;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Updated',
          life: 3000
        });
      } else {
        this.offer.id = this.createId();
        this.offers.push(this.offer);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Created',
          life: 3000
        });
      }

      this.offers = [...this.offers];
      this.offerDialog = false;
      this.offer = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.offers.length; i++) {
      if (this.offers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
