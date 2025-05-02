import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductPageComponent } from './features/products/pages/product-page/product-page.component';
import { ProductTableComponent } from './features/products/components/product-table/product-table.component';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ProductCreateComponent } from './features/products/components/product-create/product-create.component';
import { ProductCreatePageComponent } from './features/products/pages/product-create-page/product-create-page.component';
import { ProductUpdatePageComponent } from './features/products/pages/product-update-page/product-update-page.component';
import { ProductUpdateComponent } from './features/products/components/product-update/product-update.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductPageComponent,
    ProductTableComponent,
    ProductCreateComponent,
    ProductCreatePageComponent,
    ProductUpdatePageComponent,
    ProductUpdateComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
