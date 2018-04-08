import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Route } from '@angular/router';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';

import { TwitterService } from './shared/services/twitter.service'
import { ToastService } from './shared/services/toast.service';
import { KeysPipe } from './shared/pipes/keys.pipe'

const routes: Route[] = [
  { path: ``, redirectTo: `/home`, pathMatch: `full` },
  { path: `home`, component: MapComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [TwitterService, ToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
