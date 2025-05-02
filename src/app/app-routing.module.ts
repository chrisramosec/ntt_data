import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPageComponent } from './features/products/pages/product-page/product-page.component';
import { ProductCreatePageComponent } from './features/products/pages/product-create-page/product-create-page.component';
import { ProductUpdatePageComponent } from './features/products/pages/product-update-page/product-update-page.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductPageComponent, canActivate: [AuthGuard] },
  { path: 'add-product', component: ProductCreatePageComponent, canActivate: [AuthGuard] },
  { path: 'update-product', component: ProductUpdatePageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
