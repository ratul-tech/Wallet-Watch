import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { formatCurrency, cn } from '../lib/utils';
import { Search, Filter, Plus, TrendingUp, TrendingDown, Database } from 'lucide-react';
import { motion } from 'motion/react';

export const Ledger: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('General');

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/transactions`), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/transactions`), {
        uid: auth.currentUser.uid,
        amount: parseFloat(amount),
        type,
        description,
        category,
        timestamp: serverTimestamp(),
      });
      setShowAdd(false);
      setAmount('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Historical ledger of all movements</p>
          <h2 className="text-3xl font-bold tracking-tight">Transaction Ledger</h2>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
        >
          <Plus className="w-6 h-6" />
        </button>
      </section>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input className="input-field w-full pl-12 py-2" placeholder="Search transactions..." />
        </div>
        <button className="glass-card p-2 flex items-center justify-center">
          <Filter className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-2">
        <Database className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Firebase Realtime Database</span>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="glass-card p-4 flex items-center justify-between hover:bg-surface/70 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                tx.type === 'income' ? "bg-primary/20 text-primary" : "bg-red-500/20 text-red-500"
              )}>
                {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
              <div>
                <p className="font-bold">{tx.description}</p>
                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">{tx.category} • {tx.timestamp?.toDate().toLocaleDateString()}</p>
              </div>
            </div>
            <p className={cn("font-bold text-lg", tx.type === 'income' ? "text-primary" : "text-red-400")}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md space-y-6"
          >
            <h3 className="text-xl font-bold text-center">New Entry</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-2 p-1 bg-surface rounded-xl border border-white/5">
                <button 
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all", type === 'expense' ? "bg-red-500 text-white" : "text-text-secondary")}
                >
                  Expense
                </button>
                <button 
                  type="button"
                  onClick={() => setType('income')}
                  className={cn("flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all", type === 'income' ? "bg-primary text-white" : "text-text-secondary")}
                >
                  Income
                </button>
              </div>
              <input 
                className="input-field w-full" 
                placeholder="Amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
              <input 
                className="input-field w-full" 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
              <select 
                className="input-field w-full appearance-none"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General</option>
                <option>Food & Dining</option>
                <option>Transport</option>
                <option>Housing</option>
                <option>Freelance</option>
              </select>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-3 text-text-secondary font-bold uppercase text-xs">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Confirm</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
