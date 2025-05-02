import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductUpdateComponent } from './product-update.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../../../shared/models/product.model';

describe('ProductUpdateComponent', () => {
  let component: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let mockProductService: any;
  let router: Router;
  let navigateSpy: jest.SpyInstance;

  const selectedProduct: Product = {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: ''
  };

  beforeEach(async () => {
    mockProductService = {
      selectedProduct$: of(selectedProduct),
      formatDate: jest.fn((date: Date) => date.toISOString().split('T')[0]),
      addYears: jest.fn((date: Date, years: number) => {
        const newDate = new Date(date);
        newDate.setFullYear(date.getFullYear() + years);
        return newDate;
      }),
      update: jest.fn().mockReturnValue(of({ message: 'Updated', data: selectedProduct }))
    };

    await TestBed.configureTestingModule({
      declarations: [ProductUpdateComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: ProductService, useValue: mockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductUpdateComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = jest.spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset form and preserve product ID', () => {
    const mockForm: Partial<NgForm> = {
      resetForm: jest.fn()
    };

    component.product = selectedProduct;
    component.resetForm(mockForm as NgForm);

    expect(mockForm.resetForm).toHaveBeenCalledWith({
      id: '1',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
  });

  it('should update revision date on release date change', () => {
    const newRelease = '2023-05-01';
    component.product = { ...selectedProduct };
    component.onReleaseDateChange(newRelease);

    expect(component.product.date_release).toBe(newRelease);
    expect(component.product.date_revision).toBe('2024-05-01');
  });

  it('should not submit if form is invalid', () => {
    const invalidForm = { valid: false } as NgForm;
    component.product = selectedProduct;
    component.onSubmit(invalidForm);
    expect(mockProductService.update).not.toHaveBeenCalled();
  });
});
