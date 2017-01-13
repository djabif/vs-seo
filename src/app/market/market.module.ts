import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {MarketComponent} from './market.component';
import {LandingModule} from './modules/landing/landing.module';
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";
import {IndividualVisaModule} from "./modules/individualVisa/individualVisa.module";
import {BusinessVisaModule} from "./modules/businessVisa/businessVisa.module";
import {TermsAndConditionsModule} from "./modules/termsAndConditions/termsAndConditions.module";
import {PrivacyPolicyModule} from "./modules/privacyPolicy/privacyPolicy.module";
import {LoginModule} from "./modules/login/login.module";
import {SignUpModule} from "./modules/signUp/signUp.module";

@NgModule({
  imports: [
    SharedModule,
    LandingModule,
    IndividualVisaModule,
    BusinessVisaModule,
    TermsAndConditionsModule,
    PrivacyPolicyModule,
    LoginModule,
    SignUpModule
  ],
  declarations: [
    MarketComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class MarketModule {
}
