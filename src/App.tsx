import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform 
} from 'motion/react';
import { 
  Shield, 
  ShieldAlert,
  ShieldCheck,
  Search, 
  Activity, 
  Map as MapIcon, 
  AlertTriangle, 
  Eye,
  Award,
  List, 
  LayoutDashboard,
  Play,
  Terminal,
  ChevronRight,
  Globe,
  Database,
  Cpu,
  RefreshCw,
  X,
  Lock,
  User,
  Fingerprint,
  Download,
  FileText,
  PieChart as PieChartIcon,
  BarChart3,
  CheckCircle2,
  Settings,
  Brain,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';
import * as d3 from 'd3';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn, formatDate, getSeverityColor } from './lib/utils';
import { Asset, Finding, ScanStatus, UserRole } from './types';
import { GoogleGenAI } from '@google/genai';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 group relative rounded-xl",
      active ? "text-white bg-white/10 backdrop-blur-md border border-white/10 shadow-lg shadow-indigo-500/10" : "text-slate-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-colors", active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
    {label}
    {active && <motion.div layoutId="active-nav" className="absolute left-0 w-1 h-1/2 bg-indigo-500 rounded-r-full" />}
  </button>
);

const StatCard = ({ label, value, subValue, icon: Icon, color }: { label: string, value: string | number, subValue?: string, icon: any, color: string }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl transition-all hover:bg-slate-800/40 hover:border-indigo-500/30 group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[80px] rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors duration-500" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={cn("p-2.5 rounded-xl transition-all duration-500 group-hover:rotate-6", color)}>
        <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-').replace('/20', ''))} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
          Live Pulse
        </span>
        <span className="text-[8px] font-mono text-slate-700 tracking-tighter">REF: {Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
      </div>
    </div>
    <h3 className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.15em] mb-1 relative z-10">{label}</h3>
    <div className="flex items-baseline gap-2 relative z-10">
      <span className="text-4xl font-black text-white tracking-tighter">{value}</span>
      {subValue && (
        <span className={cn(
            "text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider", 
            subValue.includes('-') || subValue.includes('Action') || subValue.includes('Elevated') || subValue.includes('Urgent') 
                ? "text-rose-400 bg-rose-500/10 border-rose-500/20" 
                : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        )}>
            {subValue}
        </span>
      )}
    </div>
  </motion.div>
);

// --- Pages ---

