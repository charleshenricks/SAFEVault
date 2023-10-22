import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PostFoundPageComponent } from './components/post-found-page/post-found-page.component';
import { PostLostPageComponent } from './components/post-lost-page/post-lost-page.component';
import { FoundItemsPageComponent } from './components/found-items-page/found-items-page.component';
import { LostItemsPageComponent } from './components/lost-items-page/lost-items-page.component';
import { LostInfoPageComponent } from './components/lost-info-page/lost-info-page.component';
import { FoundInfoPageComponent } from './components/found-info-page/found-info-page.component';
import { EditFoundComponent } from './components/edit-found/edit-found.component';
import { EditLostComponent } from './components/edit-lost/edit-lost.component';
import { ProfilePageComponent } from './components/profile-page/profile-page.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path : '', title: 'SAFEVault', component : LandingPageComponent},
  {path : 'login',title: 'SAFEVault:Login',  component : LoginComponent},
  {path : 'register',title: 'SAFEVault:Register',  component : RegisterComponent},
  {path : 'post-found',title: 'SAFEVault:Post',  component : PostFoundPageComponent},
  {path : 'post-lost',title: 'SAFEVault:Post',  component : PostLostPageComponent},
  {path : 'found-items',title: 'SAFEVault:Found',  component : FoundItemsPageComponent},
  {path : 'lost-items',title: 'SAFEVault:Lost',  component : LostItemsPageComponent},
  {path : 'found-items/:searchTerm',title: 'SAFEVault:Found',  component : FoundItemsPageComponent},
  {path : 'lost-items/:searchTerm',title: 'SAFEVault:Lost',  component : LostItemsPageComponent},
  {path : 'lost-items/info/:itemID',title: 'SAFEVault:LostInfo',  component : LostInfoPageComponent},
  {path : 'found-items/info/:itemID',title: 'SAFEVault:FoundInfo',  component : FoundInfoPageComponent},
  {path : 'found-items/info/:itemID/edit-found',title: 'SAFEVault:Edit',  component : EditFoundComponent},
  {path : 'lost-items/info/:itemID/edit-lost',title: 'SAFEVault:Edit',  component : EditLostComponent},
  {path : 'profile/:id',title: 'SAFEVault:Profile',  component : ProfilePageComponent},
  {path : 'admin-page/:id',title: 'SAFEVault:Admin',  component : AdminPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
