import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product';
import { Product } from '../../interface/product.interface';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-component',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})


export class ProductsComponent implements OnInit {

  formGroup: FormGroup;
  products: Product[] = [];
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.formBuilder.group({
      stock: [0, [Validators.required]],
      category: ['', Validators.required],
      description: ['', Validators.required],
      lote: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      others: [''],
      quantity: [0, [Validators.required]],
      image_url: ['']
    });
  }

  ngOnInit(): void {
  }

  get totalValue(): number {
    const price = this.formGroup.get('price')?.value || 0;
    const quantity = this.formGroup.get('quantity')?.value || 0;
    return price * quantity;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.productService.createProduct(this.formGroup.value).subscribe(
        (response) => {
          console.log('Product created:', response);
          this.formGroup.reset();
        },
        (error) => {
          console.error('Error creating product:', error);
        }
      );
    }
  }
}