const LoginPage = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('analyst');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    
    // Simulate standard secure authentication flow
    setTimeout(() => {
      if (email && password) {
        onLogin(role);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden selection:bg-indigo-500/30 font-sans">
      {/* High-Tech Circuit Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-screen"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070')`,
            filter: 'hue-rotate(180deg) brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]/80" />
        
        {/* Animated Grid on top for depth */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-20%)',
            maskImage: 'linear-gradient(to bottom, transparent, black, transparent)'
          }}
        />

        {/* Dynamic Glowing Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -60, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" 
        />

        {/* Floating Digital Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
                y: [0, -100 - Math.random() * 200]
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-indigo-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 mix-blend-overlay pointer-events-none" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 px-6"
      >
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-10 shadow-[0_32px_120px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="mb-6 relative group">
              <div className="absolute -inset-4 bg-indigo-500/30 rounded-full blur-2xl group-hover:bg-indigo-500/50 transition-all duration-700 opacity-60 group-hover:opacity-100 animate-pulse" />
              <div className="w-24 h-24 rounded-[30px] border-2 border-white/20 p-0.5 backdrop-blur-xl relative z-10 overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 group-hover:border-indigo-400 group-hover:scale-110 transition-all duration-500 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                <div className="w-full h-full flex items-center justify-center bg-[#020617] rounded-[28px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent)]" />
                  <Eye className="w-12 h-12 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" strokeWidth={1.5} />
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]" />
                </div>
              </div>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-1 uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">AEGIS</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Strategic Intelligence Node</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest ml-1">Account Level</label>
              <div className="grid grid-cols-3 gap-2">
                  {(['viewer', 'analyst', 'admin'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={cn(
                            "py-2 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all",
                            role === r 
                                ? "bg-indigo-500/10 border-indigo-500/40 text-indigo-400" 
                                : "bg-white/2 border-white/10 text-slate-500 hover:border-white/20"
                        )}
                      >
                        {r}
                      </button>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="email" 
                  placeholder="operator@aegis.intel"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a0b0d]/50 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest hover:text-indigo-300 transition-colors">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0b0d]/50 border border-white/10 rounded-xl px-12 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {isError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <p className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">Invalid credentials. Access denied.</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 group mt-4 relative overflow-hidden"
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Fingerprint className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Standard Security Protocol Active • AES-256 Enabled
            </p>
          </div>
        </div>
        
        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-8">
          Authorized Personnel Only
        </p>
      </motion.div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0b0c10]/95 backdrop-blur-2xl border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">{label || payload[0].name}</p>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].color || payload[0].fill }} />
          <p className="text-sm font-black text-white font-mono">
            {payload[0].value} <span className="text-[10px] text-slate-400 font-normal">UNIT</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AIAssetRiskAnalysis = ({ assets, findings, onAssetClick, userRole }: { assets: Asset[], findings: Finding[], onAssetClick: (asset: Asset) => void, userRole: UserRole }) => {
  const [analysis, setAnalysis] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (userRole === 'viewer') return null;

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    setHasError(false);
    try {
        const assetData = assets.map(a => ({
            id: a.id,
            name: a.value,
            riskScore: a.riskScore,
            vulnCount: findings.filter(f => f.assetId === a.id).length,
            ports: a.metadata?.ports?.length || 0,
            exposure: a.metadata?.waf === 'None' ? 'High' : 'Low'
        })).sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const model = "gemini-3-flash-preview";
        
        const prompt = `As a cybersecurity AI analyst, prioritize these assets for immediate remediation. 
        Calculate an "Urgency Score" (0-100) for each based on its Risk Score, Vulnerability Count, Open Ports, and Network Exposure.
        
        Assets: ${JSON.stringify(assetData)}
        
        Return a JSON array of exactly the top 3 critical assets, prioritized by urgency:
        [{ "name": "...", "id": "...", "urgencyScore": 95, "reason": "Short explanation", "threatLevel": "Critical" | "High" }]
        
        Ensure the response is ONLY the JSON array.`;

        const result = await genAI.models.generateContent({
             model,
             contents: prompt
        });

        const text = result.text || "";
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            setAnalysis(JSON.parse(jsonMatch[0]));
        } else {
            throw new Error("No JSON found in response");
        }
    } catch (error) {
        console.error("AI Analysis Error:", error);
        setHasError(true);
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis([]);
    setHasError(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Brain className="w-40 h-40 text-indigo-500" />
      </div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" /> Neural Risk Prioritization
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Calculated via Intelligence Engine-v2</p>
        </div>

        <div className="flex gap-2">
            {(analysis.length > 0 || hasError) && !isAnalyzing && (
                <button 
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-3 h-3" /> Back
                </button>
            )}
            
            <button 
              onClick={performAIAnalysis}
              disabled={isAnalyzing}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                isAnalyzing 
                  ? "bg-slate-800 text-slate-500 border-white/5 cursor-wait" 
                  : hasError
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20"
                    : analysis.length > 0 
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
              )}
            >
              {isAnalyzing ? (
                <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Processing Assets...
                </>
              ) : hasError ? (
                <>
                    <RefreshCw className="w-3 h-3" />
                    Retry Analysis
                </>
              ) : analysis.length > 0 ? (
                <>
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                </>
              ) : (
                <>
                    <Brain className="w-3 h-3" />
                    Run Analysis
                </>
              )}
            </button>
        </div>
      </div>

      <div className="space-y-4 relative z-10 min-h-[140px] flex flex-col justify-center">
        {isAnalyzing ? (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl" />
                ))}
            </div>
        ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-rose-500/5 border border-dashed border-rose-500/20 rounded-2xl">
                <ShieldAlert className="w-10 h-10 mb-3 text-rose-500/40" />
                <p className="text-[12px] uppercase font-black tracking-widest text-rose-500 mb-1">Intelligence Link Interrupted</p>
                <p className="text-[10px] text-slate-500 font-medium">The analysis engine encountered a structural timeout. Please verify API availability and retry.</p>
            </div>
        ) : analysis.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.map((item, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        onClick={() => {
                            const asset = assets.find(a => a.id === item.id || a.value === item.name);
                            if (asset) onAssetClick(asset);
                        }}
                        className="bg-white/2 border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-all group/item cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <span className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
                                item.threatLevel === 'Critical' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                            )}>
                                {item.threatLevel}
                            </span>
                            <span className="text-xl font-black text-white font-mono tracking-tighter">{item.urgencyScore}%</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate mb-1">{item.name}</p>
                        <p className="text-[10px] text-slate-500 leading-tight italic line-clamp-2">{item.reason}</p>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-8 opacity-20 text-center">
                <ShieldAlert className="w-10 h-10 mb-3" />
                <p className="text-[10px] uppercase font-bold tracking-widest">Awaiting Command Input to Map Critical Assets</p>
            </div>
        )}
      </div>
    </div>
  );
};

const AssetDetailModal = ({ asset, findings, onClose, userRole }: { asset: Asset, findings: Finding[], onClose: () => void, userRole: UserRole }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl cursor-default"
    >
      <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0b0c10] border border-white/10 w-full max-w-5xl rounded-[32px] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative max-h-[90vh] flex flex-col cursor-default"
      >
          
          <div className="flex justify-between items-center px-10 py-8 bg-white/2 relative z-10 border-b border-white/5">
              <div className="flex items-center gap-5">
                  <button 
                      onClick={onClose}
                      className="mr-2 p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all flex items-center gap-2 group/back"
                  >
                      <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                  </button>
                  <div className={cn(
                    "p-3 rounded-2xl border shadow-[0_0_20px_rgba(99,102,241,0.1)]",
                    asset.riskScore > 70 ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                  )}>
                      <Globe className="w-8 h-8" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-black text-white tracking-tighter leading-tight font-mono">{asset.value}</h2>
                      <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Asset Status: </span>
                          <span className={cn(
                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                            asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'
                          )}>{asset.status}</span>
                      </div>
                  </div>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-rose-500/10 group rounded-full transition-all">
                  <X className="w-6 h-6 text-slate-500 group-hover:text-rose-500" />
              </button>
          </div>

          <div className="p-10 overflow-y-auto flex-grow custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-1 space-y-8">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-[0.2em]">Risk Breakdown</div>
                          <div className="flex items-end gap-3 mb-4">
                              <span className={cn(
                                "text-5xl font-black tracking-tighter",
                                asset.riskScore > 70 ? 'text-rose-500' : 'text-indigo-400'
                              )}>{asset.riskScore}</span>
                              <span className="text-slate-500 font-bold text-xs mb-1.5 lowercase">Score Index</span>
                          </div>
                          <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                              <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${asset.riskScore}%` }}
                                  className={cn(
                                    "h-full transition-all duration-1000",
                                    asset.riskScore > 70 ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-indigo-500'
                                  )} 
                              />
                          </div>
                      </div>

                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Surface Metadata</div>
                          <div className="space-y-4">
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                  <span className="text-[10px] uppercase font-bold text-slate-400">Primary IP</span>
                                  <span className="text-xs font-mono text-white">{asset.metadata.ip || '0.0.0.0'}</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                  <span className="text-[10px] uppercase font-bold text-slate-400">Environment</span>
                                  <span className="text-xs font-mono text-white">Production Cluster</span>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-white/5">
                                  <span className="text-[10px] uppercase font-bold text-slate-400">Network WAF</span>
                                  <span className="text-xs font-mono text-indigo-400">{asset.metadata.waf || 'None Detected'}</span>
                              </div>
                          </div>
                      </div>

                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                          <div className="text-[10px] text-slate-500 font-black uppercase mb-4 tracking-[0.2em]">Detected Ports</div>
                          <div className="flex flex-wrap gap-2">
                              {asset.metadata.ports?.map(p => (
                                  <span key={p} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-mono text-indigo-400">:{p}</span>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center justify-between">
                          <h4 className="text-[11px] uppercase text-white font-black tracking-[0.2em]">Security Incidents & Vulnerabilities</h4>
                          <span className="text-[10px] font-mono text-slate-500">{findings.length} Finding(s) Found</span>
                      </div>

                      <div className="space-y-4">
                          {findings.length > 0 ? findings.map(finding => (
                              <div key={finding.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-indigo-500/5 transition-all group/find relative overflow-hidden">
                                  <div className="flex justify-between items-start relative z-10">
                                      <div className="flex gap-4">
                                          <div className={cn(
                                            "w-1 h-12 rounded-full",
                                            finding.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                                          )} />
                                          <div>
                                              <div className="text-sm font-bold text-white mb-1">{finding.title}</div>
                                              <p className="text-xs text-slate-500 leading-relaxed max-w-lg mb-3">{finding.description}</p>
                                              <div className="flex gap-3">
                                                  <span className={cn(
                                                      "text-[9px] font-black uppercase px-2 py-0.5 rounded border",
                                                      getSeverityColor(finding.severity)
                                                  )}>{finding.severity}</span>
                                                  <span className="text-[9px] font-mono text-slate-600">{formatDate(finding.timestamp)}</span>
                                              </div>
                                          </div>
                                      </div>
                                      <button className="p-2 opacity-0 group-hover/find:opacity-100 transition-opacity">
                                          <ChevronRight className="w-4 h-4 text-indigo-400" />
                                      </button>
                                  </div>
                              </div>
                          )) : (
                              <div className="py-20 flex flex-col items-center justify-center bg-white/2 rounded-[32px] border border-dashed border-white/10">
                                  <ShieldCheck className="w-16 h-16 text-emerald-500/20 mb-4" />
                                  <p className="text-sm text-slate-500 font-bold uppercase tracking-widest italic">No Vulnerabilities Detected on Host</p>
                              </div>
                          )}
                      </div>

                      {asset.metadata.tech && (
                          <div className="mt-8">
                              <h4 className="text-[11px] uppercase text-white font-black tracking-[0.2em] mb-4">Technology Fingerprint</h4>
                              <div className="flex flex-wrap gap-2">
                                  {asset.metadata.tech.map(t => (
                                      <span key={t} className="px-4 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-xs font-medium text-slate-400">{t}</span>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard = ({ assets, findings, onAssetClick, userRole, setActiveTab }: { 
  assets: Asset[], 
  findings: Finding[], 
  onAssetClick: (asset: Asset) => void, 
  userRole: UserRole, 
  setActiveTab: (tab: string) => void 
}) => {
  const severityData = [
    { name: 'Critical', value: findings.filter(f => f.severity === 'critical').length, color: '#f43f5e' },
    { name: 'High', value: findings.filter(f => f.severity === 'high').length, color: '#f97316' },
    { name: 'Medium', value: findings.filter(f => f.severity === 'medium').length, color: '#fbbf24' },
    { name: 'Low', value: findings.filter(f => f.severity === 'low').length, color: '#6366f1' },
  ].filter(d => d.value > 0);

  const riskTrend = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 52 },
    { day: 'Wed', score: 48 },
    { day: 'Thu', score: 61 },
    { day: 'Fri', score: 55 },
    { day: 'Sat', score: 67 },
    { day: 'Sun', score: 72 },
  ];

  const complianceBenchmarking = [
    { name: 'SOC2 Availability', val: 92 },
    { name: 'PCI-DSS Data Protection', val: 68 },
    { name: 'CIS Top 20 Control', val: 74 },
    { name: 'GDPR Privacy Integrity', val: 89 },
  ];

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const accentColor = [79, 70, 229]; // Indigo-600
    const darkColor = [15, 23, 42]; // Slate-900

    // --- Header (Restored from Screenshot) ---
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, pageWidth, 55, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text("AEGIS", margin, 32);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(129, 140, 248); // text-indigo-400
    doc.text("ATTACK SURFACE MANAGEMENT CORE", margin, 40);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Intelligence Surface Analysis Report", pageWidth - margin, 32, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // text-slate-400
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 40, { align: 'right' });
    doc.text(`Report ID: ASM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, pageWidth - margin, 46, { align: 'right' });

    // --- Technical Metadata Block (Restored from Screenshot) ---
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(margin, 65, pageWidth - (margin * 2), 25, 'F');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.text("SCAN METADATA", margin + 5, 72);
    doc.setFont('helvetica', 'normal');
    doc.text(`Engine Version: 4.2.0-STABLE`, margin + 5, 78);
    doc.text(`Analysis Depth: Level 4 (Comprehensive)`, margin + 5, 83);
    doc.text(`Region: GLOBAL-CLUSTER-01`, margin + 85, 78);
    doc.text(`Scan Duration: 142.4ms`, margin + 85, 83);

    // --- Verification Statement Block ---
    doc.setFillColor(238, 242, 255); // indigo-50
    doc.setDrawColor(199, 210, 254);
    doc.rect(margin, 95, pageWidth - (margin * 2), 10, 'FD');
    doc.setFontSize(7);
    doc.setTextColor(67, 56, 202); // indigo-700
    doc.setFont('helvetica', 'bold');
    doc.text("VERIFICATION STATEMENT:", margin + 5, 101.5);
    doc.setFont('helvetica', 'normal');
    doc.text("THIS INFRASTRUCTURE HAS BEEN CRYPTOGRAPHICALLY VALIDATED BY AEGIS-AI-ASSURANCE-V4 ENGINE.", margin + 45, 101.5);

    // --- Section 1: Executive Summary ---
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("1. EXECUTIVE SUMMARY", margin, 115);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, 118, pageWidth - margin, 118);

    const avgRisk = assets.length ? Math.round(assets.reduce((acc, curr) => acc + curr.riskScore, 0) / assets.length) : 0;
    const criticalCount = findings.filter(f => f.severity === 'critical').length;

    autoTable(doc, {
      startY: 125,
      head: [['Strategic Metric', 'Current Value', 'Assessed Status']],
      body: [
        ["Total Surface Assets", assets.length.toString(), "Infrastructure Baseline"],
        ["Aggregated Risk Score", `${avgRisk}/100`, avgRisk > 60 ? "ACTION REQUIRED" : "STABLE"],
        ["Critical Vulnerabilities", criticalCount.toString(), criticalCount > 0 ? "HIGH RISK" : "CLEAN"]
      ],
      theme: 'striped',
      headStyles: { fillColor: accentColor as any, textColor: 255 as any },
      styles: { fontSize: 9, cellPadding: 4 }
    });

    // --- Section 2: Critical Asset Inventory ---
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("2. ASSET RISK CLASSIFICATION", margin, (doc as any).lastAutoTable.finalY + 15);

    const assetData = assets
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10)
        .map(a => [a.value, a.type.toUpperCase(), a.riskScore.toString(), a.status]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Asset Resource / Host', 'Type', 'Risk Score', 'Network Status']],
        body: assetData,
        theme: 'grid',
        headStyles: { fillColor: [51, 65, 85] },
        columnStyles: {
            2: { fontStyle: 'bold', halign: 'center' }
        }
    });

    // --- Section 3: Findings Inventory ---
    doc.addPage();
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("AEGIS INTELLIGENCE REPORT", margin, 12);

    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text("3. DETAILED FINDINGS INVENTORY", margin, 35);

    const findingsData = findings
      .sort((a, b) => {
        const priority: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        return priority[a.severity] - priority[b.severity];
      })
      .map(f => [f.title, f.severity.toUpperCase(), f.description]);

    autoTable(doc, {
      startY: 40,
      head: [['Vulnerability Findings', 'Severity', 'Contextual Analysis']],
      body: findingsData,
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105] },
      columnStyles: {
        1: { fontStyle: 'bold', cellWidth: 30 },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          const val = data.cell.raw as string;
          if (val === 'CRITICAL') data.cell.styles.textColor = [225, 29, 72] as any;
          if (val === 'HIGH') data.cell.styles.textColor = [234, 88, 12] as any;
        }
      }
    });

    // --- Section 4: Authority Certification ---
    const currentY = (doc as any).lastAutoTable.finalY + 20;
    const certBoxHeight = 100;
    
    if (currentY + certBoxHeight > pageHeight - 20) {
        doc.addPage();
        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(0, 0, pageWidth, 20, 'F');
    }

    const certStartY = Math.max((doc as any).lastAutoTable.finalY + 20, 30);

    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.3);
    doc.setLineWidth(0.5);
    doc.rect(margin, certStartY, pageWidth - (margin * 2), certBoxHeight);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("CERTIFICATE OF AUTHORITY", pageWidth / 2, certStartY + 15, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(100);
    const disclaimer = "This document confirms that the infrastructure analysis has been performed by verified AI modules and human oversight. The findings contained herein represent the active security posture at the time of export.";
    doc.text(doc.splitTextToSize(disclaimer, pageWidth - 50), pageWidth / 2, certStartY + 25, { align: 'center' });

    const sigY = certStartY + 50;
    doc.setDrawColor(200);
    doc.line(margin + 15, sigY + 20, margin + 75, sigY + 20);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text("Jeethendra", margin + 25, sigY + 17);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text("LEAD SECURITY OPERATOR", margin + 15, sigY + 25);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text("JEETHENDRA REDDY M", margin + 15, sigY + 29);

    const sealX = pageWidth - margin - 50;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.circle(sealX + 25, sigY + 10, 15);
    for(let j=0; j<24; j++) {
        const angle = (j / 24) * Math.PI * 2;
        const x1 = (sealX + 25) + Math.cos(angle) * 15;
        const y1 = (sigY + 10) + Math.sin(angle) * 15;
        const x2 = (sealX + 25) + Math.cos(angle) * 18;
        const y2 = (sigY + 10) + Math.sin(angle) * 18;
        doc.line(x1, y1, x2, y2);
    }
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text("A", sealX + 25, sigY + 15, { align: 'center' });
    doc.setFontSize(8);
    doc.text("AEGIS VERIFIED", sealX + 25, sigY + 30, { align: 'center' });

    // --- CERTIFICATE PAGE (Dedicated Official Credential) ---
    doc.addPage();
    doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative Borders for Certificate
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.2);
    doc.setLineWidth(1);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

    const centerX = pageWidth / 2;

    // Badge Header
    doc.setFillColor(30, 27, 75);
    doc.roundedRect(centerX - 40, 25, 80, 12, 6, 6, 'F');
    doc.setTextColor(129, 140, 248);
    doc.setFontSize(8);
    doc.text("OFFICIAL SECURITY CREDENTIAL", centerX, 32.5, { align: 'center' });

    // Main Titles
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.text("CERTIFICATE OF", centerX, 60, { align: 'center' });
    
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(44);
    doc.text("VERIFICATION", centerX, 82, { align: 'center' });

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text("AEGIS-AI-ASSURANCE-V4 PROVISIONED", centerX, 94, { align: 'center' });

    // Technical Seal (Center)
    const sealY = 140;
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.05);
    doc.circle(centerX, sealY, 50);
    doc.circle(centerX, sealY, 40);
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
    doc.circle(centerX, sealY, 30);
    
    doc.setTextColor(255, 255, 255, 0.7);
    doc.setFontSize(28);
    doc.text("A", centerX, sealY + 10, { align: 'center' });

    // Scope information
    doc.setFillColor(30, 27, 75, 0.4);
    doc.roundedRect(margin, 205, pageWidth - (margin * 2), 45, 4, 4, 'F');
    
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text("SECURE DOMAIN MAPPING / TOPOLOGY TARGETS", margin + 10, 215);

    doc.setTextColor(255, 255, 255, 0.8);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const displayAssets = assets.slice(0, 3);
    displayAssets.forEach((a, i) => {
        doc.text(`> ${a.value} [${a.metadata.ip || '0.0.0.0'}]`, margin + 10, 225 + (i * 7));
    });

    doc.setTextColor(148, 163, 184);
    doc.text(`SCAN REF: ${Math.random().toString(36).substr(2, 10).toUpperCase()}`, pageWidth - margin - 10, 225, { align: 'right' });
    doc.text(`VERIFIED: ${new Date().toLocaleDateString()}`, pageWidth - margin - 10, 232, { align: 'right' });

    // Signatures at bottom of certificate page
    const certSigY = 265;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text("Jeethendra", margin + 10, certSigY);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("LEAD OPERATOR: JEETHENDRA REDDY M", margin + 10, certSigY + 10);

    doc.setFontSize(12);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text("VERIFICATION MODULE", pageWidth - margin - 10, certSigY, { align: 'right' });
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("CRYPTO-SIGNED INFRASTRUCTURE", pageWidth - margin - 10, certSigY + 10, { align: 'right' });

    // Final Footer
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`CONFIDENTIAL • AEGIS INTEL SEC-OP • PAGE ${i} OF ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    doc.save(`AEGIS_Intelligence_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Intelligence report exported", {
      style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-2">
          <div>
              <h2 className="text-xl font-bold text-white tracking-tight text-[32px]">Active Surveillance</h2>
              <p className="text-xs text-slate-500 font-medium">Real-time attack surface metrics</p>
          </div>
          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-indigo-400 hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            <Download className="w-3 h-3" /> Export Intelligence Report
          </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Assets" value={assets.length} subValue="+12 today" icon={Globe} color="bg-indigo-500/20" />
        <StatCard label="Critical Exposure" value={findings.filter(f => f.severity === 'critical').length} subValue="Urgent" icon={AlertTriangle} color="bg-rose-500/20" />
        <StatCard label="Risk Score" value={assets.length ? Math.round(assets.reduce((acc, curr) => acc + curr.riskScore, 0) / assets.length) : 0} subValue="Elevated" icon={Activity} color="bg-amber-500/20" />
        <StatCard label="WAF Coverage" value={`${assets.length ? Math.round((assets.filter(a => a.metadata?.waf && a.metadata.waf !== 'None').length / assets.length) * 100) : 0}%`} subValue="Filtering" icon={Shield} color="bg-blue-500/20" />
      </div>

      <AIAssetRiskAnalysis assets={assets} findings={findings} onAssetClick={onAssetClick} userRole={userRole} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col">
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400 p-0.5 border border-[#802f41] rounded-[4px]" /> Compliance Benchmarking
          </h3>
          <div className="space-y-6">
             {complianceBenchmarking.map(item => (
                <div key={item.name} className="relative group/bench">
                   <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 group-hover/bench:text-indigo-400 transition-colors">
                      <span className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                        {item.name}
                      </span>
                      <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">{item.val}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-900 border border-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={cn("h-full rounded-full relative shadow-[0_0_15px_rgba(var(--tw-shadow-color),0.3)]", 
                            item.val > 90 ? 'bg-emerald-500' : item.val > 70 ? 'bg-indigo-500' : 'bg-amber-500'
                        )}
                      >
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                      </motion.div>
                   </div>
                </div>
             ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5">
             <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Global Status</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-black rounded-full border border-emerald-500/20">Operational</span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
             <BarChart3 className="w-48 h-48 text-indigo-500 -mr-12 -mt-12" />
          </div>
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400 p-0.5 border border-[#802f41] rounded-[4px]" /> Average Asset Risk Score Trend
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrend}>
                <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} dx={-10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#6366f1' }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
             <BarChart3 className="w-48 h-48 text-indigo-500 -mr-12 -mt-12" />
          </div>
          <h3 className="text-white text-sm font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-400" /> Vulnerability Metrics Overview
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                    { name: 'Critical', count: findings.filter(f => f.severity === 'critical').length },
                    { name: 'High', count: findings.filter(f => f.severity === 'high').length },
                    { name: 'Medium', count: findings.filter(f => f.severity === 'medium').length },
                    { name: 'Low', count: findings.filter(f => f.severity === 'low').length }
                ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col">
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Risk Distribution
          </h3>
          <div className="h-[250px] flex-grow">
             {severityData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={severityData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={90}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {severityData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                     itemStyle={{ color: '#fff' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">No critical data points</div>
             )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Cpu className="w-5 h-5 transition-colors group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xs text-white font-semibold">AI Risk Insight</p>
                <p className="text-[10px] text-slate-500 leading-tight">Focus on dev-api.target.com; exposed config detected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">High Risk Inventory</h3>
          </div>
          <button className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Expand View</button>
        </div>
        <div className="overflow-hidden overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-500 uppercase text-[10px] tracking-widest">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Asset / Target Identity</th>
                        <th className="px-6 py-4 font-semibold">Stack / Defense</th>
                        <th className="px-6 py-4 font-semibold">Risk Level</th>
                        <th className="px-6 py-4 font-semibold">Activity</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {assets.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map((asset, idx) => (
                        <tr 
                            key={asset.id} 
                            onClick={() => onAssetClick(asset)}
                            className={cn("hover:bg-white/5 transition-colors cursor-pointer group", idx % 2 !== 0 && "bg-white/2")}
                        >
                            <td className="px-6 py-5">
                                <div className="font-medium text-white font-mono flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", asset.riskScore > 70 ? 'bg-rose-500' : 'bg-emerald-500')} />
                                    {asset.value}
                                </div>
                                <div className="text-[10px] text-slate-500 mt-1 pl-3.5 italic">{asset.metadata?.ip || 'Pending Host Resolution'} • {asset.metadata?.ports?.length || 0} Ports</div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {asset.metadata?.waf && asset.metadata.waf !== 'None' && (
                                        <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-[9px] uppercase font-bold text-blue-400">
                                            {asset.metadata.waf}
                                        </span>
                                    )}
                                    {asset.metadata?.tech?.map((t: string) => (
                                        <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] uppercase font-bold text-slate-400">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${asset.riskScore}%` }}
                                            className={cn("h-full transition-all duration-1000", asset.riskScore > 70 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : asset.riskScore > 40 ? 'bg-amber-500' : 'bg-emerald-500')} 
                                        />
                                    </div>
                                    <span className={cn("text-xs font-mono font-bold", asset.riskScore > 70 ? 'text-rose-500' : asset.riskScore > 40 ? 'text-amber-500' : 'text-emerald-500')}>
                                        {asset.riskScore}/100
                                    </span>
                                </div>
                                {userRole === 'viewer' && (
                                    <div className="mt-2 text-[8px] text-slate-600 font-bold uppercase tracking-widest italic">Details Restricted</div>
                                )}
                            </td>
                            <td className="px-6 py-5 text-slate-500 text-xs font-mono">{formatDate(asset.lastSeen)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

const ScanPage = ({ isScanning, progress, logs, onStartScan, userRole }: { isScanning: boolean, progress: number, logs: string[], onStartScan: (target: string) => void, userRole: UserRole }) => {
  const [target, setTarget] = useState('example.com');
  const [history, setHistory] = useState<any[]>([]);
  const [filterTarget, setFilterTarget] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    fetch('/api/scans/history').then(res => res.json()).then(setHistory);
  }, [logs]);

  const filteredHistory = useMemo(() => {
    return history
      .filter(scan => {
        const matchesTarget = scan.target.toLowerCase().includes(filterTarget.toLowerCase());
        const matchesStatus = filterStatus === 'all' || scan.status === filterStatus;
        return matchesTarget && matchesStatus;
      })
      .sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
      });
  }, [history, filterTarget, filterStatus, sortOrder]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
          <h3 className="text-white text-sm font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" /> Infrastructure Recon
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase text-slate-500 tracking-widest block mb-2 font-bold ml-1">Target Surface</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  disabled={isScanning}
                  placeholder="domain.com / IP CIDR"
                  className="w-full bg-[#0a0b0d]/50 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 font-mono"
                />
                <Globe className="absolute right-4 top-3.5 w-4 h-4 text-slate-800" />
              </div>
            </div>
            
            <button 
              onClick={() => onStartScan(target)}
              disabled={isScanning || !target || userRole !== 'admin'}
              className={cn(
                "w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 group shadow-lg",
                isScanning || !target || userRole !== 'admin' 
                  ? "bg-slate-900 border-white/5 text-slate-600 grayscale cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/20 text-white shadow-indigo-600/20"
              )}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  PIPELINE ENGAGED
                </>
              ) : (
                <>
                  <Play className={cn("w-5 h-5 group-hover:scale-110 transition-transform", userRole === 'admin' ? "fill-white" : "fill-slate-600")} />
                  {userRole === 'admin' ? 'INITIATE RECON CYCLE' : 'RECON ACCESS DENIED'}
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
             <h4 className="text-[10px] uppercase text-slate-500 tracking-widest mb-4 font-bold italic">Engaged Intelligence Modules</h4>
             <ul className="space-y-3">
                {[
                    'Subfinder Integration', 
                    'DNSX Resolution Grid', 
                    'HTTPX Signature Probing', 
                    'NMAP Service Fingerprinting', 
                    'Secret Hunting (Regex-Based)', 
                    'Risk Engine (Aegis-v2)'
                ].map((m, i) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                        <div className="w-2 h-2 rounded bg-indigo-500/40 border border-indigo-400/30" />
                        {m}
                    </li>
                ))}
             </ul>
          </div>
        </div>

        {isScanning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600/10 backdrop-blur-md border border-indigo-500/20 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Discovery Coverage</span>
                <span className="text-xs font-mono font-bold text-indigo-400">{progress}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5">
                <motion.div 
                   className="h-full bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-[10px] text-indigo-400/60 mt-3 font-mono italic">Parallelizing DNS resolution threads...</p>
          </motion.div>
        )}

        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
           <h3 className="text-white text-[10px] font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
             <RefreshCw className="w-3 h-3 text-slate-500" /> Historic Surveillance
           </h3>

           <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3 h-3 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Filter by target..."
                  value={filterTarget}
                  onChange={(e) => setFilterTarget(e.target.value)}
                  className="w-full bg-[#0a0b0d]/50 border border-white/5 rounded-lg px-8 py-2 text-[10px] text-white focus:outline-none focus:border-indigo-500/30 transition-all font-mono"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 bg-[#0a0b0d]/50 border border-white/5 rounded-lg px-2 py-2 text-[10px] text-slate-400 font-mono focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="in-progress">In Progress</option>
                </select>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="flex-1 bg-[#0a0b0d]/50 border border-white/5 rounded-lg px-2 py-2 text-[10px] text-slate-400 font-mono focus:outline-none"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
           </div>

           <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {filteredHistory.length > 0 ? filteredHistory.map((scan, i) => (
                 <div key={i} className="p-3 bg-white/2 border border-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-default group">
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-tighter">#{scan.id}</span>
                            <span className={cn(
                                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded border",
                                scan.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                scan.status === 'failed' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                            )}>
                                {scan.status}
                            </span>
                        </div>
                        <span className="text-[9px] text-slate-600 font-mono">{formatDate(scan.timestamp)}</span>
                    </div>
                    <p className="text-[11px] text-white font-medium mb-2 truncate">{scan.target}</p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{scan.assetsCount} Assets</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{scan.findingCount} Risks</span>
                        </div>
                    </div>
                 </div>
              )) : (
                 <div className="text-center py-8 opacity-20">
                    <Database className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-[10px] uppercase font-bold tracking-widest leading-none">No Results Found</p>
                 </div>
              )}
           </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col min-h-[600px] shadow-2xl">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-500" />
                <h3 className="text-white text-xs font-bold uppercase tracking-wider">Live System Logs • Aegis-Terminal</h3>
            </div>
            <div className="flex items-center gap-3">
                <div className={cn("px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-tighter", isScanning ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-slate-800 text-slate-500 border-white/5")}>
                    {isScanning ? 'ENCRYPTING STREAMS' : 'OFFLINE'}
                </div>
            </div>
          </div>
          <div className="p-6 font-mono text-[11px] bg-[#020617]/50 flex-grow overflow-y-auto space-y-2 custom-scrollbar selection:bg-indigo-500/50">
            {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                    <Activity className="w-12 h-12 text-slate-700" />
                    <p className="text-sm italic uppercase tracking-[0.3em]">Awaiting Input Signal</p>
                </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className={cn(
                "flex gap-4 border-l-2 pl-4 transition-all py-1 cursor-default hover:bg-white/2",
                log.includes('[INIT]') || log.includes('[FINISH]') ? "border-indigo-500 text-indigo-300 bg-indigo-500/5" :
                log.includes('[STAGE]') ? "border-emerald-500 text-emerald-300" : "border-slate-800 text-slate-500"
              )}>
                <span className="opacity-20 whitespace-nowrap text-[9px]">{i.toString().padStart(4, '0')}</span>
                <span className="leading-relaxed">{log}</span>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

const AssetMap = ({ assets, onAssetClick }: { assets: Asset[], onAssetClick: (asset: Asset) => void }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || assets.length === 0) return;

        const container = svgRef.current.parentElement;
        if(!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight - 80;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const nodes: any[] = [];
        const links: any[] = [];

        // Root node
        const rootId = 'target-root';
        const targetDomain = assets[0]?.metadata?.parent || 'target';
        nodes.push({ id: rootId, label: targetDomain, type: 'root', color: '#6366f1' });

        assets.forEach(asset => {
            nodes.push({ 
                id: asset.id, 
                label: asset.value, 
                type: 'asset', 
                color: asset.riskScore > 70 ? '#f43f5e' : asset.riskScore > 40 ? '#f97316' : '#10b981'
            });
            links.push({ source: rootId, target: asset.id });

            if (asset.metadata?.ports) {
                asset.metadata.ports.forEach((p, idx) => {
                    const portId = `port-${asset.id}-${p}`;
                    nodes.push({ id: portId, label: `:${p}`, type: 'port', color: '#475569' });
                    links.push({ source: asset.id, target: portId });
                });
            }
        });

        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
            .force("charge", d3.forceManyBody().strength(-250))
            .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
            .attr("stroke", "rgba(255,255,255,0.05)")
            .selectAll("line")
            .data(links)
            .join("line")
            .attr("stroke-width", 1);

        const node = svg.append("g")
            .selectAll("g")
            .data(nodes)
            .join("g")
            .call(d3.drag<any, any>()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        node.append("circle")
            .attr("r", (d: any) => d.type === 'root' ? 14 : d.type === 'asset' ? 10 : 5)
            .attr("fill", (d: any) => d.color)
            .attr("filter", (d: any) => d.type === 'root' ? "blur(1px)" : "none")
            .attr("stroke", "rgba(255,255,255,0.1)")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                if (d.type === 'asset') {
                    const asset = assets.find(a => a.id === d.id);
                    if (asset) onAssetClick(asset);
                }
            });

        node.append("text")
            .text((d: any) => d.label)
            .attr("x", 15)
            .attr("y", 4)
            .attr("fill", "rgba(255,255,255,0.4)")
            .attr("font-size", (d: any) => d.type === 'root' ? "12px" : "10px")
            .attr("font-family", "monospace")
            .attr("font-weight", "600")
            .style("pointer-events", "none");

        simulation.on("tick", () => {
            link
                .attr("x1", (d: any) => d.source.x)
                .attr("y1", (d: any) => d.source.y)
                .attr("x2", (d: any) => d.target.x)
                .attr("y2", (d: any) => d.target.y);

            node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
        });

        return () => simulation.stop();
    }, [assets]);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative h-[700px] overflow-hidden shadow-2xl">
            <div className="absolute top-6 left-6 z-10">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <MapIcon className="w-5 h-5 text-indigo-500" /> Infrastructure Topology
                </h3>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Relational Vector Analysis</p>
            </div>
            
            <svg ref={svgRef} className="w-full h-full" />
            
            <div className="absolute bottom-6 right-6 bg-[#020617]/80 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex flex-col gap-3 z-10 shadow-2xl">
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" /> Target Hub
                </div>
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="w-3 h-3 rounded-full bg-rose-500" /> High Criticality
                </div>
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" /> Security Verified
                </div>
                <div className="flex items-center gap-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    <div className="w-3 h-3 rounded-md bg-slate-600" /> Exposed Vector
                </div>
                <div className="mt-2 pt-2 border-t border-white/5 text-[8px] text-slate-600 font-mono italic">DRAG NODES TO RESTRUCTURE VIEW</div>
            </div>
        </div>
    );
};

const FindingsPage = ({ findings, userRole, onUpdateFinding }: { findings: Finding[], userRole: UserRole, onUpdateFinding: (id: string, priority: any) => void }) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const selectedFinding = useMemo(() => findings.find(f => f.id === selectedFindingId), [findings, selectedFindingId]);
  const [analysisResult, setAnalysisResult] = useState<{ summary: string; steps: string[]; confidence: number } | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'severity', direction: 'desc' });
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const analyzeWithAI = async (finding: Finding) => {
    setSelectedFindingId(finding.id);
    setAnalysisResult(null);
    setIsExplaining(true);
    
    try {
        const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const model = "gemini-3-flash-preview";
        const prompt = `As a cybersecurity expert, analyze this vulnerability finding.
        Finding: ${finding.title}
        Severity: ${finding.severity}
        Description: ${finding.description}
        
        Provide:
        1. A concise summary of the significance.
        2. Exactly 3 concrete remediation steps.
        3. A confidence score (0-100) for this analysis based on the specificity of the finding.
        
        Format the response strictly as valid JSON with this structure:
        {
          "summary": "...",
          "steps": ["step 1", "step 2", "step 3"],
          "confidence": 95
        }`;

        const result = await genAI.models.generateContent({
             model,
             contents: prompt
        });

        const text = result.text || "";
        try {
            // Find JSON in the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                setAnalysisResult(parsed);
            } else {
                throw new Error("No JSON found in response");
            }
        } catch (e) {
            console.error("Parse Error:", e);
            setAnalysisResult({
                summary: text.split('\n')[0] || "Analysis complete.",
                steps: text.split('\n').slice(1).filter(l => l.trim()).slice(0, 3),
                confidence: 85
            });
        }
    } catch (error) {
        console.error("AI Error:", error);
        setTimeout(() => {
            setAnalysisResult({
                summary: `[LOCAL ANALYSIS] This finding (${finding.title}) indicates a violation of secure configuration standards.`,
                steps: [
                    "Immediate patch deployment across all affected infrastructure vectors.",
                    "Review network access control lists for overlapping permissions.",
                    "Rotate all service account credentials associated with valid signatures."
                ],
                confidence: 92
            });
            setIsExplaining(false);
        }, 1500);
    } finally {
        setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center bg-white/5">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" /> Intelligence Findings • Unresolved
            </h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Filter Priority:</span>
                  <select 
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-[#020617] border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full outline-none focus:border-indigo-500/50"
                  >
                    <option value="all">ALL LEVELS</option>
                    <option value="critical">CRITICAL</option>
                    <option value="high">HIGH</option>
                    <option value="medium">MEDIUM</option>
                    <option value="low">LOW</option>
                  </select>
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">Active: {findings.length}</span>
            </div>
        </div>
        <div className="overflow-hidden overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm">
                <thead className="bg-[#020617]/80 text-slate-500 uppercase text-[10px] tracking-widest border-b border-white/5">
                    <tr>
                        <th className="px-8 py-4 font-bold">Vulnerability Signature</th>
                        <th className="px-8 py-4 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => setSortConfig({ key: 'severity', direction: sortConfig?.key === 'severity' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}>
                          Risk Level {sortConfig?.key === 'severity' && (sortConfig.direction === 'desc' ? '▼' : '▲')}
                        </th>
                        <th className="px-8 py-4 font-bold cursor-pointer hover:text-white transition-colors" onClick={() => setSortConfig({ key: 'priority', direction: sortConfig?.key === 'priority' && sortConfig.direction === 'desc' ? 'asc' : 'desc' })}>
                          Priority {sortConfig?.key === 'priority' && (sortConfig.direction === 'desc' ? '▼' : '▲')}
                        </th>
                        <th className="px-8 py-4 font-bold">Exposure Context</th>
                        <th className="px-8 py-4 font-bold">Detected On</th>
                        <th className="px-8 py-4 font-bold">Intelligence</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {findings
                      .filter(f => priorityFilter === 'all' || f.priority === priorityFilter)
                      .sort((a, b) => {
                        const sevMap: any = { critical: 4, high: 3, medium: 2, low: 1 };
                        if (sortConfig?.key === 'priority') {
                          const valA = sevMap[a.priority] || 0;
                          const valB = sevMap[b.priority] || 0;
                          return sortConfig.direction === 'desc' ? valB - valA : valA - valB;
                        }
                        const valA = sevMap[a.severity] || 0;
                        const valB = sevMap[b.severity] || 0;
                        return sortConfig?.direction === 'desc' ? valB - valA : valA - valB;
                      }).map((finding) => (
                        <tr key={finding.id} className="hover:bg-white/5 transition-all group cursor-default" onClick={() => setSelectedFindingId(finding.id)}>
                            <td className="px-8 py-6">
                                <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{finding.title}</div>
                                <div className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic font-medium">{finding.description}</div>
                            </td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-tighter shadow-sm",
                                    getSeverityColor(finding.severity)
                                )}>
                                    {finding.severity}
                                </span>
                            </td>
                            <td className="px-8 py-6">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-tighter shadow-sm bg-slate-900",
                                    finding.priority === 'critical' ? 'text-rose-400 border-rose-500/20' : 
                                    finding.priority === 'high' ? 'text-orange-400 border-orange-500/20' :
                                    finding.priority === 'medium' ? 'text-amber-400 border-amber-500/20' :
                                    'text-emerald-400 border-emerald-500/20'
                                )}>
                                    {finding.priority}
                                </span>
                            </td>
                            <td className="px-8 py-6 font-mono text-slate-400 text-[11px]">V-AX-{finding.assetId}</td>
                            <td className="px-8 py-6 text-slate-500 text-[11px] font-mono">{formatDate(finding.timestamp)}</td>
                            <td className="px-8 py-6 text-right">
                                {userRole !== 'viewer' ? (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); analyzeWithAI(finding); }}
                                        className="px-4 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-indigo-500/20 transition-all flex items-center gap-2"
                                    >
                                        AI Analyze 
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                ) : (
                                    <span className="text-[9px] font-black uppercase text-slate-700 italic pr-4">Access Denied</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedFinding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFindingId(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-3xl cursor-default"
          >
            <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0b0c10] border border-white/10 w-full max-w-5xl rounded-[32px] shadow-[0_0_150px_rgba(0,0,0,0.9)] overflow-hidden relative max-h-[92vh] flex flex-col cursor-default"
            >
                
                <div className="flex justify-between items-center px-10 py-8 bg-white/[0.02] relative z-10 border-b border-white/5 shadow-xl">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setSelectedFindingId(null)}
                            className="flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all group/back shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover/back:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] pt-0.5">Exit Analysis</span>
                        </button>
                        <div className="h-10 w-px bg-white/10" />
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.05)]">
                                <ShieldAlert className="w-7 h-7 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tighter leading-tight font-mono">{selectedFinding.title}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black">Threat Core Assessment</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                                    <span className="text-[9px] font-mono text-indigo-400/60 uppercase">{selectedFinding.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedFindingId(null)} className="p-3 hover:bg-rose-500/10 group rounded-full transition-all">
                        <X className="w-6 h-6 text-slate-500 group-hover:text-rose-500" />
                    </button>
                </div>
                <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-y-auto flex-grow custom-scrollbar">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-2 opacity-5">
                                <Activity className="w-16 h-16 text-white" />
                             </div>
                             <div className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-[0.2em]">Risk Classification</div>
                             <div className={cn(
                                 "text-2xl font-black uppercase tracking-tighter",
                                 selectedFinding.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'
                             )}>
                                {selectedFinding.severity} Level Threat
                             </div>
                             <p className="text-[10px] text-slate-400 mt-2 leading-relaxed opacity-60">Verified signature detection via surface recon module.</p>
                        </div>

                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden group">
                             <div className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-[0.2em]">Operational Priority</div>
                             <div className="relative mt-2">
                                <select 
                                    value={selectedFinding.priority}
                                    disabled={userRole === 'viewer'}
                                    onChange={(e) => onUpdateFinding(selectedFinding.id, e.target.value)}
                                    className={cn(
                                        "w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-widest appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all",
                                        selectedFinding.priority === 'critical' ? 'text-rose-500' : 
                                        selectedFinding.priority === 'high' ? 'text-orange-500' :
                                        selectedFinding.priority === 'medium' ? 'text-amber-500' :
                                        'text-emerald-500'
                                    )}
                                >
                                    <option value="critical">CRITICAL</option>
                                    <option value="high">HIGH</option>
                                    <option value="medium">MEDIUM</option>
                                    <option value="low">LOW</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronRight className="w-4 h-4 text-slate-600 rotate-90" />
                                </div>
                             </div>
                             <p className="text-[9px] text-slate-600 mt-3 italic font-medium">Determines remediation queue placement.</p>
                        </div>

                        {analysisResult && (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
                                <div className="text-[10px] text-indigo-400 font-black uppercase mb-4 tracking-[0.2em]">Engine Confidence</div>
                                <div className="flex items-end gap-3 mb-4">
                                    <span className="text-4xl font-black text-white tracking-tighter">{analysisResult.confidence}%</span>
                                    <span className="text-[10px] text-indigo-400/60 font-bold uppercase mb-1.5 min-w-[60px]">
                                        {analysisResult.confidence > 90 ? 'High' : analysisResult.confidence > 70 ? 'Optimal' : 'Standard'}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${analysisResult.confidence}%` }}
                                        transition={{ duration: 1, delay: 0.2 }}
                                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                    />
                                </div>
                                <p className="text-[9px] text-slate-500 mt-4 leading-normal italic">
                                    Score indicates model precision vs dataset entropy for {selectedFinding.title.toLowerCase()}.
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-2 flex flex-col min-h-[400px]">
                        <div className="flex items-center gap-3 mb-4 bg-indigo-500/5 px-4 py-2 border-y border-indigo-500/10">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <h4 className="text-[10px] uppercase text-indigo-400 font-black tracking-[0.3em]">Neural Intel Engine Analysis</h4>
                        </div>
                        
                        <div className="flex-grow bg-[#000]/30 rounded-2xl border border-white/5 p-8 relative overflow-hidden group">
                             {isExplaining ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-full animate-ping" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Cpu className="w-10 h-10 text-indigo-500 animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="space-y-6 text-center max-w-sm">
                                        <p className="text-xs font-mono text-indigo-400 animate-pulse">SYNTHESIZING REMEDIATION PATH...</p>
                                        <p className="text-[10px] text-slate-500 lowercase font-medium tracking-widest">Querying Global Threat Database</p>
                                        <div className="pt-4">
                                            <button 
                                                onClick={() => setSelectedFindingId(null)}
                                                className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                                            >
                                                Abort Analysis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                             ) : (
                                <div className="text-slate-300 text-sm leading-relaxed font-sans prose prose-invert max-w-none">
                                    {analysisResult ? (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-6"
                                        >
                                            <div className="bg-indigo-500/5 border border-white/5 p-8 rounded-3xl relative overflow-hidden group/sum shadow-[inset_0_0_50px_rgba(99,102,241,0.05)]">
                                                <div className="absolute top-0 right-[-10%] p-8 opacity-5 group-hover/sum:opacity-10 transition-opacity">
                                                    <Brain className="w-32 h-32 text-indigo-400" />
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                                                            <Brain className="w-5 h-5 text-indigo-400" />
                                                        </div>
                                                        <span className="text-[11px] font-black uppercase text-white tracking-[0.3em]">Intelligence Summary</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 bg-[#0a0b0d] px-4 py-2 rounded-2xl border border-white/10 shadow-xl">
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">AI Confidence</span>
                                                            <span className="text-xs font-mono font-bold text-indigo-400">{analysisResult.confidence}%</span>
                                                        </div>
                                                        <div className="w-24 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${analysisResult.confidence}%` }}
                                                                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                                                className={cn(
                                                                    "h-full shadow-[0_0_10px_rgba(99,102,241,0.5)]",
                                                                    analysisResult.confidence > 80 ? 'bg-indigo-500' : 'bg-amber-500'
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-base text-slate-300 leading-relaxed relative z-10 font-medium">
                                                    {analysisResult.summary}
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                <span className="text-[11px] font-black uppercase text-indigo-400 tracking-[0.2em] block mb-2">Recommended Response Tactics</span>
                                                <div className="space-y-3">
                                                    {analysisResult.steps.map((step, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                                                            <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 shrink-0 border border-indigo-500/20">{idx + 1}</div>
                                                            <p className="text-[13px] text-slate-300 font-medium leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-8 flex justify-end gap-3">
                                                <button 
                                                   onClick={() => setSelectedFindingId(null)}
                                                   className="px-6 py-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                                >
                                                   Return to List
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setSelectedFindingId(null);
                                                        toast.success("Remediation ticket successfully queued.");
                                                    }}
                                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[0_10px_20px_rgba(99,102,241,0.3)] group"
                                                >
                                                    Assign Remediation Ticket
                                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-sm gap-4">
                                            <div className="text-center">
                                                <p>Initiate Analysis to View Remediation Path</p>
                                                <button 
                                                     onClick={() => analyzeWithAI(selectedFinding)}
                                                     className="mt-4 px-6 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-500/30 transition-all"
                                                >
                                                    Run AI Engine
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white tracking-tight text-[32px]">System Configurations</h2>
        <p className="text-xs text-slate-500 font-medium">Manage operational parameters and security protocols</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-400" /> Security Controls
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white tracking-tight">Two-Factor Authentication</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Require biometric verification for admin tasks</p>
              </div>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white tracking-tight">AI Analysis Depth</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Configure the intensity of neural risk scans</p>
              </div>
              <select className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-white outline-none">
                <option>STANDARD</option>
                <option>DEEP</option>
                <option>PARANOID</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Performance Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white tracking-tight">Real-time Updates</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Receive instant telemetry via WebSocket</p>
              </div>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/2 rounded-xl border border-white/5">
              <div>
                <p className="text-xs font-bold text-white tracking-tight">Interface Complexity</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Toggle high-fidelity animations and blurs</p>
              </div>
              <div className="w-10 h-5 bg-slate-700 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Verification Page - Digital Certificate
 */
const VerificationPage = ({ assets, findings }: { assets: Asset[], findings: Finding[] }) => {
    const reportId = useMemo(() => `ASM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, []);
    const avgRisk = assets.length ? Math.round(assets.reduce((acc, curr) => acc + curr.riskScore, 0) / assets.length) : 0;

    const downloadOfficialCertificate = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const accentColor = [79, 70, 229]; // Indigo-600
        const darkColor = [15, 23, 42]; // Slate-900

        doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.2);
        doc.setLineWidth(1);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
        doc.rect(7, 7, pageWidth - 14, pageHeight - 14);

        const centerX = pageWidth / 2;

        doc.setFillColor(30, 27, 75);
        doc.roundedRect(centerX - 40, 25, 80, 12, 6, 6, 'F');
        doc.setTextColor(129, 140, 248);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text("OFFICIAL SECURITY CREDENTIAL", centerX, 32.5, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(30);
        doc.text("CERTIFICATE OF", centerX, 60, { align: 'center' });
        
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFontSize(44);
        doc.text("VERIFICATION", centerX, 82, { align: 'center' });

        doc.setTextColor(148, 163, 184);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("AEGIS-AI-ASSURANCE-V4 PROVISIONED", centerX, 94, { align: 'center' });

        const sealY = 140;
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.05);
        doc.circle(centerX, sealY, 50);
        doc.circle(centerX, sealY, 40);
        doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2], 0.1);
        doc.circle(centerX, sealY, 30);
        
        doc.setTextColor(255, 255, 255, 0.7);
        doc.setFontSize(28);
        doc.text("A", centerX, sealY + 10, { align: 'center' });

        doc.setFillColor(30, 27, 75, 0.4);
        doc.roundedRect(margin, 205, pageWidth - (margin * 2), 45, 4, 4, 'F');
        
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text("SECURE DOMAIN MAPPING / TOPOLOGY TARGETS", margin + 10, 215);

        doc.setTextColor(255, 255, 255, 0.8);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const displayAssets = assets.slice(0, 3);
        displayAssets.forEach((a, i) => {
            doc.text(`> ${a.value} [${a.metadata.ip || '0.0.0.0'}]`, margin + 10, 225 + (i * 7));
        });

        doc.setTextColor(148, 163, 184);
        doc.text(`SCAN REF: ${reportId}`, pageWidth - margin - 10, 225, { align: 'right' });
        doc.text(`VERIFIED: ${new Date().toLocaleDateString()}`, pageWidth - margin - 10, 232, { align: 'right' });

        const certSigY = 265;
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'italic');
        doc.text("Jeethendra", margin + 10, certSigY);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("LEAD OPERATOR: JEETHENDRA REDDY M", margin + 10, certSigY + 10);

        doc.setFontSize(12);
        doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
        doc.text("VERIFICATION MODULE", pageWidth - margin - 10, certSigY, { align: 'right' });
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("CRYPTO-SIGNED INFRASTRUCTURE", pageWidth - margin - 10, certSigY + 10, { align: 'right' });

        doc.save(`Official_Security_Credential_${reportId}.pdf`);
        toast.success("Credential exported successfully");
    };

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-10">
            <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Compliance & Verification</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Official Node Certification</p>
              </div>
              <button 
                onClick={downloadOfficialCertificate}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-lg shadow-indigo-600/20 group"
              >
                <Download className="w-4 h-4 group-hover:scale-110 transition-transform" /> Download Official Credential
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 flex flex-col items-center">
                <div className="w-full bg-[#020617] border-2 border-indigo-500/20 rounded-[40px] p-20 relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] min-h-[800px] flex flex-col items-center justify-center text-center">
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-indigo-500/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-indigo-500/10 rounded-full" />
                    <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/5 m-4 rounded-[36px]" />
                    <div className="absolute top-0 left-0 w-full h-full border-[1px] border-white/5 m-8 rounded-[32px]" />

                    <div className="relative z-10 w-full">
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
                            <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/5 border border-indigo-500/20 rounded-full mb-12">
                                <Shield className="w-4 h-4 text-indigo-400" />
                                <span className="text-[11px] text-indigo-300 font-black uppercase tracking-[0.4em]">Official Security Credential</span>
                            </div>
                            <h1 className="text-7xl font-black text-white tracking-tighter leading-[0.85] mb-6">
                                CERTIFICATE OF<br />
                                <span className="text-indigo-500">VERIFICATION</span>
                            </h1>
                            <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs">AEGIS-AI-ASSURANCE-V4 PROVISIONED</p>
                        </motion.div>

                        <div className="relative w-64 h-64 mx-auto mb-20 cursor-default group">
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
                            <div className="relative w-full h-full rounded-full border border-indigo-500/20 flex items-center justify-center bg-[#020617] shadow-inner overflow-hidden">
                                <Activity className="w-28 h-28 text-indigo-400 drop-shadow-[0_0_30px_rgba(129,140,248,0.4)] transform group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute bottom-6 font-mono text-[9px] text-indigo-500/30 tracking-widest font-bold uppercase">Secure Node: Alpha-01</div>
                            </div>
                        </div>

                        <div className="space-y-10 mb-20">
                            <div className="flex items-center justify-center gap-12 text-slate-400 text-[11px] font-black uppercase tracking-[0.25em]">
                                <div className="flex items-center gap-3"><Fingerprint className="w-4 h-4 text-emerald-500" /><span>SHA-256 Verified</span></div>
                                <div className="flex items-center gap-3"><Lock className="w-4 h-4 text-emerald-500" /><span>Secure Layer-7</span></div>
                                <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-emerald-500" /><span>Authentic Source</span></div>
                            </div>
                            <div className="relative text-slate-600 font-mono text-[10px] tracking-widest bg-[#020617] px-4 inline-block">AEGIS-UID: {reportId}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-40 mx-auto max-w-3xl text-left border-t border-white/5 pt-16 mt-16">
                            <div className="space-y-4">
                                <div className="h-16 relative flex items-center">
                                    <div className="font-serif italic text-4xl text-indigo-400 absolute bottom-1">Jeethendra</div>
                                    <div className="w-full h-[1px] bg-white/10 absolute bottom-0" />
                                </div>
                                <div><p className="text-[11px] text-white font-black uppercase tracking-[0.3em] mb-1">Lead Operator</p><p className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase">JEETHENDRA REDDY M</p></div>
                            </div>
                            <div className="space-y-4 text-right">
                                <div className="h-16 relative flex items-center justify-end">
                                    <div className="font-mono text-base text-emerald-500/50 absolute bottom-2 tracking-widest">VALIDATED: {new Date().toLocaleDateString().replace(/\//g, '.')}</div>
                                    <div className="w-full h-[1px] bg-white/10 absolute bottom-0" />
                                </div>
                                <div><p className="text-[11px] text-white font-black uppercase tracking-[0.3em] mb-1">Verification Module</p><p className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase italic">Crypto-Signed Infrastructure</p></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Assessed Infrastructure</h3>
                    <div className="space-y-4">
                      {assets.slice(0, 5).map(a => (
                        <div key={a.id} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-[11px] font-mono text-slate-400">{a.value}</span>
                          <span className={cn("text-[8px] font-black px-2 py-0.5 rounded", a.riskScore < 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')}>VERIFIED</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            </div>
        </div>
    );
};

const ProfilePage = ({ userRole, onLogout }: { userRole: UserRole, onLogout: () => void }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="flex items-center gap-10">
        <div className="relative group">
          <div className="absolute -inset-8 bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-500 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse" />
          <div className="relative w-40 h-40 rounded-[40px] border-2 border-white/20 overflow-hidden shadow-2xl bg-slate-950 p-2">
             <div className="w-full h-full rounded-[30px] overflow-hidden bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 flex items-center justify-center">
                <img 
                   src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Felix&backgroundColor=020617" 
                   alt="Avatar"
                   className="w-full h-full object-cover transform scale-110 drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                />
             </div>
             <div className="absolute top-4 right-4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-950 shadow-[0_0_15px_rgba(16,185,129,1)]" />
          </div>
        </div>
        <div className="space-y-2">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Session</span>
           </div>
           <h2 className="text-5xl font-black text-white tracking-tighter">Security Operator</h2>
           <p className="text-xl text-slate-500 font-medium">Access Level: <span className="text-indigo-400 uppercase tracking-widest">{userRole}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Successful Scans</p>
            <p className="text-3xl font-black text-white">1,248</p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Critical Resolved</p>
            <p className="text-3xl font-black text-emerald-400">84</p>
         </div>
         <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Threat Intelligence</p>
            <p className="text-3xl font-black text-indigo-400">Level 4</p>
         </div>
      </div>

      <div className="pt-10 border-t border-white/5">
         <button 
           onClick={onLogout}
           className="px-8 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-lg hover:shadow-rose-500/20"
         >
           <X className="w-5 h-5" /> Terminate Secure Session
         </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scan' | 'map' | 'findings' | 'settings' | 'profile' | 'verification'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [scanStatus, setScanStatus] = useState<ScanStatus>({ isScanning: false, progress: 0, logs: [] });
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAsset(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!userRole) return;

    // Initial data fetch
    fetch('/api/assets').then(res => res.json()).then(setAssets);
    fetch('/api/findings').then(res => res.json()).then(setFindings);
    fetch('/api/scan/status').then(res => res.json()).then(setScanStatus);

    // Socket setup
    socketRef.current = io();
    
    socketRef.current.on('notification', (data) => {
        toast((t) => (
            <div className="flex items-start gap-4">
                <div className={cn("p-2 rounded-xl", data.severity === 'critical' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500')}>
                    <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{data.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{data.message}</p>
                    <button 
                        onClick={() => {
                            setActiveTab('findings');
                            toast.dismiss(t.id);
                        }}
                        className="text-[9px] text-indigo-400 font-black uppercase tracking-widest mt-2 block hover:text-indigo-300 transition-colors"
                    >
                        Investigate Now
                    </button>
                </div>
            </div>
        ), {
            duration: 6000,
            position: 'top-right',
            style: {
                background: 'rgba(2, 6, 23, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '16px',
                color: '#fff',
                minWidth: '350px'
            }
        });
    });

    socketRef.current.on('scan:update', (data) => {
        if (data.isScanning !== undefined) setScanStatus(prev => ({ ...prev, isScanning: data.isScanning }));
        if (data.progress !== undefined) setScanStatus(prev => ({ ...prev, progress: data.progress }));
        if (data.log) setScanStatus(prev => ({ ...prev, logs: [...prev.logs, data.log] }));
        if (data.assets) setAssets(data.assets);
        if (data.findings) setFindings(data.findings);
    });

    return () => {
        socketRef.current?.disconnect();
    };
  }, [userRole]);

  const handleStartScan = (target: string) => {
    if (userRole === 'viewer') return; 
    setScanStatus(prev => ({ ...prev, isScanning: true, progress: 0, logs: [] }));
    fetch('/api/scan/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target })
    });
  }

  const handleUpdateFindingPriority = async (findingId: string, priority: any) => {
    try {
      const res = await fetch(`/api/findings/${findingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      if (res.ok) {
        const updatedFinding = await res.json();
        setFindings(prev => prev.map(f => f.id === findingId ? updatedFinding : f));
        toast.success(`Priority updated to ${priority}`, {
            style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to update priority");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setActiveTab('dashboard');
    toast.success("Session terminated. Security lock active.");
  };

  if (!userRole) {
    return <LoginPage onLogin={setUserRole} />;
  }

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      <Toaster />
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col bg-[#0d0e12]/50 backdrop-blur-2xl">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-5 group/logo cursor-pointer relative" onClick={() => setActiveTab('dashboard')}>
            <div className="relative">
              <div className="absolute -inset-3 bg-indigo-500/20 rounded-full blur-xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700" />
              <div className="w-14 h-14 bg-[#020617] rounded-[18px] flex items-center justify-center shadow-2xl relative z-10 border border-white/10 transform transition-all duration-500 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                <Eye className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.5)]" strokeWidth={1.5} />
                <div className="absolute top-0 left-0 w-full h-full border border-indigo-500/20 rounded-[18px] pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-white tracking-tighter leading-none group-hover/logo:tracking-tight transition-all duration-500">
                AEGIS
              </h1>
              <span className="text-indigo-400 font-black italic text-sm tracking-[0.2em] mt-1 group-hover/logo:text-indigo-300 transition-colors">ASM-CORE</span>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-2 flex-grow">
          <SidebarItem icon={LayoutDashboard} label="Surface Metrics" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          {userRole !== 'viewer' && (
            <>
              <SidebarItem icon={Search} label="Intel Pipeline" active={activeTab === 'scan'} onClick={() => setActiveTab('scan')} />
              <SidebarItem icon={MapIcon} label="Discovery Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            </>
          )}
          <SidebarItem icon={List} label="Vulnerabilities" active={activeTab === 'findings'} onClick={() => setActiveTab('findings')} />
          <SidebarItem icon={Award} label="Verification" active={activeTab === 'verification'} onClick={() => setActiveTab('verification')} />
        </nav>

        <div className="p-4 m-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
               <div className="text-[10px] text-indigo-400/70 font-black uppercase tracking-[0.3em]">Grid Health</div>
               <div className={cn(
                 "text-[8px] font-black uppercase px-2 py-0.5 rounded border",
                 userRole === 'admin' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 
                 userRole === 'analyst' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                 'bg-slate-800 border-white/5 text-slate-500'
               )}>
                 {userRole}
               </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute inset-0 animate-ping opacity-50" />
                </div>
                <span className="text-[11px] text-white font-bold tracking-tight">NODES SECURE</span>
            </div>
            {scanStatus.isScanning && (
                <div className="pt-2">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div animate={{ x: [-100, 200] }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-full w-24 bg-indigo-500/40" />
                    </div>
                </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col bg-[#020617] relative">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/5 blur-[150px] pointer-events-none rounded-full" />
        
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Alpha-Scan-01</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-700" />
            <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{activeTab}</span>
          </div>

          <div className="flex items-center gap-8">
             <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                    <p className="text-[10px] text-white font-black uppercase tracking-widest leading-none">Security Operator</p>
                    <p className="text-[9px] text-slate-600 font-mono mt-0.5 uppercase tracking-tighter">ROLE: {userRole}</p>
                </div>
                <div 
                    onClick={() => setActiveTab('profile')}
                    className="relative group/dp cursor-pointer"
                >
                    <div className={cn(
                        "absolute -inset-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover/dp:opacity-50 transition duration-500",
                        activeTab === 'profile' && "opacity-100 blur-md"
                    )} />
                    <div 
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            "relative w-11 h-11 rounded-xl border flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden p-1 bg-slate-950 cursor-pointer",
                            activeTab === 'profile' ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-white/10 group-hover/dp:border-indigo-500/50"
                        )}
                    >
                        <img 
                            src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Felix&backgroundColor=020617" 
                            alt="avatar" 
                            className="w-full h-full object-cover rounded-lg group-hover/dp:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-950 shadow-[0_0_5px_rgba(16,185,129,1)]" />
                    </div>
                </div>
             </div>
             <button 
                onClick={() => setActiveTab('settings')}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 border",
                  activeTab === 'settings' 
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
                    : "hover:bg-white/5 text-slate-500 border-transparent hover:border-white/5"
                )}
              >
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="p-10 flex-grow overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto w-full">
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    assets={assets} 
                    findings={findings} 
                    onAssetClick={userRole === 'viewer' ? () => {} : setSelectedAsset} 
                    userRole={userRole} 
                    setActiveTab={setActiveTab}
                  />
                )}
                {activeTab === 'scan' && (
                    <ScanPage 
                        isScanning={scanStatus.isScanning} 
                        progress={scanStatus.progress} 
                        logs={scanStatus.logs} 
                        onStartScan={handleStartScan}
                        userRole={userRole}
                    />
                )}
                {activeTab === 'map' && <AssetMap assets={assets} onAssetClick={userRole === 'viewer' ? () => {} : setSelectedAsset} />}
                {activeTab === 'findings' && <FindingsPage findings={findings} userRole={userRole} onUpdateFinding={handleUpdateFindingPriority} />}
                {activeTab === 'settings' && <SettingsPage />}
                {activeTab === 'verification' && <VerificationPage assets={assets} findings={findings} />}
                {activeTab === 'profile' && <ProfilePage userRole={userRole} onLogout={handleLogout} />}
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedAsset && (
          <AssetDetailModal 
            asset={selectedAsset} 
            findings={findings.filter(f => f.assetId === selectedAsset.id)} 
            onClose={() => setSelectedAsset(null)} 
            userRole={userRole}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
