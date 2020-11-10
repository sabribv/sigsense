import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AssetsComponent } from './pages/assets/assets.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { LoginService } from './services/api/login.service';
import { AuthenticationService } from './services/authentication.service';
import { HeaderComponent } from './components/header/header.component';
import { CompanyBuilderService } from './services/company-builder.service';
import { ApiInterceptorService } from './interceptors/api-interceptor.service';
import { AssetsAdapter } from './adapters/assets.adapter';
import { CompanyService } from './services/api/company.service';
import { AssetService } from './services/api/asset.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AssetsComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [
    LoginService,
    AuthenticationService,
    CompanyBuilderService,
    CompanyService,
    AssetService,
    AssetsAdapter,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
