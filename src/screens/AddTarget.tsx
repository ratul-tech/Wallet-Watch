import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, DollarSign, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const AddTarget: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/targets`), {
        uid: auth.currentUser.uid,
        name,
        targetAmount: parseFloat(amount),
        currentAmount: 0,
        deadline,
        status: 'active',
        createdAt: serverTimestamp(),
      });
      navigate('/targets');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="text-center space-y-2">
        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Financial Planner</p>
        <h2 className="text-4xl font-bold tracking-tight">Add Target</h2>
      </div>

      <div className="glass-card space-y-6">
        <div className="bg-surface/50 rounded-xl p-4 flex items-center gap-4 border border-white/5">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Target className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-bold uppercase tracking-wider">Goal Preview</p>
              <p className="text-xs font-bold text-primary">0%</p>
            </div>
            <div className="h-1.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full w-0 bg-primary" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Target Name</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field w-full pl-12"
                placeholder="e.g., New Car"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Target Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field w-full pl-12"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Completion Deadline</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="input-field w-full pl-12"
                required
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex-1 py-3 px-6 rounded-xl font-semibold text-text-secondary hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Initializing...' : 'Initialize Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
