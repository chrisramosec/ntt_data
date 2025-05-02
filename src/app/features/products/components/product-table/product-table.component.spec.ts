import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableComponent } from './product-table.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../../../../shared/models/product.model';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  let productService: ProductService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTableComponent],
      providers: [
        {
          provide: ProductService,
          useValue: {
            index: jest.fn(),
            filter: jest.fn(),
            paginate: jest.fn(),
            setProduct: jest.fn(),
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    });

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      }
    ];

    // Simula la respuesta del servicio
    jest.spyOn(productService, 'index').mockReturnValue(of({ data: mockProducts }));
    jest.spyOn(productService, 'filter').mockReturnValue(mockProducts);
    jest.spyOn(productService, 'paginate').mockReturnValue(mockProducts);

    component.ngOnInit();

    expect(productService.index).toHaveBeenCalled();
    expect(component.allProducts).toEqual(mockProducts);
  });

  it('should apply filter correctly', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      }
    ];

    component.allProducts = mockProducts;
    component.searchTerm = 'Product 1';

    jest.spyOn(productService, 'filter').mockReturnValue([mockProducts[0]]);

    component.applyFilter();

    expect(productService.filter).toHaveBeenCalledWith(mockProducts, 'Product 1');
    expect(component.filteredProducts).toEqual([mockProducts[0]]);
  });

  it('should update pagination correctly', () => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'logo.png',
        date_release: '2025-01-01',
        date_revision: ''
      }
    ];

    component.filteredProducts = mockProducts;
    component.page = 1;
    component.size = 1;

    jest.spyOn(productService, 'paginate').mockReturnValue([mockProducts[0]]);

    component.updatePagination();

    expect(productService.paginate).toHaveBeenCalledWith(mockProducts, 1, 1);
    expect(component.paginatedProducts).toEqual([mockProducts[0]]);
  });

  it('should navigate to add product screen', () => {
    component.goToAddProduct();

    expect(router.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should navigate to update product screen when editing', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo.png',
      date_release: '2025-01-01',
      date_revision: ''
    };

    component.onEdit(mockProduct);

    expect(productService.setProduct).toHaveBeenCalledWith(mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/update-product']);
  });

  it('should toggle dropdown menu correctly', () => {
    const productId = '1';

    // Cambiar a un valor distinto de null
    component.toggleDropdown(productId);
    expect(component.openedDropdownId).toBe(productId);

    // Cambiar de vuelta a null
    component.toggleDropdown(productId);
    expect(component.openedDropdownId).toBe(null);
  });

  it('should generate correct initials from product name', () => {
    const name = 'Product Name Example';
    const initials = component.getInitials(name);

    expect(initials).toBe('PN');
  });
});
