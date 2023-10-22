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
  {path : '', title: 'LOOK4ME', component : LandingPageComponent},
  {path : 'login',title: 'LOOK4ME:Login',  component : LoginComponent},
  {path : 'register',title: 'LOOK4ME:Register',  component : RegisterComponent},
  {path : 'post-found',title: 'LOOK4ME:Post',  component : PostFoundPageComponent},
  {path : 'post-lost',title: 'LOOK4ME:Post',  component : PostLostPageComponent},
  {path : 'found-items',title: 'LOOK4ME:Found',  component : FoundItemsPageComponent},
  {path : 'lost-items',title: 'LOOK4ME:Lost',  component : LostItemsPageComponent},
  {path : 'found-items/:searchTerm',title: 'LOOK4ME:Found',  component : FoundItemsPageComponent},
  {path : 'lost-items/:searchTerm',title: 'LOOK4ME:Lost',  component : LostItemsPageComponent},
  {path : 'lost-items/info/:itemID',title: 'LOOK4ME:LostInfo',  component : LostInfoPageComponent},
  {path : 'found-items/info/:itemID',title: 'LOOK4ME:FoundInfo',  component : FoundInfoPageComponent},
  {path : 'found-items/info/:itemID/edit-found',title: 'LOOK4ME:Edit',  component : EditFoundComponent},
  {path : 'lost-items/info/:itemID/edit-lost',title: 'LOOK4ME:Edit',  component : EditLostComponent},
  {path : 'profile/:id',title: 'LOOK4ME:Profile',  component : ProfilePageComponent},
  {path : 'admin-page/:id',title: 'LOOK4ME:Admin',  component : AdminPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
