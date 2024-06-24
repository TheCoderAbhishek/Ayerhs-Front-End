import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { LoaderService } from '../../layout/loader/loader.service';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Subscription } from 'rxjs';

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
    private loaderService: LoaderService
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

  onActivateAccount(activateAccountForm: NgForm) {
    if (activateAccountForm.invalid) {
      Object.keys(activateAccountForm.controls).forEach((field) => {
        const control = activateAccountForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.loaderService.setLoading(true);
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/OtpGenerationAndEmail',
        this.inOtpRequestDto
      )
      .subscribe((response: any) => {
        this.loaderService.setLoading(false);
        if (response.response === 1) {
          alert(response.successMessage);
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

  constructor() {
    this.Email = '';
  }
}
