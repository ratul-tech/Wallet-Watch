import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Target as TargetIcon, Plus, CheckCircle2, Car, Umbrella, Milestone } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Targets: React.FC = () => {
  const [targets, setTargets] = useState<any[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/targets`), orderBy('currentAmount', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setTargets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('car') || n.includes('vehicle')) return Car;
    if (n.includes('emergency') || n.includes('safety')) return Umbrella;
    return Milestone;
  };

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-end">
        <div>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Milestones towards your freedom</p>
          <h2 className="text-3xl font-bold tracking-tight">Financial Targets</h2>
        </div>
        <Link to="/targets/add" className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
          <Plus className="w-6 h-6" />
        </Link>
      </section>

      <div className="space-y-4">
        {targets.length > 0 ? targets.map((target) => {
          const progress = Math.min(100, (target.currentAmount / target.targetAmount) * 100);
          const Icon = getIcon(target.name);
          return (
            <motion.div 
              key={target.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{target.name}</h3>
                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-wider">Target: ${target.targetAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
                  <p className="text-[10px] text-text-secondary uppercase font-bold">Progress</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-surface rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase">
                  <span>${target.currentAmount.toLocaleString()} Saved</span>
                  <span>${(target.targetAmount - target.currentAmount).toLocaleString()} Left</span>
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div className="text-center py-12 glass-card border-dashed">
            <TargetIcon className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
            <p className="text-text-secondary font-medium">No targets set yet. Start planning your future.</p>
          </div>
        )}
      </div>

      {/* AI Suggestion Card */}
      <div className="glass-card bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 p-6 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest">AI Strategy Insight</span>
        </div>
        <p className="text-sm font-medium leading-relaxed">
          Based on your current savings velocity, you're on track to reach your "Emergency Fund" 2 months ahead of schedule. Consider allocating the surplus to your "Dream Vehicle" goal.
        </p>
        <button className="text-xs font-bold text-primary uppercase tracking-wider hover:underline">Optimize Strategy</button>
      </div>
    </div>
  );
};
