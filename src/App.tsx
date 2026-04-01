import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Plus, 
  Moon, 
  Sun,
  TrendingUp,
  CreditCard,
  X,
  FileDown,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { cn } from './lib/utils';
import { FinanceEntry, Category, EntryType } from './types';
import { useFinanceTracker } from './hooks/useFinanceTracker';
import { InfoCard, Label } from './components/DashboardComponents';
import { TransactionHistory } from './components/TransactionHistory';

export default function App() {
  const {
    records,
    stats,
    history,
    distributions,
    insights,
    role,
    setRole,
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
    addNewRecord,
    updateRecord,
    removeRecord,
  } = useFinanceTracker();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FinanceEntry | null>(null);
  
  const [entryForm, setEntryForm] = useState({
    amount: '',
    category: 'Food & Drinks' as Category,
    type: 'expense' as EntryType,
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  // Dark mode setup
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      amount: parseFloat(entryForm.amount),
      category: entryForm.category,
      type: entryForm.type,
      description: entryForm.description,
      date: entryForm.date,
    };

    if (editingItem) updateRecord(editingItem.id, payload);
    else addNewRecord(payload);

    setShowModal(false);
    setEditingItem(null);
    setEntryForm({
      amount: '',
      category: 'Food & Drinks',
      type: 'expense',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const triggerEdit = (item: FinanceEntry) => {
    setEditingItem(item);
    setEntryForm({
      amount: item.amount.toString(),
      category: item.category,
      type: item.type,
      description: item.description,
      date: item.date,
    });
    setShowModal(true);
  };

  const triggerExport = () => {
  // Download to JSON
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finance_report_${format(new Date(), 'yyyyMMdd')}.json`;
    link.click();
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#070707] text-zinc-900 dark:text-zinc-50 transition-colors duration-500">
      
      {/* Main Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-[#0C0C0C] border-r border-zinc-200 dark:border-zinc-900 z-50 p-8 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 bg-indigo-600 rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <BarChart3 size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-black leading-none tracking-tight">Finance Dashboard</h1>
            <p className="text-[8px] font-bold text-zinc-400 mt-0.5 tracking-[0.2em] uppercase">a zoorvyn product</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {/* Main Stats in Sidebar */}
          <div className="p-6 bg-indigo-600 rounded-[32px] text-white shadow-2xl shadow-indigo-600/30 mb-8 relative overflow-hidden">
             <div className="relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Current Balance</span>
              <h2 className="text-3xl font-black mt-1">₹{stats.netWorth.toLocaleString()}</h2>
              <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
                <div>
                   <span className="text-[9px] font-bold uppercase opacity-60">In</span>
                   <p className="text-sm font-black tracking-tight">₹{stats.totalIn.toLocaleString()}</p>
                </div>
                <div>
                   <span className="text-[9px] font-bold uppercase opacity-60">Out</span>
                   <p className="text-sm font-black tracking-tight">₹{stats.totalOut.toLocaleString()}</p>
                </div>
              </div>
             </div>
          </div>

          <div className="space-y-1 pt-4">
             <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4 mb-3">Settings</p>
             <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group"
             >
                <div className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-600">
                  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                </div>
                <span className="text-xs font-bold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
             </button>
             <button 
              onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')} 
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group"
             >
                <div className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-600">
                  <CreditCard size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{role} ACCESS</span>
             </button>
          </div>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={triggerExport}
            className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-zinc-500 hover:text-indigo-600 rounded-2xl transition-all text-xs font-black uppercase tracking-widest mb-4"
          >
            <FileDown size={16} />
            Export Data
          </button>
          
          <div className="text-center">
            <span className="text-[8px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-widest">
              a zoorvyn product
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12">
        
        {/* Header - Simple and high contrast */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">My Dashboard</h1>
            <p className="text-sm font-medium text-zinc-500">Welcome back. Here's what has changed in the last 30 days.</p>
          </div>
          
          {role === 'admin' && (
            <button 
              onClick={() => { setEditingItem(null); setShowModal(true); }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[20px] font-black text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus size={20} strokeWidth={3} />
              Add Entry
            </button>
          )}
        </header>

        {/* Top Section - Insights & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          
          {/* Chart Section */}
          <InfoCard className="lg:col-span-2" title="Net Movement" desc="Evolution of your balance over the last month">
            <div className="h-[300px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="mainFlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? "#1a1a1a" : "#f1f1f1"} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888', fontWeight: 'bold' }}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888', fontWeight: 'bold' }}
                    tickFormatter={(v) => `₹${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#111' : '#fff', 
                      borderRadius: '16px',
                      border: 'none',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#4f46e5" 
                    strokeWidth={4}
                    fill="url(#mainFlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </InfoCard>

          {/* Quick Stats Column */}
          <div className="flex flex-col gap-6">
            <InfoCard highlightColor="#f43f5e">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center text-rose-500">
                  <TrendingUp size={24} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Major Spending</p>
                   <h3 className="text-xl font-black">{insights.topSpender?.name || 'Loading...'}</h3>
                </div>
              </div>
              <div className="mt-8 flex items-end justify-between">
                <span className="text-[10px] font-bold text-zinc-500">₹{insights.topSpender?.value.toLocaleString()} Total</span>
                <span className="text-xs font-black text-rose-500">High priority</span>
              </div>
            </InfoCard>

            <InfoCard highlightColor="#10b981">
               <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Report</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 leading-snug">
                  You've recorded <span className="text-zinc-900 dark:text-zinc-100 font-black">{records.length} items</span> this month.
               </p>
               <button className="flex items-center gap-2 mt-6 text-indigo-600 hover:text-indigo-700 text-xs font-black transition-colors">
                  View full insights <ChevronRight size={14} />
               </button>
            </InfoCard>
          </div>
        </div>

        {/* List of Recent Activities */}
        <div className="w-full">
           <TransactionHistory 
              entries={records}
              userRole={role}
              onEdit={triggerEdit}
              onDelete={removeRecord}
              searchStr={query}
              onSearchChange={setQuery}
              typeFilter={activeFilter}
              onFilterChange={setActiveFilter}
           />
        </div>

        <footer className="mt-20 pt-8 border-t border-zinc-100 dark:border-zinc-900 text-center">
            <p className="text-[10px] font-bold text-zinc-300 dark:text-zinc-800 uppercase tracking-[0.3em]">
              a zoorvyn product
            </p>
        </footer>
      </main>

      {/* Data Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#121212] rounded-[40px] p-10 shadow-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black tracking-tight">{editingItem ? 'Edit Entry' : 'Create New Entry'}</h2>
                <button onClick={() => setShowModal(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-2xl transition-colors">
                   <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 inline-block">Activity Type</label>
                    <select 
                      value={entryForm.type}
                      onChange={(e) => setEntryForm({ ...entryForm, type: e.target.value as EntryType })}
                      className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="expense">Expense (-)</option>
                      <option value="income">Income (+)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 inline-block">Amount (INR)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="0.00"
                      value={entryForm.amount}
                      onChange={(e) => setEntryForm({ ...entryForm, amount: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 inline-block">Category Tag</label>
                  <select 
                    value={entryForm.category}
                    onChange={(e) => setEntryForm({ ...entryForm, category: e.target.value as Category })}
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {[
                      'Salary', 'Investment', 'Food & Drinks', 'Shopping', 'Rent', 
                      'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Other'
                    ].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 inline-block">Brief Description</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Swiggy, Rent Payment..."
                    value={entryForm.description}
                    onChange={(e) => setEntryForm({ ...entryForm, description: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 inline-block">Date of Record</label>
                  <input 
                    type="date" 
                    required
                    value={entryForm.date}
                    onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-indigo-600/20 transition-all mt-4 active:scale-95"
                >
                  {editingItem ? 'Update Financial Record' : 'Confirm Entry'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
