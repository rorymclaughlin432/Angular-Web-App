import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Transaction } from '../../domain/transaction';
import { TransactionService } from '../../services/transactionservice';
import { Parser } from '@json2csv/plainjs';
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
  providers: [ConfirmationService, MessageService, TransactionService]
})
export class TransactionsComponent implements OnInit {
  title = 'Angular';

  transactionDialog: boolean;

  transactions: Transaction[];

  transaction: Transaction;

  selectedTransactions: Transaction[];

  submitted: boolean;

  registerStatus: any[];

  genderStatus: any[];

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.transactionService.getTranactions().then((data) => (this.transactions = data));

    this.registerStatus = [
      { label: 'Register', value: 'Register' },
      { label: 'Deregister', value: 'Deregister' }
    ];

    this.genderStatus = [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
      { label: 'Other', value: 'Other' }
    ];
  }
  public saveFileExtension = 'csv';

  onSaveFile() {
    let fileName = `TX01.${this.saveFileExtension}`;

    this.confirmationService.confirm({
      message: 'Are you sure you want to download the selected transaction(s)?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.transactions = this.transactions.filter((val) => this.selectedTransactions.includes(val));
        const link = document.createElement('a');
        let fileContent = this.transactions;
        //let transContent = JSON.stringify({ fileContent });
        let showHeaders = true;
        let json2csvParser = new Parser({ delimiter: "|", header: showHeaders });
        let transContentFile = json2csvParser.parse(fileContent) + "\n";
        const file = new Blob([transContentFile as BlobPart], { type: 'text/csv' });
        const objectUrl = URL.createObjectURL(file);
        link.href = objectUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(objectUrl);

        this.selectedTransactions = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Transaction(s) downloaded',
          life: 3000
        });
      }
    });
  }

  openNew() {
    this.transaction = {};
    this.submitted = false;
    this.transactionDialog = true;
  }

  deleteSelectedTransactions() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected transaction(s)?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.transactions = this.transactions.filter((val) => !this.selectedTransactions.includes(val));
        this.selectedTransactions = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Transaction Deleted',
          life: 3000
        });
      }
    });
  }

  editTransaction(transaction: Transaction) {
    this.transaction = { ...transaction };
    this.transactionDialog = true;
  }

  deleteTransaction(transaction: Transaction) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete transaction: ' + transaction.id + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.transactions = this.transactions.filter((val) => val.id !== transaction.id);
        this.transaction = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Transaction Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.transactionDialog = false;
    this.submitted = false;
  }

  saveTransaction() {
    this.submitted = true;

    if (this.transaction.id.trim()) {
      if (this.transaction.id) {
        this.transactions[this.findIndexById(this.transaction.id)] = this.transaction;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Transaction Updated',
          life: 3000
        });
      } else {
        this.transaction.id = this.createId();
        this.transactions.push(this.transaction);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Transaction Created',
          life: 3000
        });
      }

      this.transactions = [...this.transactions];
      this.transactionDialog = false;
      this.transaction = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.transactions.length; i++) {
      if (this.transactions[i].id === id) {
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
