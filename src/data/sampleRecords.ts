import { FinanceEntry, EntryType, Category } from '../types';
import { subDays, format, eachDayOfInterval } from 'date-fns';

// Manual seed data for dev/testing
export const initialRecords: FinanceEntry[] = [
  {
    id: 'TXN-001',
    date: format(new Date(), 'yyyy-MM-dd'),
    amount: 75000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly Salary Credit - March'
  },
  {
    id: 'TXN-002',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    amount: 25000,
    category: 'Rent',
    type: 'expense',
    description: 'Apartment Rent - April'
  },
  {
    id: 'TXN-003',
    date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    amount: 1450,
    category: 'Food & Drinks',
    type: 'expense',
    description: 'Starbucks & Dinner at Blue Tokai'
  },
  {
    id: 'TXN-004',
    date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    amount: 800,
    category: 'Transport',
    type: 'expense',
    description: 'Uber to Office'
  },
  {
    id: 'TXN-005',
    date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    amount: 3200,
    category: 'Shopping',
    type: 'expense',
    description: 'Amazon - Home Essentials'
  },
  {
    id: 'TXN-006',
    date: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    amount: 12000,
    category: 'Investment',
    type: 'income',
    description: 'Dividend Payout - Nifty 50'
  },
  {
    id: 'TXN-007',
    date: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    amount: 450,
    category: 'Entertainment',
    type: 'expense',
    description: 'Netflix Monthly Subscription'
  },
  {
    id: 'TXN-008',
    date: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    amount: 2100,
    category: 'Utilities',
    type: 'expense',
    description: 'Electricity Bill - Tata Power'
  },
  {
    id: 'TXN-009',
    date: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    amount: 5000,
    category: 'Other',
    type: 'expense',
    description: 'Cash Withdrawal for Weekend'
  }
];

// Calculation logic for stats - slightly less generic naming
export const getFinancialSummary = (records: FinanceEntry[]) => {
  const inflow = records
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  
  const outflow = records
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  return {
    netWorth: inflow - outflow,
    totalIn: inflow,
    totalOut: outflow,
  };
};

export const getTimeflowData = (records: FinanceEntry[]) => {
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 30),
    end: new Date(),
  });

  let runningBalance = 0;

  return last30Days.map(day => {
    const formatted = format(day, 'yyyy-MM-dd');
    const matches = records.filter(r => r.date === formatted);
    
    const dayIn = matches.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
    const dayOut = matches.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);

    runningBalance += (dayIn - dayOut);

    return {
      date: format(day, 'dd MMM'),
      balance: runningBalance,
      income: dayIn,
      expense: dayOut,
    };
  });
};

export const getCategoryStats = (records: FinanceEntry[]) => {
  const expenseRecords = records.filter(r => r.type === 'expense');
  const grouped: Record<string, number> = {};

  expenseRecords.forEach(r => {
    grouped[r.category] = (grouped[r.category] || 0) + r.amount;
  });

  // Unique color palette - more hand-picked feel
  const COLORS = ['#4338ca', '#e11d48', '#059669', '#d97706', '#2563eb'];

  return Object.entries(grouped)
    .map(([group, val], index) => ({
      name: group,
      value: val,
      color: COLORS[index % COLORS.length]
    }))
    .sort((a, b) => b.value - a.value);
};
