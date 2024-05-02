import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { FormatDate } from '../../decorators/format-date.decoractor';

@Exclude()
class OrderSchool {
  @Expose({ name: 'identifier' })
  id: number;

  @Expose()
  source: string;

  @Expose()
  name: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  region: string;

  @Expose()
  subRegion: string;

  @Expose()
  country: string;

  @Expose()
  postcode: string;

  @Expose()
  website: string;
}

@Exclude()
export class OrderStudentDetails {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  @FormatDate()
  dateOfBirth: string;

  @Expose()
  gender: string;

  @Expose()
  nationality: string;

  @Expose()
  country: string;

  @Expose()
  parentFirstName: string;

  @Expose()
  parentLastName: string;

  @Expose()
  parentEmail: string;

  @Expose()
  parentPhoneNumber: string;

  @Expose()
  siblingFirstName: string;

  @Expose()
  siblingLastName: string;

  @Expose()
  siblingEmail: string;

  @Expose()
  @FormatDate()
  siblingDateOfBirth: string;

  @Expose()
  roleOfConsultant: string;

  @Expose()
  nameOfConsultantOrAdvisor: string;

  @Expose()
  @Type(() => OrderSchool)
  school: OrderSchool;
}
