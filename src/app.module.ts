import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { EducationalModelModule } from './educational-model/educational-model.module';
import { SubjectModule } from './subject/subject.module';
import { LocationModule } from './location/location.module';
import { ProductModule } from './product/product.module';
import { AgeModule } from './age/age.module';
import { StripeModule } from './stripe/stripe.module';
import { ZapierModule } from './zapier/zapier.module';
import { SchoolModule } from './school/school.module';
import { CouponModule } from './coupon/coupon.module';
import { DepositModule } from './deposit/deposit.module';
import { ProductOrderModule } from './product-order/product-order.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { FlywireModule } from './flywire/flywire.module';
import { PaymentModule } from './payment/payment.module';
import { StripeWebhookModule } from './stripe-webhook/stripe-webhook.module';
import { ProgramDateModule } from './program-date/program-date.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrderModule,
    ProductOrderModule,
    PrismaModule,
    EducationalModelModule,
    SubjectModule,
    LocationModule,
    ProductModule,
    AgeModule,
    StripeModule,
    ZapierModule,
    SchoolModule,
    CouponModule,
    DepositModule,
    TaxonomyModule,
    FlywireModule,
    PaymentModule,
    StripeWebhookModule,
    ProgramDateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
