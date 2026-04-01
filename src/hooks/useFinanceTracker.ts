import { useState, useMemo, useEffect } from 'react';
import { FinanceEntry, Category, EntryType, UserRole } from '../types';
import { initialRecords, getFinancialSummary, getTimeflowData, getCategoryStats } from '../data/sampleRecords';
import { startOfMonth, isAfter, parseISO } from 'date-fns';

export function useFinanceTracker() {
  const [data, setData] = useState<FinanceEntry[]>(initialRecords);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('admin');
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Derived stats
  const stats = useMemo(() => getFinancialSummary(data), [data]);
  const history = useMemo(() => getTimeflowData(data), [data]);
  const distributions = useMemo(() => getCategoryStats(data), [data]);

  // Combined search and filter
  const viewableRecords = useMemo(() => {
    return data.filter(item => {
      const isSearchMatch = item.description.toLowerCase().includes(query.toLowerCase()) || 
                          item.category.toLowerCase().includes(query.toLowerCase());
      const isTypeMatch = activeFilter === 'all' || item.type === activeFilter;
      return isSearchMatch && isTypeMatch;
    });
  }, [data, query, activeFilter]);

  const insights = useMemo(() => {
    const mainCategory = distributions[0] || null;
    const currentMonth = startOfMonth(new Date());

    // Monthly spend tracking
    const currentMonthSpend = data
      .filter(r => r.type === 'expense' && isAfter(parseISO(r.date), currentMonth))
      .reduce((sum, r) => sum + r.amount, 0);

    return { 
      topSpender: mainCategory,
      monthToDateVal: currentMonthSpend 
    };
  }, [data, distributions]);

  const addNewRecord = (input: Omit<FinanceEntry, 'id'>) => {
    // Simple ID generation for now
    const newEntry: FinanceEntry = { 
      ...input, 
      id: `USR-${Date.now().toString().slice(-6)}` 
    };
    setData(prev => [newEntry, ...prev]);
  };

  const updateRecord = (id: string, updatedData: Omit<FinanceEntry, 'id'>) => {
    setData(prev => prev.map(item => item.id === id ? { ...updatedData, id } : item));
  };

  const removeRecord = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  return {
    records: viewableRecords,
    allRecords: data,
    stats,
    history,
    distributions,
    insights,
    role: currentUserRole,
    setRole: setCurrentUserRole,
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
    addNewRecord,
    updateRecord,
    removeRecord,
  };
}
