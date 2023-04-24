import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Customer } from "../../domain/customer";
import { CustomerService } from "../../services/customerservice";
import { Parser } from '@json2csv/plainjs';

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.css"],
  providers: [ConfirmationService, MessageService, CustomerService]
  
})
export class CustomersComponent implements OnInit {
  title = "Angular";

  customerDialog: boolean;

  customers: Customer[];

  customer: Customer;

  selectedCustomers: Customer[];

  submitted: boolean;

  registerStatus: any[];

  genderStatus: any[];

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.customerService.getCustomers().then((data) => (this.customers = data));

    this.registerStatus = [
      { label: "Register", value: "Register" },
      { label: "Deregister", value: "Deregister" },
    ];

    this.genderStatus = [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Other", value: "Other" },
    ];

  }

  public saveFileExtension = 'csv';

  onSaveFile() {
    let fileName = `registrations.${this.saveFileExtension}`;

    this.confirmationService.confirm({
      message: 'Are you sure you want to download the selected customers(s)?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customers = this.customers.filter((val) => this.selectedCustomers.includes(val));
        const link = document.createElement('a');
        let fileContent = this.customers;
        let showHeaders = true;
        let json2csvParser = new Parser({ delimiter: "|", header: showHeaders });
        let customerContentFile = json2csvParser.parse(fileContent) + "\n";
        const file = new Blob([customerContentFile as BlobPart], { type: 'text/csv' });
        const objectUrl = URL.createObjectURL(file);
        link.href = objectUrl;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(objectUrl);

        this.selectedCustomers = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Customer(s) downloaded',
          life: 3000
        });
      }
    });
  }

  openNew() {
    this.customer = {};
    this.submitted = false;
    this.customerDialog = true;
  }



  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected customer(s)?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.customers = this.customers.filter(
          (val) => !this.selectedCustomers.includes(val)
        );
        this.selectedCustomers = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "customers Deleted",
          life: 3000,
        });
      },
    });
  }

  editCustomer(customer: Customer) {
    this.customer = { ...customer };
    this.customerDialog = true;
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + customer.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.customers = this.customers.filter((val) => val.id !== customer.id);
        this.customer = {};
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Customer Deleted",
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted = false;
  }

  saveCustomer() {
    this.submitted = true;

    if (this.customer.name.trim()) {
      if (this.customer.id) {
        this.customers[this.findIndexById(this.customer.id)] = this.customer;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Customer Updated",
          life: 3000,
        });
      } else {
        this.customer.id = this.createId();
        this.customers.push(this.customer);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Customer Created",
          life: 3000,
        });
      }

      this.customers = [...this.customers];
      this.customerDialog = false;
      this.customer = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.customers.length; i++) {
      if (this.customers[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = "";
    var chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}
