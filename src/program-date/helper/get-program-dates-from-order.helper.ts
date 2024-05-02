import { ProgramDate } from '@prisma/client';
import { ProductOrderFull } from '../../dal/product-order/entity-types/product-order-full.type';

export const getProgramDatesFromProductOrders = (
  productOrders: ProductOrderFull[],
  currentProductOrderId?: string,
): ProgramDate[] => {
  const programDates = productOrders.reduce((acc, po) => {
    if (
      po.programDate?.endDate &&
      po.programDate?.startDate &&
      po.id !== currentProductOrderId
    ) {
      acc.push(po.programDate);
    }
    return acc;
  }, []);

  return programDates;
};
