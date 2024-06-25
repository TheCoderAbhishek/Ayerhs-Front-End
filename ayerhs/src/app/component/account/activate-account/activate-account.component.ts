import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from '../../layout/loader/loader.service';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Subscription } from 'rxjs';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoaderComponent],
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css'],
})
export class ActivateAccountComponent implements OnDestroy {
  isLoading = false;
  private subscription: Subscription;

  inOtpRequestDto: InOtpRequestDto;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loaderService: LoaderService,
    private accountService: AccountService
  ) {
    this.inOtpRequestDto = new InOtpRequestDto();
    this.subscription = this.loaderService.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loaderService.setLoading(false);
      }
    });
  }

  navigateToLogin() {
    this.loaderService.setLoading(true);
    this.router.navigate(['/login']);
  }

  onActivateAccount(activateAccountForm: NgForm) {
    if (activateAccountForm.invalid) {
      Object.keys(activateAccountForm.controls).forEach((field) => {
        const control = activateAccountForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.loaderService.setLoading(true);
    this.inOtpRequestDto.Use = 1;
    this.accountService
      .generateOtp(this.inOtpRequestDto.Email, 1)
      .subscribe((response: any) => {
        this.loaderService.setLoading(false);
        if (response.response === 1) {
          alert(response.successMessage);
          this.router.navigate(['/otp-verification'], {
            queryParams: {
              email: this.inOtpRequestDto.Email,
            },
          });
        } else {
          alert(response.errorMessage);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export class InOtpRequestDto {
  Email: string;
  Use: number;

  constructor() {
    this.Email = '';
    this.Use = 1;
  }
}
