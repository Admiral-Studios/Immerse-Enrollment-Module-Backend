import { StudentDetails } from '@prisma/client';
import { SIBLING_COUPON_DETAILS } from '../../common/common.constants';

export const generateSiblingCoupon = (
  studentDetails: StudentDetails,
  additionalLettersLength = 0,
): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  result = studentDetails.siblingLastName.slice(0, 3).toUpperCase();

  const charactersLength = characters.length;

  for (let i = 0; i < additionalLettersLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result + SIBLING_COUPON_DETAILS.ending;
};
