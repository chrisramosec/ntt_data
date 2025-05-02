import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../../shared/models/product.model';
import { HttpResponse } from '@angular/common/http';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product 1', description: 'Description 1', logo: 'product1.png', date_release: '2025-01-01', date_revision: '2026-01-01' },
    { id: '2', name: 'Product 2', description: 'Description 2', logo: 'product2.png', date_release: '2025-01-01', date_revision: '2026-01-01' },
  ];

  const mockProduct: Product = {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    logo: 'product1.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a product', () => {
    service.setProduct(mockProduct);
    service.selectedProduct$.subscribe(product => {
      expect(product).toEqual(mockProduct);
    });
  });

  it('should fetch products with index()', () => {
    service.index().subscribe(response => {
      expect(response.data).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should filter products correctly', () => {
    const searchTerm = 'Product 1';
    const filtered = service.filter(mockProducts, searchTerm);
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Product 1');
  });

  it('should paginate products correctly', () => {
    const page = 1;
    const size = 1;
    const paginated = service.paginate(mockProducts, page, size);
    expect(paginated.length).toBe(1);
    expect(paginated[0].name).toBe('Product 1');
  });

  it('should create a product', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Product 3',
      description: 'Description 3',
      logo: 'product3.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    };

    service.create(newProduct).subscribe(response => {
      expect(response.data.name).toBe('Product 3');
      expect(response.message).toBe('Product created');
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Product created', data: newProduct });
  });

  it('should update a product', () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'productupdated.png',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    };

    service.update(updatedProduct).subscribe(response => {
      expect(response.data.name).toBe('Updated Product');
      expect(response.message).toBe('Product updated');
    });

    const req = httpMock.expectOne(`/bp/products/${updatedProduct.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Product updated', data: updatedProduct });
  });

  it('should check if a product exists', () => {
    const productId = '1';
    service.exists(productId).subscribe((response: HttpResponse<boolean>) => {
      expect(response.body).toBe(true);
    });

    const req = httpMock.expectOne(`/bp/products/verification/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should add years to a date', () => {
    const date = new Date('2021-01-01');
    const newDate = service.addYears(date, 2);
    expect(newDate.getFullYear()).toBe(2022);
  });

  it('should format a date correctly', () => {
    const date = new Date('2021-01-01');
    const formattedDate = service.formatDate(date);
    expect(formattedDate).toBe('2021-01-01');
  });
});
