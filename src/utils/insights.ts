import { Expense, SpendingLimits, UserProfile } from '../types';
import { DateRange, formatCurrency } from './dateUtils';

export interface SpendingStatusResult {
  status: 'SAFE' | 'WATCH' | 'HIGH';
  percentage: number;
  badgeBg: string;
  badgeText: string;
  gaugeColor: string;
  message: string;
  subtext: string;
}

export const calculateSpendingStatus = (
  totalSpent: number,
  limits: SpendingLimits
): SpendingStatusResult => {
  const safeLimit = limits.safe || 15000;
  const mediumLimit = limits.medium || 20000;
  const maxLimit = limits.max || 25000;

  // Calculate percentage against max budget limit
  const percentage = Math.min(100, Math.round((totalSpent / (maxLimit || 1)) * 100));

  if (totalSpent <= safeLimit) {
    return {
      status: 'SAFE',
      percentage,
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      badgeText: 'SAFE ZONE',
      gaugeColor: '#10B981', // Pastel green
      message: "You're comfortably within your limit.",
      subtext: 'Your finances are calm and steady.',
    };
  } else if (totalSpent <= mediumLimit) {
    return {
      status: 'WATCH',
      percentage,
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      badgeText: 'WATCH ZONE',
      gaugeColor: '#F59E0B', // Pastel yellow
      message: "You're spending a little faster this month.",
      subtext: 'Keep a gentle eye on daily treats.',
    };
  } else {
    return {
      status: 'HIGH',
      percentage,
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
      badgeText: 'HIGH ZONE',
      gaugeColor: '#FF5C77', // Pastel pink/red accent
      message: "You've crossed your comfortable spending zone.",
      subtext: 'No stress — just pause and review upcoming expenses.',
    };
  }
};

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B8B',
  Groceries: '#8CA77A',
  Restaurant: '#FFA0B3',
  Shopping: '#FF9478',
  Transport: '#5B8FF9',
  Education: '#8A9EA7',
  Rent: '#6B8E23',
  Bills: '#55721C',
  Electricity: '#F59E0B',
  Recharge: '#3B66D4',
  Entertainment: '#DD758F',
  Health: '#10B981',
  Personal: '#D0E1FD',
  Travel: '#FFE5D9',
  Family: '#FFD6E0',
  Subscription: '#C24D68',
  Investment: '#2C3A2C',
  Savings: '#10B981',
  Other: '#94A3B8',
};

export const getCategoryBreakdown = (expenses: Expense[]): CategoryBreakdown[] => {
  const totals: Record<string, number> = {};
  let grandTotal = 0;

  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
    grandTotal += e.amount;
  });

  if (grandTotal === 0) return [];

  return Object.entries(totals)
    .map(([cat, amount]) => ({
      category: cat,
      amount,
      percentage: Math.round((amount / grandTotal) * 100),
      color: CATEGORY_COLORS[cat] || '#94A3B8',
    }))
    .sort((a, b) => b.amount - a.amount);
};

export interface GeneratedInsights {
  topCategory: string;
  topCategoryAmount: number;
  averageDailySpend: number;
  daysRemainingMsg: string;
  comparisonMsg?: string;
  ruleInsights: string[];
}

export const generateSmartInsights = (
  currentExpenses: Expense[],
  lastMonthExpenses: Expense[],
  income: number,
  limits: SpendingLimits,
  dateRange: DateRange,
  currency: string = '₹'
): GeneratedInsights => {
  const totalCurrentSpent = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalLastSpent = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Category breakdown
  const breakdown = getCategoryBreakdown(currentExpenses);
  const topCat = breakdown[0];

  // Daily average calculation
  const startDate = new Date(dateRange.startDate);
  const today = new Date();
  const endDate = new Date(dateRange.endDate);

  const effectiveEnd = today < endDate ? today : endDate;
  const daysPassed = Math.max(1, Math.ceil((effectiveEnd.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const averageDailySpend = Math.round(totalCurrentSpent / daysPassed);

  const ruleInsights: string[] = [];

  if (topCat) {
    ruleInsights.push(`You spent the most on ${topCat.category} (${topCat.percentage}% of total) this month.`);
  }

  if (totalLastSpent > 0) {
    const diff = totalCurrentSpent - totalLastSpent;
    if (diff < 0) {
      ruleInsights.push(`Nice! Your spending is ${formatCurrency(Math.abs(diff), currency)} lower than last month.`);
    } else if (diff > 0) {
      ruleInsights.push(`Your spending is ${formatCurrency(diff, currency)} higher than last month.`);
    } else {
      ruleInsights.push(`Your spending is exactly matching last month's pattern.`);
    }
  }

  ruleInsights.push(`You have ${dateRange.daysRemaining} days left in your current financial month.`);
  ruleInsights.push(`Your average daily spending is ${formatCurrency(averageDailySpend, currency)}.`);

  if (income > 0) {
    const saved = income - totalCurrentSpent;
    if (saved > 0) {
      ruleInsights.push(`You are currently on track to save ${formatCurrency(saved, currency)}.`);
    }
  }

  return {
    topCategory: topCat ? topCat.category : 'None',
    topCategoryAmount: topCat ? topCat.amount : 0,
    averageDailySpend,
    daysRemainingMsg: `${dateRange.daysRemaining} days remaining in this month cycle`,
    ruleInsights,
  };
};
