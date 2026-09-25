import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RatingModule } from 'primeng/rating';
import { finalize, timeout } from 'rxjs';
import { ProductPayload } from '../../../models/product.model';
import { ProductsService } from '../../../services/products';

type FormMode = 'create' | 'view' | 'edit';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RatingModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  mode: FormMode = 'create';
  productId: number | null = null;
  loading = false;
  submitting = false;
  error = '';

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productsService: ProductsService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.nonNullable.group({
      image: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');

      if (!idParam) {
        this.productId = null;
        this.mode = 'create';
        this.error = '';
        this.loading = false;
        this.form.reset({
          image: '',
          name: '',
          price: '',
          rating: 0,
        });
        this.form.enable();
        return;
      }

      const parsedId = Number(idParam);
      if (Number.isNaN(parsedId)) {
        this.productId = null;
        this.error = 'Id produs invalid.';
        this.loading = false;
        return;
      }

      this.productId = parsedId;
      this.mode = this.router.url.endsWith('/edit') ? 'edit' : 'view';
      this.loadProduct(parsedId);
    });
  }

  get title(): string {
    if (this.mode === 'create') {
      return 'Adauga produs';
    }

    if (this.mode === 'edit') {
      return 'Editare produs';
    }

    return 'Vizualizare produs';
  }

  get readOnly(): boolean {
    return this.mode === 'view';
  }

  enableEditMode(): void {
    if (!this.productId) {
      return;
    }

    this.router.navigate(['/products', this.productId, 'edit']);
  }

  submit(): void {
    if (this.readOnly || this.form.invalid) {
      this.form.markAllAsTouched();

      if (this.areAllFieldsEmpty()) {
        this.error = 'Completeaza cel putin un camp inainte de trimitere.';
      }

      return;
    }

    this.submitting = true;
    this.error = '';

    const payload: ProductPayload = this.form.getRawValue();

    if (this.mode === 'create') {
      this.productsService.createProduct(payload).subscribe({
        next: (result) => {
          this.submitting = false;
          this.router.navigate(['/products', result.id]);
        },
        error: () => {
          this.submitting = false;
          this.error = 'Nu s-a putut crea produsul.';
        },
      });
      return;
    }

    if (!this.productId) {
      this.submitting = false;
      this.error = 'Id produs invalid.';
      return;
    }

    this.productsService.updateProduct(this.productId, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/products', this.productId]);
      },
      error: () => {
        this.submitting = false;
        this.error = 'Nu s-a putut actualiza produsul.';
      },
    });
  }

  private areAllFieldsEmpty(): boolean {
    const { image, name, price, rating } = this.form.getRawValue();

    return !image && !name && !price && rating === 0;
  }

  private loadProduct(id: number): void {
    this.loading = true;
    this.error = '';

    this.productsService
      .getProductById(id)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (product) => {
          this.form.patchValue({
            image: product.image,
            name: product.name,
            price: product.price,
            rating: product.rating,
          });

          if (this.readOnly) {
            this.form.disable();
          } else {
            this.form.enable();
          }
        },
        error: (err) => {
          const status = err?.status ? ` (status ${err.status})` : '';
          this.error = `Produsul nu a fost gasit${status}.`;
        },
      });
  }

  resolveImageUrl(image: string | null | undefined): string {
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
