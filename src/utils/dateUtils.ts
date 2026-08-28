export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label: string;     // e.g. "15 Aug — 14 Sep"
  shortLabel: string; // e.g. "Aug 15 - Sep 14"
  daysRemaining: number;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Format a JavaScript Date to YYYY-MM-DD string
 */
export const toISODate = (date: Date): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/**
 * Calculate the Financial Month date range for a given reference date and month start day (1 to 31)
 */
export const getFinancialMonthRange = (refDate: Date = new Date(), startDay: number = 1): DateRange => {
  const year = refDate.getFullYear();
  const month = refDate.getMonth(); // 0 - 11
  const day = refDate.getDate();

  let startYear = year;
  let startMonth = month;

  if (startDay === 1) {
    // Standard calendar month
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = end.getTime() - today.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return {
      startDate: toISODate(start),
      endDate: toISODate(end),
      label: `1 ${MONTH_NAMES[month]} — ${end.getDate()} ${MONTH_NAMES[month]}`,
      shortLabel: `${MONTH_NAMES[month]} 1 - ${end.getDate()}`,
      daysRemaining,
    };
  }

  // If day is before the start day, the financial month started in the previous calendar month
  if (day < startDay) {
    startMonth = month - 1;
    if (startMonth < 0) {
      startMonth = 11;
      startYear = year - 1;
    }
  }

  // Clamped start day for months with fewer days (e.g. Feb 31 -> Feb 28/29)
  const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
  const actualStartDay = Math.min(startDay, daysInStartMonth);
  const startDateObj = new Date(startYear, startMonth, actualStartDay);

  // End date is 1 day before the start date in the next month
  let endMonth = startMonth + 1;
  let endYear = startYear;
  if (endMonth > 11) {
    endMonth = 0;
    endYear = startYear + 1;
  }
  const daysInEndMonth = new Date(endYear, endMonth + 1, 0).getDate();
  const targetEndDay = actualStartDay - 1 === 0 ? daysInEndMonth : actualStartDay - 1;
  const endDateObj = new Date(endYear, endMonth, targetEndDay);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = endDateObj.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const startMonthName = MONTH_NAMES[startMonth];
  const endMonthName = MONTH_NAMES[endMonth];

  return {
    startDate: toISODate(startDateObj),
    endDate: toISODate(endDateObj),
    label: `${actualStartDay} ${startMonthName} — ${targetEndDay} ${endMonthName}`,
    shortLabel: `${startMonthName} ${actualStartDay} - ${endMonthName} ${targetEndDay}`,
    daysRemaining,
  };
};

/**
 * Get Financial Month range relative to offset (0 = current, -1 = last month, etc.)
 */
export const getFinancialMonthRangeByOffset = (offset: number = 0, startDay: number = 1): DateRange => {
  const now = new Date();
  // Move target month by offset
  now.setMonth(now.getMonth() + offset);
  return getFinancialMonthRange(now, startDay);
};

export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  return `${dayName}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
};

export const getTodayISO = (): string => toISODate(new Date());
