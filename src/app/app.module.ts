import { NgModule } from '@angular/core';
import { PRIMENG_MODULES } from './shared-primeng-imports';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    PRIMENG_MODULES,
    HttpClientModule
  ]
})
export class AppModule { }
