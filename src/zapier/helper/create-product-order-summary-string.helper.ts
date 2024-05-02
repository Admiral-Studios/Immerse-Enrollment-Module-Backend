import { ProductOrderFull } from '../../dal/product-order/entity-types/product-order-full.type';

const getPreferredMonthsString = (
  preferredMonths: ProductOrderFull['preferredMonths'],
): string => {
  const months = JSON.parse(preferredMonths as string);
  return months?.map((pm) => `${pm.month} ${pm.year}`).join(', ');
};

export const createProductOrderSummaryString = (
  productOrder: ProductOrderFull,
): string => {
  const subject = productOrder.subject?.title || '';
  const age = productOrder.age?.title || '';
  const location = productOrder.location?.title || '';
  const programDate =
    productOrder.programDate?.title ||
    getPreferredMonthsString(productOrder.preferredMonths);

  return `${subject} - ${age} - ${location} - ${programDate}`;
};
