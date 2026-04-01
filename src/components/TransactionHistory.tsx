import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Edit3, 
  Trash, 
  HelpCircle 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { FinanceEntry, UserRole } from '../types';
import { Label } from './DashboardComponents';

interface HistoryProps {
  entries: FinanceEntry[];
  userRole: UserRole;
  onEdit: (item: FinanceEntry) => void;
  onDelete: (id: string) => void;
  searchStr: string;
  onSearchChange: (s: string) => void;
  typeFilter: string;
  onFilterChange: (f: any) => void;
}

export const TransactionHistory = ({ 
  entries, 
  userRole, 
  onEdit, 
  onDelete, 
  searchStr, 
  onSearchChange, 
  typeFilter, 
  onFilterChange 
}: HistoryProps) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111111] rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search records..." 
            value={searchStr}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all text-zinc-900 dark:text-zinc-100"
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-1.5 p-1.5 bg-zinc-100 dark:bg-zinc-900/60 rounded-[20px] ml-auto">
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f as any)}
              className={cn(
                "px-5 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-wider transition-all",
                typeFilter === f 
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md scale-[1.02]" 
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-600 border-b border-zinc-100 dark:border-zinc-900">
              <th className="px-5 pb-5">Description</th>
              <th className="px-5 pb-5">Tag</th>
              <th className="px-5 pb-5">Time</th>
              <th className="px-5 pb-5 text-right">Value</th>
              {userRole === 'admin' && <th className="px-5 pb-5 text-right opacity-0">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900/50">
            <AnimatePresence mode="popLayout" initial={false}>
              {entries.length > 0 ? (
                entries.map((item) => (
                  <motion.tr 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-5 py-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                          item.type === 'income' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400"
                        )}>
                          {item.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        </div>
                        <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">{item.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-6">
                      <Label text={item.category} mood={item.type === 'income' ? 'positive' : 'neutral'} />
                    </td>
                    <td className="px-5 py-6 text-xs font-semibold text-zinc-500 dark:text-zinc-500">
                      {format(parseISO(item.date), 'MMM dd, yyyy')}
                    </td>
                    <td className={cn(
                      "px-5 py-6 text-sm font-black text-right",
                      item.type === 'income' ? "text-emerald-600 dark:text-emerald-500" : "text-zinc-900 dark:text-zinc-200"
                    )}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                    </td>
                    {userRole === 'admin' && (
                      <td className="px-5 py-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => onEdit(item)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-indigo-600 rounded-xl transition-all">
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-600 rounded-xl transition-all">
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={userRole === 'admin' ? 5 : 4} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <HelpCircle size={48} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Zero results found</p>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
