import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductForm } from './pages/products/product-form/product-form';
import { ProductsList } from './pages/products/products-list/products-list';

export const routes: Routes = [
	{
		path: '',
		component: Home,
	},
	{
		path: 'products',
		component: ProductsList,
	},
	{
		path: 'products/new',
		component: ProductForm,
	},
	{
		path: 'products/:id',
		component: ProductForm,
	},
	{
		path: 'products/:id/edit',
		component: ProductForm,
	},
	{
		path: '**',
		redirectTo: '',
	},
];