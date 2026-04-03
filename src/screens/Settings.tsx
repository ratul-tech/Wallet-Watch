import React, { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { getSecurityStatus } from '../lib/gemini';
import { Shield, Moon, Globe, LogOut, Trash2, User, ChevronRight, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  const [securityMsg, setSecurityMsg] = useState('Analyzing security status...');
  const user = auth.currentUser;

  useEffect(() => {
    if (user?.email) {
      getSecurityStatus(user.email).then(setSecurityMsg);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <section className="glass-card flex items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-surface rounded-2xl overflow-hidden border-2 border-primary/20">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center border-4 border-background">
            <Shield className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.displayName || 'Oliver Stone'}</h2>
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Strategy Tier</p>
          <p className="text-xs text-text-secondary mt-1">Member since March 2024</p>
        </div>
      </section>

      <button className="glass-card w-full flex items-center justify-center gap-2 py-4 text-primary font-bold uppercase text-xs tracking-widest hover:bg-primary/5 transition-colors">
        <Edit3 className="w-4 h-4" />
        Edit Profile
      </button>

      <section className="space-y-4">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Preferences</p>
        <div className="glass-card p-0 overflow-hidden divide-y divide-white/5">
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-secondary">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Theme</p>
                <p className="text-xs text-text-secondary">Midnight Ledger (Dark)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-accent">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="font-bold">Language</p>
                <p className="text-xs text-text-secondary">English (US)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 ml-1">
          <Shield className="w-4 h-4 text-primary" />
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Account Security</p>
        </div>
        <div className="glass-card space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Full Name</label>
            <input className="input-field w-full bg-background/50" value={user?.displayName || 'Oliver Stone'} readOnly />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider ml-1">Current Password</label>
            <input className="input-field w-full bg-background/50" type="password" value="••••••••••••" readOnly />
          </div>
          <button className="btn-primary w-full">Update Credentials</button>
          
          {/* AI Monitor Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4"
          >
            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary uppercase tracking-widest">Google AI Studio</p>
              <p className="text-sm font-medium leading-relaxed">{securityMsg}</p>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Firebase MFA Active</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Account Management</p>
        <div className="glass-card p-0 overflow-hidden divide-y divide-white/5">
          <button 
            onClick={() => signOut(auth)}
            className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-text-secondary">
              <LogOut className="w-5 h-5" />
            </div>
            <p className="font-bold">Log Out</p>
          </button>
          <button className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors text-left group">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500/20">
              <Trash2 className="w-5 h-5" />
            </div>
            <p className="font-bold text-red-400">Delete Account</p>
          </button>
        </div>
      </section>
    </div>
  );
};
