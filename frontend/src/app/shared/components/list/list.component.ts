import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product';
import { Product } from '../../interface/product.interface';
import { GoBack } from '../go_Back/goBack';
import { Categories } from '../../interface/categories';

@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [CommonModule, GoBack],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  products: Product[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  categories: Categories[] = [
    { id: 1, name: 'Roteador' },
    { id: 2, name: 'Switch' },
    { id: 3, name: 'Papelaria' },
  ];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Não foi possível carregar os produtos.';
        this.isLoading = false;
      }
    });
  }

  getCategoryName(category: string | number): string {
    const categoryId = Number(category);
    const foundCategory = this.categories.find((item) => item.id === categoryId);
    return foundCategory?.name ?? String(category);
  }
}
