import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { finalize, timeout } from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductsService } from '../../../services/products';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, RouterLink, FormsModule, RatingModule],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  products: Product[] = [];
  page = 0;
  perPage = 8;
  totalPages = 0;
  total = 0;
  loading = false;
  error = '';
  deletingId: number | null = null;

  constructor(
    private readonly productsService: ProductsService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productsService
      .getProducts(this.page, this.perPage)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          this.products = response.items;
          this.totalPages = response.totalPages;
          this.total = response.total;
        },
        error: (err) => {
          const status = err?.status ? ` (status ${err.status})` : '';
          this.error = `Nu s-au putut incarca produsele${status}. Verifica backendul.`;
        },
      });
  }

  previousPage(): void {
    if (this.page <= 0) {
      return;
    }

    this.page -= 1;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.page >= this.totalPages - 1) {
      return;
    }

    this.page += 1;
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Sigur doresti sa stergi produsul "${product.name}"?`)) {
      return;
    }

    this.deletingId = product.id;

    this.productsService.deleteProduct(product.id).subscribe({
      next: () => {
        this.deletingId = null;

        if (this.products.length === 1 && this.page > 0) {
          this.page -= 1;
        }

        this.loadProducts();
      },
      error: () => {
        this.error = 'Nu s-a putut sterge produsul.';
        this.deletingId = null;
      },
    });
  }

  resolveImageUrl(image: string): string {
    if (!image) {
      return '';
    }

    if (
      image.startsWith('/') ||
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:') ||
      image.startsWith('blob:')
    ) {
      return image;
    }

    return `/${image}`;
  }
}
