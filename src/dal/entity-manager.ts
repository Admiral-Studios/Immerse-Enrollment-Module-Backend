import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
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
import { PrismaClient } from '@prisma/client';
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

@Injectable()
export class EntityManager {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly _productRepository: ProductRepository,
    private readonly _couponRepository: CouponRepository,
    private readonly _educationalModelRepository: EducationalModelRepository,
    private readonly _locationRepository: LocationRepository,
    private readonly _packageRepository: PackageRepository,
    private readonly _subjectRepository: SubjectRepository,
    private readonly _taxonomyRepository: TaxonomyRepository,
    private readonly _orderRepository: OrderRepository,
    private readonly _productOrderRepository: ProductOrderRepository,
    private readonly _ageRepository: AgeRepository,
    private readonly _studentDetailsRepository: StudentDetailsRepository,
    private readonly _schoolRepository: SchoolRepository,
    private readonly _depositRepository: DepositRepository,
    private readonly _classificationRepository: ClassificationRepository,
    private readonly _tagRepository: TagRepository,
    private readonly _pathwayRepository: PathwayRepository,
    private readonly _teachingFormatRepository: TeachingFormatRepository,
    private readonly _productOrderBackupRepository: ProductOrderBackupRepository,
    private readonly _programDateRepository: ProgramDateRepository,
    private readonly _usedCouponRepository: UsedCouponRepository,
    private readonly _completedOrderRepository: CompletedOrderRepository,
    private readonly _siblingCouponRepository: SiblingCouponRepository,
    private readonly _stripeEventRepository: StripeEventRepository,
  ) {}

  public get productRepository(): ProductRepository {
    return this._productRepository;
  }

  public get couponRepository(): CouponRepository {
    return this._couponRepository;
  }

  public get educationalModelRepository(): EducationalModelRepository {
    return this._educationalModelRepository;
  }

  public get subjectRepository(): SubjectRepository {
    return this._subjectRepository;
  }

  public get locationRepository(): LocationRepository {
    return this._locationRepository;
  }

  public get packageRepository(): PackageRepository {
    return this._packageRepository;
  }

  public get taxonomyRepository(): TaxonomyRepository {
    return this._taxonomyRepository;
  }

  public get orderRepository(): OrderRepository {
    return this._orderRepository;
  }

  public get productOrderRepository(): ProductOrderRepository {
    return this._productOrderRepository;
  }

  public get ageRepository(): AgeRepository {
    return this._ageRepository;
  }

  public get studentDetailsRepository(): StudentDetailsRepository {
    return this._studentDetailsRepository;
  }

  public get schoolRepository(): SchoolRepository {
    return this._schoolRepository;
  }

  public get depositRepository(): DepositRepository {
    return this._depositRepository;
  }

  public get classificationRepository(): ClassificationRepository {
    return this._classificationRepository;
  }

  public get tagRepository(): TagRepository {
    return this._tagRepository;
  }

  public get pathwayRepository(): PathwayRepository {
    return this._pathwayRepository;
  }

  public get teachingFormatRepository(): TeachingFormatRepository {
    return this._teachingFormatRepository;
  }

  public get productOrderBackupRepository(): ProductOrderBackupRepository {
    return this._productOrderBackupRepository;
  }

  public get programDateRepository(): ProgramDateRepository {
    return this._programDateRepository;
  }

  public get usedCouponRepository(): UsedCouponRepository {
    return this._usedCouponRepository;
  }

  public get completedOrderRepository(): CompletedOrderRepository {
    return this._completedOrderRepository;
  }

  public get siblingCouponRepository(): SiblingCouponRepository {
    return this._siblingCouponRepository;
  }

  public get stripeEventRepository(): StripeEventRepository {
    return this._stripeEventRepository;
  }

  public get transaction(): typeof PrismaClient.prototype.$transaction {
    return this.prisma.$transaction.bind(this.prisma);
  }
}
