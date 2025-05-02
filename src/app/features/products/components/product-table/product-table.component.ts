import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../shared/models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css']
})
export class ProductTableComponent implements OnInit {

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];

  searchTerm: string = '';
  page: number = 1;
  size: number = 5;
  openedDropdownId: string | null = null;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  /**
   * Angular lifecycle method - called once component is initialized.
   */
  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Loads the products from the API and applies initial filtering and pagination.
   */
  private loadProducts(): void {
    this.productService.index().subscribe({
      next: ({ data }) => {
        this.allProducts = data;
        this.applyFilter();
      },
      error: err => console.error('Error fetching products:', err)
    });
  }

  /**
   * Filters the products based on the current search term.
   */
  applyFilter(): void {
    this.filteredProducts = this.productService.filter(this.allProducts, this.searchTerm);
    this.page = 1;
    this.updatePagination();
  }

  /**
   * Updates the list of products shown on the current page.
   */
  updatePagination(): void {
    this.paginatedProducts = this.productService.paginate(this.filteredProducts, this.page, this.size);
  }

  /**
   * Navigates to the next page if available.
   */
  nextPage(): void {
    const maxPage = Math.ceil(this.filteredProducts.length / this.size);
    if (this.page < maxPage) {
      this.page++;
      this.updatePagination();
    }
  }

  /**
   * Navigates to the previous page if not on the first.
   */
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updatePagination();
    }
  }

  /**
   * Updates the page size and resets to the first page.
   * @param event HTML select event with new page size.
   */
  onSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.size = isNaN(newSize) ? 5 : newSize;
    this.page = 1;
    this.updatePagination();
  }

  /**
   * Navigates to the Add Product screen.
   */
  goToAddProduct(): void {
    this.router.navigate(['/add-product']);
  }

  /**
   * Toggles the dropdown menu for a given product row.
   * @param id The ID of the product row to toggle.
   */
  toggleDropdown(id: string): void {
    this.openedDropdownId = this.openedDropdownId === id ? null : id;
  }

  /**
   * Selects a product and navigates to the Update Product screen.
   * @param product The product to edit.
   */
  onEdit(product: Product): void {
    this.productService.setProduct(product);
    this.router.navigate(['/update-product']);
  }

  /**
   * Generates initials from a product name (e.g. "Christopher Ramos" -> "CR").
   * @param name The product name.
   * @returns The uppercase initials.
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
