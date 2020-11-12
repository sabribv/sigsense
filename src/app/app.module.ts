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
import { MatFormFieldModule } from '@angular/material/form-field';

import { LoginService } from './services/api/login.service';
import { AuthenticationService } from './services/authentication.service';
import { HeaderComponent } from './components/header/header.component';
import { CompanyHelperService } from './services/company-helper.service';
import { ApiInterceptorService } from './interceptors/api-interceptor.service';
import { CompanyService } from './services/api/company.service';
import { AssetService } from './services/api/asset.service';
import { AssetsListBuilder } from './services/assets-list-builder';
import { AssetsListAdapter } from './adapters/assets-list.adapter';
import { AssetAdapter } from './adapters/asset.adapter';
import { UserAdapter } from './adapters/user.adapter';


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
    MatIconModule,
    MatFormFieldModule
  ],
  providers: [
    LoginService,
    AuthenticationService,
    CompanyHelperService,
    CompanyService,
    AssetService,
    AssetsListBuilder,
    AssetsListAdapter,
    AssetAdapter,
    UserAdapter,
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
