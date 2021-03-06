import { environment } from './../../environments/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../cart.service';
import { ExternalLibraryService } from '../util';

declare let Razorpay: any;
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  products: any[] = [];
  objectKeys = Object.keys;
  totalPrice = 0;
  quantity = 0;
  payableAmount = 0;
  WindowRef: any;
  processingPayment: boolean;
  paymentResponse:any = {};
  title = 'samplepayment';
  constructor(
    private cartService: CartService,
    private cd: ChangeDetectorRef,
    private razorpayService: ExternalLibraryService
  ) { }
  name = 'Angular';
  response;
  razorpayResponse;
  showModal = false;

  ngOnInit() {
    this.cartService.getCartItems()
      .subscribe(cartItems => {
        this.products = cartItems;
        this.calculatePrice();
      });
    

      this.razorpayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  RAZORPAY_OPTIONS = {
    "key": "rzp_test_RdbpDuMzvF1nBu",
    "amount": "",
    "name": "kart",
    "order_id": "",
    "description": "Load Wallet",
    "image": "https://www.underconsideration.com/brandnew/archives/flipkart_logo_detail_icon.jpg",
    "prefill": {
      "name": "",
      "email": "example@gmail.com",
      "contact": "",
      "method": ""
    },
    "modal": {},
    "theme": {
      "color": "#00c54f"
    }
  };

  public proceed() {
    this.RAZORPAY_OPTIONS.amount = this.totalPrice + '00';
    // binding this object to both success and dismiss handler
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    // this.showPopup();
    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
    razorpay.open();
  }

  public razorPaySuccessHandler(response) {
    console.log(response);
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges()
    document.getElementById('razorpay-response').style.display = 'block';
  }

  public test() {
    document.getElementById('response-modal').style.display = 'block';
    this.response = `dummy text`;
  }

  

  getValue(object) {
    const key = this.objectKeys(object);
    return object[key.toString()];
  }

  increaseProductQuantity(product) {
    product.quantity++;
    this.quantity += 1;
    this.totalPrice += product.price;
  }

  decreaseProductQuantity(product) {
    product.quantity--;
    this.quantity -= 1;
    this.totalPrice -= product.price;
  }

  calculatePrice() {
    this.totalPrice = 0;
    this.quantity = 0;
    for(let i = 0; i < this.products.length;i++) {
      this.totalPrice += this.products[i].quantity * this.products[i].price ;
      this.quantity += this.products[i].quantity ;
    }
  }

  proceedToPay($event) {
    this.processingPayment = true;
    this.payableAmount =  this.totalPrice * 100 ;
    this.initiatePaymentModal($event);
  }


  initiatePaymentModal(event) {

    let receiptNumber = `Receipt#${Math.floor(Math.random() * 5123 * 43) + 10}`;
    
    let orderDetails = {
      amount: this.payableAmount,
      receipt: receiptNumber
    }

  

   }


   preparePaymentDetails(order){

    var ref = this;
    return  {
      "key": environment.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      "amount": this.payableAmount, // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
      "name": 'Pay',
      "currency": order.currency,
      "order_id": order.id,//This is a sample Order ID. Create an Order using Orders API. (https://razorpay.com/docs/payment-gateway/orders/integration/#step-1-create-an-order). Refer the Checkout form table given below
      "image": 'https://angular.io/assets/images/logos/angular/angular.png',
      "handler": function (response){
        ref.handlePayment(response);
      },
      "prefill": {
          "name": `Angular Geeks`
      },
      "theme": {
          "color": "#2874f0"
      }
     };
   }

   handlePayment(response) {

   
  }

}
