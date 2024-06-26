import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { LoaderService } from '../../layout/loader/loader.service';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Subscription } from 'rxjs';
import { AccountService } from '../account.service';
import { EncryptionService } from '../../../shared/encryptionService/encryption.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  passwordFieldType: string = 'password';
  isLoading = false;
  private subscription: Subscription;

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  inLoginClientDto: InLoginClientDto;
  constructor(
    private http: HttpClient,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService,
    private encryptionService: EncryptionService
  ) {
    this.inLoginClientDto = new InLoginClientDto();
    this.subscription = this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loaderService.setLoading(false);
      }
    });
  }

  navigateToRegistration() {
    this.loaderService.setLoading(true);
    this.router.navigate(['/registration']);
  }

  navigateToActivateAccount() {
    this.loaderService.setLoading(true);
    this.router.navigate(['/activate-account']);
  }

  navigateForgotPassword(){
    this.loaderService.setLoading(true);
    this.router.navigate(['/forgot-password']);
  }

  onLogin(loginForm: NgForm) {
    if (loginForm.invalid) {
      Object.keys(loginForm.controls).forEach((field) => {
        const control = loginForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }

    this.inLoginClientDto.ClientPassword = this.encryptionService.encrypt(this.inLoginClientDto.ClientPassword);

    this.loaderService.setLoading(true);
    this.accountService.loginClient(this.inLoginClientDto).subscribe(
      (response: any) => {
        this.loaderService.setLoading(false);
        if (response.response === 1) {
          alert(response.successMessage);
          this.router.navigate(['/dashboard']);
        } else {
          alert(response.errorMessage);
        }
      },
      (error) => {
        console.error('Login request failed', error);
        this.loaderService.setLoading(false);
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export class InLoginClientDto {
  ClientEmail: string;
  ClientPassword: string;
  constructor() {
    this.ClientEmail = '';
    this.ClientPassword = '';
  }
}
