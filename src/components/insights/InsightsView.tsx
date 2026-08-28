import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRangeByOffset, formatCurrency } from '../../utils/dateUtils';
import { getCategoryBreakdown, generateSmartInsights } from '../../utils/insights';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Lightbulb, ArrowRight, TrendingDown, TrendingUp } from 'lucide-react';

type TimeRangeFilter = 'this_month' | 'last_month' | '3_months' | '6_months' | '1_year';

const EDITORIAL_PALETTE = ['#9DAA8D', '#A85D4A', '#D8CCB5', '#68745F', '#292824', '#8C4B3A', '#C7D4BD'];

export const InsightsView: React.FC = () => {
  const { profile, expenses } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('this_month');
  const [showAskMMResponse, setShowAskMMResponse] = useState(false);

  const currentMonthRange = getFinancialMonthRangeByOffset(0, profile.financialMonthStart);
  const lastMonthRange = getFinancialMonthRangeByOffset(-1, profile.financialMonthStart);

  const getFilteredExpenses = () => {
    if (timeRange === 'this_month') {
      return expenses.filter(
        (e) => e.date >= currentMonthRange.startDate && e.date <= currentMonthRange.endDate
      );
    }
    if (timeRange === 'last_month') {
      return expenses.filter(
        (e) => e.date >= lastMonthRange.startDate && e.date <= lastMonthRange.endDate
      );
    }
    const monthsBack = timeRange === '3_months' ? 3 : timeRange === '6_months' ? 6 : 12;
    const pastRange = getFinancialMonthRangeByOffset(-monthsBack, profile.financialMonthStart);
    return expenses.filter((e) => e.date >= pastRange.startDate);
  };

  const selectedExpenses = getFilteredExpenses();
  const currentMonthExpenses = expenses.filter(
    (e) => e.date >= currentMonthRange.startDate && e.date <= currentMonthRange.endDate
  );
  const lastMonthExpenses = expenses.filter(
    (e) => e.date >= lastMonthRange.startDate && e.date <= lastMonthRange.endDate
  );

  const totalSpent = selectedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = profile.income || 0;
  const totalSaved = Math.max(0, totalIncome - totalSpent);

  const smartInsights = generateSmartInsights(
    currentMonthExpenses,
    lastMonthExpenses,
    totalIncome,
    profile.spendingLimits,
    currentMonthRange,
    profile.currency
  );

  const categoryData = getCategoryBreakdown(selectedExpenses);

  const dailySpendMap: Record<string, number> = {};
  selectedExpenses.forEach((e) => {
    const dayKey = e.date.substring(5);
    dailySpendMap[dayKey] = (dailySpendMap[dayKey] || 0) + e.amount;
  });

  const dailyChartData = Object.entries(dailySpendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([day, amount]) => ({ day, amount }));

  const thisMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const momDiff = thisMonthTotal - lastMonthTotal;

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Top Filter Buttons */}
      <div className="stationery-card p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-theme-text">Analytics & Insights</h2>
          <p className="text-xs text-theme-muted font-serif italic">Let's see where your money went.</p>
        </div>

        {/* Time range selector */}
        <div className="flex flex-wrap gap-1 bg-theme-bg p-1 border border-theme-border rounded-2xl">
          {[
            { id: 'this_month', label: 'This month' },
            { id: 'last_month', label: 'Last month' },
            { id: '3_months', label: '3 months' },
            { id: '6_months', label: '6 months' },
            { id: '1_year', label: '1 year' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id as TimeRangeFilter)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                timeRange === item.id
                  ? 'bg-theme-primary text-theme-text shadow-2xs border border-theme-border font-extrabold'
                  : 'text-theme-muted hover:bg-theme-highlight'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="stationery-card p-4">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">Total Spent</span>
          <div className="text-xl font-serif font-bold text-theme-terracotta mt-1">
            {formatCurrency(totalSpent, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">Monthly Income</span>
          <div className="text-xl font-serif font-bold text-theme-text mt-1">
            {formatCurrency(totalIncome, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">Total Saved</span>
          <div className="text-xl font-serif font-bold text-theme-text mt-1">
            {formatCurrency(totalSaved, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest font-sans">Daily Average</span>
          <div className="text-xl font-serif font-bold text-theme-text mt-1">
            {formatCurrency(smartInsights.averageDailySpend, profile.currency)}
          </div>
        </div>
      </div>

      {/* Donut Chart: Where did your money go? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stationery-card p-6 relative">
          <h3 className="text-lg font-serif font-bold text-theme-text mb-1">Where did your money go?</h3>
          <p className="text-xs text-theme-muted font-serif italic mb-4">Category distribution</p>

          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-theme-muted">
              <p className="text-sm font-serif italic">Your spending story will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="w-full sm:w-1/2 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={EDITORIAL_PALETTE[index % EDITORIAL_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => formatCurrency(val, profile.currency)}
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: 'var(--color-text)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full sm:w-1/2 space-y-2 mt-4 sm:mt-0 pl-0 sm:pl-4 max-h-56 overflow-y-auto">
                {categoryData.map((cat, idx) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: EDITORIAL_PALETTE[idx % EDITORIAL_PALETTE.length] }}
                      />
                      <span className="text-theme-text">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-theme-text">{cat.percentage}%</span>
                      <span className="text-[10px] text-theme-muted block">{formatCurrency(cat.amount, profile.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Daily Spending Trend Chart */}
        <div className="stationery-card p-6 relative">
          <h3 className="text-lg font-serif font-bold text-theme-text mb-1">Daily expenditure trend</h3>
          <p className="text-xs text-theme-muted font-serif italic mb-4">A little tracking goes a long way.</p>

          {dailyChartData.length === 0 ? (
            <div className="py-12 text-center text-theme-muted">
              <p className="text-sm font-serif italic">Your daily expenditure pattern will appear here.</p>
            </div>
          ) : (
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--color-muted)' }} />
                  <Tooltip
                    formatter={(val: number) => formatCurrency(val, profile.currency)}
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'var(--color-text)',
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Month Comparison & Journal Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month vs Last Month */}
        <div className="stationery-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif font-bold text-theme-text">Your month so far vs last month</h3>
            <span className="text-xs font-semibold text-theme-muted">{currentMonthRange.shortLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-theme-bg border border-theme-border rounded-xl">
              <span className="text-[10px] font-bold uppercase text-theme-muted font-sans">This Month</span>
              <p className="text-lg font-serif font-bold text-theme-terracotta">
                {formatCurrency(thisMonthTotal, profile.currency)}
              </p>
            </div>

            <div className="p-3 bg-theme-bg border border-theme-border rounded-xl">
              <span className="text-[10px] font-bold uppercase text-theme-muted font-sans">Last Month</span>
              <p className="text-lg font-serif font-bold text-theme-text">
                {formatCurrency(lastMonthTotal, profile.currency)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-theme-bg border border-theme-border rounded-xl flex items-center space-x-3">
            {momDiff <= 0 ? (
              <TrendingDown className="w-5 h-5 text-theme-accent flex-shrink-0" />
            ) : (
              <TrendingUp className="w-5 h-5 text-theme-terracotta flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold text-theme-text">
                {momDiff <= 0
                  ? `${formatCurrency(Math.abs(momDiff), profile.currency)} less than last month`
                  : `${formatCurrency(momDiff, profile.currency)} more than last month`}
              </p>
              <p className="text-[11px] text-theme-muted italic font-serif">
                {momDiff <= 0
                  ? "“Nice! Your spending went down this month.”"
                  : "“Take a quiet look at daily discretionary purchases.”"}
              </p>
            </div>
          </div>
        </div>

        {/* Smart Rule Insights */}
        <div className="stationery-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-4 h-4 text-theme-muted" />
            <h3 className="text-base font-serif font-bold text-theme-text">Journal Observations</h3>
          </div>

          <div className="space-y-2.5">
            {smartInsights.ruleInsights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-theme-bg border border-theme-border rounded-xl flex items-start space-x-2 text-xs font-medium text-theme-text">
                <span className="text-theme-muted">✦</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MM Suggests Section */}
      <div className="stationery-card p-6 bg-gradient-to-r from-theme-card to-theme-highlight border border-theme-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-serif font-bold text-theme-text">MM Suggests</h3>
            <p className="text-xs text-theme-muted font-serif italic">
              Want help understanding your month and getting savings advice?
            </p>
          </div>

          <button
            onClick={() => setShowAskMMResponse(!showAskMMResponse)}
            className="px-4 py-2 bg-theme-primary hover:bg-theme-accent text-theme-text font-bold text-xs rounded-xl border border-theme-border shadow-2xs transition-all flex items-center space-x-2"
          >
            <span>Ask MM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {showAskMMResponse && (
          <div className="mt-4 pt-4 border-t border-theme-border space-y-3 animate-fade-in">
            <div className="p-4 bg-theme-bg border border-theme-border rounded-2xl text-xs font-medium text-theme-text space-y-2">
              <p className="font-bold text-theme-text flex items-center space-x-1.5 font-serif">
                <span>MM Journal Analysis:</span>
              </p>
              <p>
                Based on your month cycle so far, your highest spending category is{' '}
                <span className="font-bold">{smartInsights.topCategory}</span>. You have{' '}
                <span className="font-bold">{smartInsights.daysRemainingMsg}</span>.
              </p>
              <p className="italic text-theme-muted font-serif">
                “Tip: Cooking one more meal at home this week could help you maintain your month calmly.”
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
