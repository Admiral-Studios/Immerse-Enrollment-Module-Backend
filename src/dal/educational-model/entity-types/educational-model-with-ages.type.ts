import { Prisma } from '@prisma/client';

export const educationalModelWithAgesInclude =
  Prisma.validator<Prisma.EducationalModelInclude>()({
    taxonomies: { select: { age: true } },
  });

export type EducationalModelWithAges = Prisma.EducationalModelGetPayload<{
  include: typeof educationalModelWithAgesInclude;
}>;
