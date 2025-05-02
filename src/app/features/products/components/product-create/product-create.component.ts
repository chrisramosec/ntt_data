import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  releaseDate = '';
  revisionDate = '';
  isIdTaken = false;

  feedbackMessage = '';
  feedbackClass: 'success' | 'error' = 'success';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  /**
   * Initializes the form with today's date as the release date
   * and a revision date set one year ahead.
   */
  ngOnInit(): void {
    const today = new Date();
    this.releaseDate = this.productService.formatDate(today);
    this.revisionDate = this.productService.formatDate(this.productService.addYears(today, 1));
  }

  /**
   * Updates the revision date when the release date changes.
   * @param dateStr The new release date string.
   */
  onReleaseDateChange(dateStr: string): void {
    if (!dateStr) {
      this.revisionDate = '';
      return;
    }

    const release = new Date(dateStr);
    this.revisionDate = this.productService.formatDate(this.productService.addYears(release, 1));
  }

  /**
   * Validates if the provided product ID is already taken.
   * @param id Product ID entered by the user.
   */
  validateProductIdUniqueness(id: string): void {
    if (!id) {
      this.isIdTaken = false;
      return;
    }

    this.productService.exists(id).subscribe({
      next: response => {
        this.isIdTaken = response.body === true;
      },
      error: error => {
        if (error.status === 404) {
          this.isIdTaken = false;
        } else {
          console.error('Product ID verification failed:', error);
        }
      }
    });
  }

  /**
   * Submits the form to create a new product.
   * Prevents submission if form is invalid or ID is already taken.
   * @param form The product creation form.
   */
  onSubmit(form: NgForm): void {
    if (form.invalid || this.isIdTaken) return;

    const productData = {
      ...form.value,
      date_revision: this.revisionDate
    };

    this.productService.create(productData).subscribe({
      next: () => this.handleFeedback('Producto creado satisfactoriamente.', 'success'),
      error: () => this.handleFeedback('El producto no pudo crearse.', 'error')
    });
  }

  /**
   * Displays feedback to the user and navigates to home after a short delay.
   * @param message Feedback message.
   * @param type 'success' or 'error'.
   */
  handleFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackClass = type;

    setTimeout(() => {
      this.router.navigate(['/']);
    }, 2500);
  }
}
