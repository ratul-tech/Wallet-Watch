import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { formatCurrency, cn } from '../lib/utils';
import { TrendingUp, TrendingDown, Plus, Wallet, CreditCard, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';

const mockChartData = [
  { name: 'Mon', value: 2400 },
  { name: 'Tue', value: 1398 },
  { name: 'Wed', value: 9800 },
  { name: 'Thu', value: 3908 },
  { name: 'Fri', value: 4800 },
  { name: 'Sat', value: 3800 },
  { name: 'Sun', value: 4300 },
];

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(42850);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, `users/${auth.currentUser.uid}/transactions`),
      orderBy('timestamp', 'desc'),
      limit(5)
    );
    return onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Total Liquid Abyss</p>
        <h2 className="text-5xl font-bold tracking-tight">
          <span className="text-primary text-3xl mr-1">$</span>
          {balance.toLocaleString()}
          <span className="text-text-secondary text-3xl">.00</span>
        </h2>
      </section>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
        <div className="glass-card min-w-[140px] flex flex-col gap-2 p-4">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">USD</p>
            <p className="font-bold">$12,402</p>
          </div>
        </div>
        <div className="glass-card min-w-[140px] flex flex-col gap-2 p-4">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-500">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">BTC</p>
            <p className="font-bold">0.452</p>
          </div>
        </div>
        <button className="glass-card min-w-[140px] flex flex-col items-center justify-center gap-2 p-4 border-dashed border-white/20">
          <Plus className="w-6 h-6 text-primary" />
          <p className="text-[10px] font-bold text-primary uppercase">Add Asset</p>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Monthly Income</p>
            <p className="text-2xl font-bold text-primary">$12,400</p>
          </div>
        </div>
        <div className="glass-card p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded-full">-4.2%</span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Monthly Expenses</p>
            <p className="text-2xl font-bold text-red-400">$5,820</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Cash Flow</h3>
          <button className="text-text-secondary hover:text-white transition-colors">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-center">
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Avg Weekly</p>
            <p className="font-bold text-primary">$2,450</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-text-secondary uppercase">Burn Rate</p>
            <p className="font-bold text-red-400">28%</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Recent Activity</h3>
          <button className="text-primary text-xs font-bold uppercase tracking-wider">View History</button>
        </div>
        <div className="space-y-3">
          {transactions.length > 0 ? transactions.map((tx) => (
            <div key={tx.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center">
                  {tx.type === 'income' ? <TrendingUp className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <p className="font-bold">{tx.description}</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold">{tx.category}</p>
                </div>
              </div>
              <p className={cn("font-bold", tx.type === 'income' ? "text-primary" : "text-red-400")}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </p>
            </div>
          )) : (
            <div className="text-center py-8 text-text-secondary">
              <p className="text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
