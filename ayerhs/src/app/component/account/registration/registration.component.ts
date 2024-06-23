import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from '../../layout/loader/loader.service';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { AccountService } from '../account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoaderComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnDestroy {
  passwordFieldType: string = 'password';
  isLoading = false;
  private subscription: Subscription;

  registerFormDto: RegisterFormDto = {
    ClientName: '',
    ClientUsername: '',
    ClientEmail: '',
    ClientPassword: '',
    ClientMobileNumber: '',
    RoleId: null,
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private accountService: AccountService,
    private loaderService: LoaderService
  ) {
    this.subscription = this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loaderService.setLoading(false);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  navigateToLogin() {
    this.loaderService.setLoading(true);
    this.router.navigate(['/login']);
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      Object.keys(registerForm.controls).forEach((field) => {
        const control = registerForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.loaderService.setLoading(true);
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/RegisterClient',
        this.registerFormDto
      )
      .subscribe(
        (response: any) => {
          this.loaderService.setLoading(false);
          if (response.response === 1) {
            if (
              confirm(
                'Registration Successful. Do you want to activate your account now?'
              )
            ) {
              this.loaderService.setLoading(true);
              this.accountService
                .generateOtp(this.registerFormDto.ClientEmail)
                .subscribe(
                  (otpResponse: any) => {
                    this.loaderService.setLoading(false);
                    if (otpResponse.response === 1) {
                      this.router.navigate(['/otp-verification'], {
                        queryParams: {
                          email: this.registerFormDto.ClientEmail,
                        },
                      });
                    } else {
                      alert(
                        'OTP Generation Failed: ' + otpResponse.errorMessage
                      );
                    }
                  },
                  (error) => {
                    this.loaderService.setLoading(false);
                    alert('An error occurred while generating OTP.');
                  }
                );
            } else {
              this.router.navigate(['/login']);
            }
          } else {
            alert('Registration Unsuccessful');
          }
        },
        (error) => {
          this.loaderService.setLoading(false);
          alert('An error occurred during registration.');
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

interface RegisterFormDto {
  ClientName: string;
  ClientUsername: string;
  ClientEmail: string;
  ClientPassword: string;
  ClientMobileNumber: string;
  RoleId: number | null;
}
