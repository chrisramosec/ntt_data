import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Product } from '../../../shared/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private productSubject = new BehaviorSubject<Product | null>(null);
  selectedProduct$: Observable<Product | null> = this.productSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Sets the currently selected product.
   * @param product The product to select.
   */
  setProduct(product: Product): void {
    this.productSubject.next(product);
  }

  /**
   * Retrieves the list of all products from the server.
   * @returns An observable with the list of products.
   */
  index(): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>('/bp/products');
  }

  /**
   * Filters the given product list based on the search term.
   * @param products List of products to filter.
   * @param term Search term to match against product name or description.
   * @returns A filtered list of products.
   */
  filter(products: Product[], term: string): Product[] {
    const lowerTerm = term.toLowerCase().trim();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
  }

  /**
   * Returns a paginated slice of the product list.
   * @param products Full list of products.
   * @param page Current page number (1-based).
   * @param size Number of items per page.
   * @returns Paginated products for the current page.
   */
  paginate(products: Product[], page: number, size: number): Product[] {
    const start = (page - 1) * size;
    return products.slice(start, start + size);
  }

  /**
   * Sends a request to create a new product.
   * @param product The product to create.
   * @returns An observable containing the server response.
   */
  create(product: Product): Observable<{ message: string; data: Product }> {
    return this.http.post<{ message: string; data: Product }>('/bp/products', product);
  }

  /**
   * Sends a request to update an existing product.
   * @param product The product to update.
   * @returns An observable containing the server response.
   */
  update(product: Product): Observable<{ message: string; data: Product }> {
    return this.http.put<{ message: string; data: Product }>(`/bp/products/${product.id}`, product);
  }

  /**
   * Checks whether a product with the given ID already exists.
   * @param id Product ID to verify.
   * @returns An observable with the HTTP response indicating existence.
   */
  exists(id: string): Observable<HttpResponse<boolean>> {
    return this.http.get<boolean>(`/bp/products/verification/${id}`, { observe: 'response' });
  }

  /**
   * Adds a specified number of years to a date.
   * @param date The base date.
   * @param years Number of years to add.
   * @returns A new Date with the added years.
   */
  addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  /**
   * Formats a date object into a 'YYYY-MM-DD' string.
   * @param date Date to format.
   * @returns The formatted date string.
   */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
