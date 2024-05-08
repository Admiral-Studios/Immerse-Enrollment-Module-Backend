import { Module } from '@nestjs/common';
import { PrismaModule } from '../infra/prisma/prisma.module';
import { EntityManager } from './entity-manager';
import { ProductRepository } from './product/product.repository';
import { EducationalModelRepository } from './educational-model/educational-model.repository';
import { SubjectRepository } from './subject/subject.repository';
import { LocationRepository } from './location/location.repository';
import { CouponRepository } from './coupon/coupon.repository';
import { PackageRepository } from './package/package.repository';
import { TaxonomyRepository } from './taxonomy/taxonomy.repository';
import { OrderRepository } from './order/order.repository';
import { ProductOrderRepository } from './product-order/product-order.repository';
import { AgeRepository } from './age/age.repository';
import { StudentDetailsRepository } from './student-details/student-details.repository';
import { SchoolRepository } from './school/school.repository';
import { DepositRepository } from './deposit/deposit.repository';
import { ClassificationRepository } from './classification/classification.repository';
import { TagRepository } from './tag/tag.repository';
import { PathwayRepository } from './pathway/pathway.repository';
import { TeachingFormatRepository } from './teaching-format/teaching-format.repository';
import { ProductOrderBackupRepository } from './product-order-backup/product-order-backup.repository';
import { ProgramDateRepository } from './program-date/program-date.repository';
import { UsedCouponRepository } from './used-coupon/used-coupon.repository';
import { CompletedOrderRepository } from './completed-order/completed-order.repository';
import { SiblingCouponRepository } from './sibling-coupon/sibling-coupon.repository';
import { StripeEventRepository } from './stripe-event/stripe-event.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    EntityManager,
    CouponRepository,
    EducationalModelRepository,
    LocationRepository,
    PackageRepository,
    ProductRepository,
    SubjectRepository,
    TaxonomyRepository,
    OrderRepository,
    ProductOrderRepository,
    AgeRepository,
    StudentDetailsRepository,
    SchoolRepository,
    DepositRepository,
    ClassificationRepository,
    TagRepository,
    PathwayRepository,
    TeachingFormatRepository,
    ProductOrderBackupRepository,
    ProgramDateRepository,
    UsedCouponRepository,
    CompletedOrderRepository,
    SiblingCouponRepository,
    StripeEventRepository,
  ],
  exports: [
    EntityManager,
    CouponRepository,
    EducationalModelRepository,
    LocationRepository,
    PackageRepository,
    ProductRepository,
    SubjectRepository,
    TaxonomyRepository,
    OrderRepository,
    ProductOrderRepository,
    AgeRepository,
    StudentDetailsRepository,
    SchoolRepository,
    DepositRepository,
    ClassificationRepository,
    TagRepository,
    PathwayRepository,
    TeachingFormatRepository,
    ProductOrderBackupRepository,
    ProgramDateRepository,
    UsedCouponRepository,
    CompletedOrderRepository,
    SiblingCouponRepository,
    StripeEventRepository,
  ],
})
export class DalModule {}
