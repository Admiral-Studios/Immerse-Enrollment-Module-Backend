const dateRangeSeparator = ' to ';

const cleanOrdinalSuffixes = (dateStr: string): string => {
  // Regular expression to find ordinal suffixes (st, nd, rd, th) following a number
  return dateStr.replace(/(\d)(st|nd|rd|th)/g, '$1');
};

const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime());
};

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export const parseStartEndDates = (input: string): DateRange => {
  const cleanedInput = cleanOrdinalSuffixes(input);
  if (input.includes(dateRangeSeparator)) {
    const [startStr, endStr] = cleanedInput.split(dateRangeSeparator);
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    if (isValidDate(startDate) && isValidDate(endDate)) {
      return { startDate, endDate };
    } else {
      return { startDate: null, endDate: null };
    }
  }

  let startDate: Date | null = new Date(cleanedInput);
  if (!isValidDate(startDate)) {
    startDate = null;
  }
  return { startDate, endDate: null };
};
