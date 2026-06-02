import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookDetailComponent } from './pages/book-detail/book-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'book/:id', component: BookDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-success', component: PaymentSuccessComponent },
  { path: 'orders', component: OrderHistoryComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'writers', component: HomeComponent }, // Placeholder
  { path: '**', redirectTo: '' }
];

// Made with Bob
