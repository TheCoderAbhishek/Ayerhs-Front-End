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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnDestroy {
  isLoading = false;
  private subscription: Subscription;

  inForgotPasswordDto: InForgotPasswordDto;

  constructor(
    private http: HttpClient,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.inForgotPasswordDto = new InForgotPasswordDto();
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

  onForgotPassword(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.invalid) {
      Object.keys(forgotPasswordForm.controls).forEach((field) => {
        const control = forgotPasswordForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.loaderService.setLoading(true);
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/RequestPasswordReset',
        this.inForgotPasswordDto
      )
      .subscribe((response: any) => {
        this.loaderService.setLoading(false);
        if (response.response === 1) {
          alert(response.successMessage);
          this.router.navigate(['/password-reset'], {
            queryParams: {
              email: this.inForgotPasswordDto.Email,
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

export class InForgotPasswordDto {
  Email: string;

  constructor() {
    this.Email = '';
  }
}
