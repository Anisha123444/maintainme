import React from 'react';
import {
  Utensils,
  ShoppingBag,
  ShoppingCart,
  Car,
  GraduationCap,
  Home,
  Receipt,
  Zap,
  Smartphone,
  Tv,
  HeartPulse,
  User,
  Plane,
  Users,
  Repeat,
  TrendingUp,
  PiggyBank,
  Tag,
} from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Food: Utensils,
  Groceries: ShoppingBag,
  Restaurant: Utensils,
  Shopping: ShoppingCart,
  Transport: Car,
  Education: GraduationCap,
  Rent: Home,
  Bills: Receipt,
  Electricity: Zap,
  Recharge: Smartphone,
  Entertainment: Tv,
  Health: HeartPulse,
  Personal: User,
  Travel: Plane,
  Family: Users,
  Subscription: Repeat,
  Investment: TrendingUp,
  Savings: PiggyBank,
  Other: Tag,
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const Icon = CATEGORY_ICONS[category] || Tag;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 space-x-1',
    md: 'text-xs px-2.5 py-1 space-x-1.5',
    lg: 'text-sm px-3 py-1.5 space-x-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-bold rounded-full bg-theme-primary/50 text-theme-text border border-theme-border select-none ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <Icon className={`${iconSizes[size]} text-theme-muted stroke-[1.8]`} />}
      <span className="truncate">{category}</span>
    </span>
  );
};
