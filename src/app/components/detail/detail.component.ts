import { AsyncPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [HttpClientModule, AsyncPipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  apiUrl = 'https://fakestoreapi.com/products';
  loading$ = new BehaviorSubject<boolean>(true);
  productDetail$ = new BehaviorSubject<any>(null);
  error$ = new BehaviorSubject<string | null>(null);
  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.params.subscribe((params) => {
      const productId = +params['id']; // '+' converts the id to a number
      this.getProductById(productId)
        .pipe(
          catchError((error) => {
            this.error$.next('Error fetching products');
            return throwError(() => {
              this.loading$.next(false);
              error;
            });
          })
        )
        .subscribe((product) => this.productDetail$.next(product));
    });
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + id).pipe(
      catchError((error) => {
        console.error('Error fetching products:', error);
        return throwError(() => error);
      })
    );
  }
}
