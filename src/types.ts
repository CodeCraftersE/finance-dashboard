export type EntryType = 'income' | 'expense';

export type Category = 
  | 'Salary' 
  | 'Investment' 
  | 'Food & Drinks' 
  | 'Shopping' 
  | 'Rent' 
  | 'Utilities' 
  | 'Transport' 
  | 'Entertainment' 
  | 'Healthcare' 
  | 'Other';

export interface FinanceEntry {
  id: string;
  date: string;
  amount: number;
  category: Category;
  type: EntryType;
  description: string;
}

export type UserRole = 'admin' | 'viewer';

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface ChartDataPoint {
  date: string;
  balance: number;
  income: number;
  expense: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}
