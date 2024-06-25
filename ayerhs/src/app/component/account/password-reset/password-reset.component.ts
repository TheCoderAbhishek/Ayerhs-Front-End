import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoaderService } from '../../layout/loader/loader.service';
import { LoaderComponent } from '../../layout/loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, LoaderComponent],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  email: string = '';
  otp: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading = false;
  private subscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
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

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });
  }

  onPasswordReset(passwordResetForm: NgForm) {
    if (passwordResetForm.invalid || this.password !== this.confirmPassword) {
      Object.keys(passwordResetForm.controls).forEach((field) => {
        const control = passwordResetForm.control.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      return;
    }
    this.loaderService.setLoading(true);
    const resetPasswordDto = {
      Email: this.email,
      Otp: this.otp,
      Password: this.password,
    };
    this.http
      .post(
        'https://localhost:44302/ayerhs-security/Account/ResetPassword',
        resetPasswordDto
      )
      .subscribe(
        (response: any) => {
          this.loaderService.setLoading(false);
          if (response.response === 1) {
            alert(response.successMessage);
            this.router.navigate(['/login']);
          } else {
            alert(response.errorMessage);
          }
        },
        (error) => {
          this.loaderService.setLoading(false);
          alert('An error occurred. Please try again.');
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
