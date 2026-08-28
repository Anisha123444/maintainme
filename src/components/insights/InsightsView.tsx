import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getFinancialMonthRangeByOffset, formatCurrency } from '../../utils/dateUtils';
import { getCategoryBreakdown, generateSmartInsights } from '../../utils/insights';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { StickerOverlay } from '../common/StickerOverlay';
import { Sparkles, TrendingDown, TrendingUp, Lightbulb, HelpCircle, ArrowRight } from 'lucide-react';
import { CategoryBadge } from '../expense/CategoryBadge';

type TimeRangeFilter = 'this_month' | 'last_month' | '3_months' | '6_months' | '1_year';

export const InsightsView: React.FC = () => {
  const { profile, expenses } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('this_month');
  const [showAskMMResponse, setShowAskMMResponse] = useState(false);

  // Financial Month Ranges
  const currentMonthRange = getFinancialMonthRangeByOffset(0, profile.financialMonthStart);
  const lastMonthRange = getFinancialMonthRangeByOffset(-1, profile.financialMonthStart);

  // Filter expenses by selected time range
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
    // For 3_months, 6_months, 1_year
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

  // Smart Rule-based Insights
  const smartInsights = generateSmartInsights(
    currentMonthExpenses,
    lastMonthExpenses,
    totalIncome,
    profile.spendingLimits,
    currentMonthRange,
    profile.currency
  );

  // Donut chart category data
  const categoryData = getCategoryBreakdown(selectedExpenses);

  // Bar chart daily spending data for selected period
  const dailySpendMap: Record<string, number> = {};
  selectedExpenses.forEach((e) => {
    const dayKey = e.date.substring(5); // MM-DD
    dailySpendMap[dayKey] = (dailySpendMap[dayKey] || 0) + e.amount;
  });

  const dailyChartData = Object.entries(dailySpendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14) // Last 14 active days
    .map(([day, amount]) => ({ day, amount }));

  // Month vs Month comparison
  const thisMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const momDiff = thisMonthTotal - lastMonthTotal;

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Top Filter Buttons */}
      <div className="stationery-card p-5 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <StickerOverlay position="top-right" sticker="sparkle" size="md" />

        <div>
          <h2 className="text-2xl font-bold font-sans text-theme-text">Insights</h2>
          <p className="text-xs text-theme-muted font-serif">Where your money goes & monthly trends</p>
        </div>

        {/* Time range selector */}
        <div className="flex flex-wrap gap-1.5 bg-theme-bg p-1.5 border border-theme-border rounded-2xl">
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
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                timeRange === item.id
                  ? 'bg-theme-accent text-white shadow-xs'
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
          <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">Total Spent</span>
          <div className="text-xl font-extrabold text-strawberry-700 mt-1">
            {formatCurrency(totalSpent, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">Monthly Income</span>
          <div className="text-xl font-extrabold text-theme-text mt-1">
            {formatCurrency(totalIncome, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">Total Saved</span>
          <div className="text-xl font-extrabold text-emerald-800 mt-1">
            {formatCurrency(totalSaved, profile.currency)}
          </div>
        </div>

        <div className="stationery-card p-4">
          <span className="text-[11px] font-bold text-theme-muted uppercase tracking-wider">Daily Average</span>
          <div className="text-xl font-extrabold text-theme-text mt-1">
            {formatCurrency(smartInsights.averageDailySpend, profile.currency)}
          </div>
        </div>
      </div>

      {/* Donut Chart: Where did your money go? */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stationery-card p-6 relative">
          <h3 className="text-lg font-bold font-sans text-theme-text mb-1">Where did your money go?</h3>
          <p className="text-xs text-theme-muted mb-4">Pastel category spending distribution</p>

          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-theme-muted">
              <p className="text-sm font-serif">No expenses recorded for this period.</p>
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
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => formatCurrency(val, profile.currency)}
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Legend list */}
              <div className="w-full sm:w-1/2 space-y-2 mt-4 sm:mt-0 pl-0 sm:pl-4 max-h-56 overflow-y-auto">
                {categoryData.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: cat.color }} />
                      <span className="text-theme-text">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-theme-text">{cat.percentage}%</span>
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
          <h3 className="text-lg font-bold font-sans text-theme-text mb-1">Daily spending heatmap trend</h3>
          <p className="text-xs text-theme-muted mb-4">Recent daily expenditure activity</p>

          {dailyChartData.length === 0 ? (
            <div className="py-12 text-center text-theme-muted">
              <p className="text-sm font-serif">No spending trend data available.</p>
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
                    }}
                  />
                  <Bar dataKey="amount" fill="#FF5C77" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Month Comparison & Rule-based Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month vs Last Month */}
        <div className="stationery-card p-6 bg-strawberry-50/50 border border-strawberry-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-sans text-theme-text">This month vs last month</h3>
            <span className="text-xs font-semibold text-strawberry-700">{currentMonthRange.shortLabel}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 bg-white border border-strawberry-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-theme-muted">This Month</span>
              <p className="text-lg font-extrabold text-strawberry-700">
                {formatCurrency(thisMonthTotal, profile.currency)}
              </p>
            </div>

            <div className="p-3 bg-white border border-strawberry-200 rounded-xl">
              <span className="text-[10px] font-bold uppercase text-theme-muted">Last Month</span>
              <p className="text-lg font-extrabold text-theme-text">
                {formatCurrency(lastMonthTotal, profile.currency)}
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/80 border border-strawberry-200 rounded-xl flex items-center space-x-3">
            {momDiff <= 0 ? (
              <TrendingDown className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            ) : (
              <TrendingUp className="w-6 h-6 text-rose-600 flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-extrabold text-theme-text">
                {momDiff <= 0
                  ? `${formatCurrency(Math.abs(momDiff), profile.currency)} less than last month`
                  : `${formatCurrency(momDiff, profile.currency)} more than last month`}
              </p>
              <p className="text-[11px] text-theme-muted italic font-serif">
                {momDiff <= 0
                  ? "“Nice! Your spending went down this month.”"
                  : "“Keep an eye on daily discretionary purchases.”"}
              </p>
            </div>
          </div>
        </div>

        {/* Smart Rule Insights */}
        <div className="stationery-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold font-sans text-theme-text">Financial Journal Observations</h3>
          </div>

          <div className="space-y-2.5">
            {smartInsights.ruleInsights.map((insight, idx) => (
              <div key={idx} className="p-3 bg-theme-bg border border-theme-border rounded-xl flex items-start space-x-2 text-xs font-medium text-theme-text">
                <span className="text-strawberry-600">✦</span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MM Suggests / Ask MM Section */}
      <div className="stationery-card p-6 bg-gradient-to-r from-theme-card via-theme-highlight to-strawberry-50 border-2 border-strawberry-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-strawberry-600" />
              <h3 className="text-lg font-bold font-sans text-theme-text">MM Suggests</h3>
            </div>
            <p className="text-xs text-theme-muted">
              Want help understanding your month and getting personal savings advice?
            </p>
          </div>

          <button
            onClick={() => setShowAskMMResponse(!showAskMMResponse)}
            className="px-5 py-2.5 bg-theme-accent text-white font-bold text-xs rounded-xl shadow-float hover:opacity-90 active:scale-95 transition-all flex items-center space-x-2"
          >
            <span>Ask MM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {showAskMMResponse && (
          <div className="mt-4 pt-4 border-t border-strawberry-200 space-y-3 animate-fade-in">
            <div className="p-4 bg-white/90 border border-strawberry-300 rounded-2xl text-xs font-medium text-theme-text space-y-2">
              <p className="font-extrabold text-strawberry-700 flex items-center space-x-1.5">
                <span>🍓 MM Journal Analysis:</span>
              </p>
              <p>
                Based on your month cycle so far, your highest spending is in{' '}
                <span className="font-bold">{smartInsights.topCategory}</span>. You have{' '}
                <span className="font-bold">{smartInsights.daysRemainingMsg}</span>.
              </p>
              <p className="italic text-theme-muted font-serif">
                “Tip: Cooking one more meal at home this week could save approximately {profile.currency}800 by the end of your financial month!”
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
