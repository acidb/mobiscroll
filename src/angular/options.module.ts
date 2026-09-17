import { NgModule } from '@angular/core';
import { MbscOptionsProviderComponent } from './options.provider';

export { MbscOptionsProviderComponent };

export * from './options.service';

@NgModule({
  declarations: [MbscOptionsProviderComponent],
  exports: [MbscOptionsProviderComponent],
})
export class MbscOptionsModule {}
