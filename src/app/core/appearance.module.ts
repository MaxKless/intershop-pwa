import { NgModule } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { IconModule } from './icon.module';

@NgModule({
  imports: [
    IconModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      positionClass: 'toast-top-full-width', // toast-top-center
      preventDuplicates: true,
    }),
  ],
})
export class AppearanceModule {
  constructor(popoverConfig: NgbPopoverConfig) {
    popoverConfig.placement = 'top';
    popoverConfig.triggers = 'hover';
    popoverConfig.container = 'body';
  }
}
