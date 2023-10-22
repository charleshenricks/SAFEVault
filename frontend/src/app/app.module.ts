import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { InputContainerComponent } from './components/input/input-container/input-container.component';
import { InputLoadingComponent } from './components/input/input-loading/input-loading.component';
import { TextInputComponent } from './components/input/text-input/text-input.component';
import { InputValidationComponent } from './components/input/input-validation/input-validation.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { FoundInfoPageComponent } from './components/found-info-page/found-info-page.component';
import { LostInfoPageComponent } from './components/lost-info-page/lost-info-page.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { PostLostPageComponent } from './components/post-lost-page/post-lost-page.component';
import { PostFoundPageComponent } from './components/post-found-page/post-found-page.component';
import { FoundItemsPageComponent } from './components/found-items-page/found-items-page.component';
import { LostItemsPageComponent } from './components/lost-items-page/lost-items-page.component';
import { SearchComponent } from './components/search/search.component';
import { Search2Component } from './components/search2/search2.component';
import { EditFoundComponent } from './components/edit-found/edit-found.component';
import { EditLostComponent } from './components/edit-lost/edit-lost.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    InputContainerComponent,
    InputLoadingComponent,
    TextInputComponent,
    InputValidationComponent,
    HeaderComponent,
    ProfilePageComponent,
    FoundInfoPageComponent,
    LostInfoPageComponent,
    PostLostPageComponent,
    PostFoundPageComponent,
    FoundItemsPageComponent,
    LostItemsPageComponent,
    SearchComponent,
    Search2Component,
    EditFoundComponent,
    EditLostComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false,
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
