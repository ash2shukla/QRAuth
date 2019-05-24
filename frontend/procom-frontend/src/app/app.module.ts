import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from '@app/app-routing.module';
import { StorageService } from '@app/core';
import { HttpClientModule } from '@angular/common/http';
import { InterceptAuthService } from '@app/shared/intercept-auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from '@app/core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    SharedModule,
    CoreModule
  ],
  providers: [
    StorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptAuthService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
