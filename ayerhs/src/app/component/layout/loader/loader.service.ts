import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  get isLoading(): boolean {
    return this.isLoadingSubject.value;
  }

  setLoading(isLoading: boolean) {
    this.isLoadingSubject.next(isLoading);
  }
}
