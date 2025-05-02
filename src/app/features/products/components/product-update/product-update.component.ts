import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Product } from '../../../../shared/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  product!: Product;
  todayDateString = '';
  feedbackMessage = '';
  feedbackClass: 'success' | 'error' = 'success';

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  /**
   * Component initialization lifecycle hook.
   * - Sets today's date.
   * - Retrieves selected product from ProductService.
   * - Redirects to product list if no product is selected.
   * - Automatically sets a revision date if missing.
   */
  ngOnInit(): void {
    this.todayDateString = this.productService.formatDate(new Date());

    this.productService.selectedProduct$
      .pipe(take(1))
      .subscribe(selectedProduct => {
        if (!selectedProduct) {
          this.router.navigate(['/products']);
          return;
        }

        this.product = { ...selectedProduct };

        if (!this.product.date_revision && this.product.date_release) {
          const releaseDate = new Date(this.product.date_release);
          this.product.date_revision = this.productService.formatDate(this.productService.addYears(releaseDate, 1));
        }
      });
  }

  /**
   * Resets the form while preserving the product ID.
   * @param form The form to reset.
   */
  resetForm(form: NgForm): void {
    const { id } = this.product;

    form.resetForm({
      id,
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
  }

  /**
   * Automatically updates the revision date when the release date changes.
   * @param newReleaseDate The new release date string (YYYY-MM-DD).
   */
  onReleaseDateChange(newReleaseDate: string): void {
    this.product.date_release = newReleaseDate;

    const releaseDate = new Date(newReleaseDate);
    this.product.date_revision = this.productService.formatDate(this.productService.addYears(releaseDate, 1));
  }

  /**
   * Handles form submission for product update.
   * Validates the form and sends update request to the service.
   * @param form The submitted form.
   */
  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const { id, name, description, logo, date_release, date_revision } = this.product;

    const updatedProduct: Product = {
      id,
      name,
      description,
      logo,
      date_release,
      date_revision
    };

    this.productService.update(updatedProduct).subscribe({
      next: () => this.handleFeedback('Producto actualizado satisfactoriamente.', 'success'),
      error: () => this.handleFeedback('El producto no pudo actualizarse.', 'error')
    });
  }

  /**
   * Displays feedback to the user and redirects after a short delay.
   * @param message Feedback message to display.
   * @param type Either 'success' or 'error'.
   */
  handleFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackClass = type;

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2500);
  }
}
