import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule, AsyncPipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  constructor(private http: HttpClient, private router: Router) {
    this.getProducts()
      .pipe(
        catchError((error) => {
          this.error$.next('Error fetching products');
          return throwError(() => {
            error;
          });
        })
      )
      .subscribe((products) => this.products$.next(products));
  }
  apiUrl = 'https://fakestoreapi.com/products';
  columns = ['Title', 'Category', 'Description', 'Image'];
  products$ = new BehaviorSubject<any>(null);
  error$ = new BehaviorSubject<string | null>(null);
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }
  navigateToDetail(id: number) {
    this.router.navigate(['/details', id]);
  }
}
