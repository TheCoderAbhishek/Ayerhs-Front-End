import { Routes } from '@angular/router';
import { LoginComponent } from './component/account/login/login.component';
import { RegistrationComponent } from './component/account/registration/registration.component';
import { LayoutComponent } from './component/layout/layout/layout.component';
import { DashboardComponent } from './component/layout/dashboard/dashboard.component';
import { OtpVerificationComponent } from './component/account/otp-verification/otp-verification.component';
import { ActivateAccountComponent } from './component/account/activate-account/activate-account.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: 'otp-verification',
    component: OtpVerificationComponent,
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
];
