import React, { useState, useEffect, useCallback } from 'react';
import {
  Terminal, ShieldAlert, Activity, GitMerge, Database,
  Lock, Zap, LayoutGrid, Server, Command,
  ChevronRight, ChevronLeft, CheckCircle2,
  AlertTriangle, Layers, Sparkles, Loader2, X
} from 'lucide-react';

// ─── THEME ────────────────────────────────────────────────────────────────────
const t = {
  bg: 'bg-[#050505]',
  surface: 'bg-[#0D0D11]',
  surfaceHi: 'bg-[#15151A]',
  border: 'border-[#1A1A24]',
  borderHi: 'border-[#2A2A35]',
  accent: 'text-[#00E5FF]',
  accentBg: 'bg-[#00E5FF]/10',
  accentBorder: 'border-[#00E5FF]/30',
  muted: 'text-slate-500',
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const threatEvents = [
  { time: '14:22:01', ip: '192.168.1.104', type: 'AUTH_BYPASS',    threat: 'HIGH',     status: 'BLOCKED'       },
  { time: '14:21:45', ip: '10.0.0.5',      type: 'PORT_SCAN',      threat: 'LOW',      status: 'LOGGED'        },
  { time: '14:20:12', ip: '172.16.0.2',    type: 'DATA_EXFIL',     threat: 'CRITICAL', status: 'INVESTIGATING' },
  { time: '14:19:59', ip: '192.168.1.200', type: 'MALFORMED_REQ',  threat: 'MEDIUM',   status: 'DROPPED'       },
];

const workflows = [
  { name: 'Client Onboarding',   type: 'ASSIST', status: 'ACTIVE', runs: 142 },
  { name: 'Invoice Processing',  type: 'AUTO',   status: 'DRAFT',  runs: 0   },
  { name: 'Threat Triage',       type: 'HUMAN',  status: 'ACTIVE', runs: 89  },
  { name: 'Vendor Provisioning', type: 'AUTO',   status: 'ACTIVE', runs: 412 },
];

// ─── AI INTEGRATION ────────────────────────────────────────────────────────────
// Set VITE_GEMINI_API_KEY in your .env file (Vercel env vars in production)
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';

const aiAvailable = GEMINI_KEY.length > 0;

const generateAIContent = async (prompt, systemInstruction) => {
  if (!aiAvailable) {
    // Deterministic mock responses for demo mode
    await new Promise(r => setTimeout(r, 900));
    return [
      '1. VECTOR — Lateral movement via stolen credential reuse across internal VPN endpoints.',
      '2. RADIUS — Adjacent subnets exposed: estimated 14 hosts, 3 critical services.',
      '3. DIRECTIVE — Isolate source IP immediately. Revoke session tokens. Escalate to Tier-2 for forensic capture.',
    ].join('\n\n');
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
  };
  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'NO_SIGNAL_RECEIVED';
    } catch (e) {
      if (i === 4) return 'SYS_ERR: UPLINK_FAILURE — Check VITE_GEMINI_API_KEY in environment variables.';
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
};

// ─── SHARED PRIMITIVES ─────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex justify-between items-end mb-6">
    <div>
      <h2 className="text-3xl font-light text-white flex items-center gap-3">
        {Icon && <Icon className={t.accent} />} {title}
      </h2>
      {subtitle && <p className={`text-sm font-mono ${t.muted} tracking-widest uppercase mt-1`}>{subtitle}</p>}
    </div>
    {!aiAvailable && (
      <span className={`text-[10px] font-mono px-2 py-1 rounded border ${t.borderHi} ${t.muted}`}>
        DEMO MODE — add VITE_GEMINI_API_KEY for live AI
      </span>
    )}
  </div>
);

// ─── SLIDES ───────────────────────────────────────────────────────────────────

const HeroSlide = () => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in">
    <div className="relative">
      <div className="absolute inset-0 bg-[#00E5FF] blur-[100px] opacity-10 rounded-full" />
      <Command size={64} className={`${t.accent} relative z-10`} strokeWidth={1} />
    </div>
    <div className="space-y-4 relative z-10">
      <h1 className="text-6xl md:text-8xl font-light tracking-tighter text-white">AIMAR</h1>
      <p className={`text-xl md:text-2xl font-mono tracking-widest ${t.accent}`}>COMMAND DECK</p>
    </div>
    <div className={`pt-8 flex flex-wrap justify-center gap-4 ${t.muted} text-sm font-mono uppercase tracking-wider max-w-2xl`}>
      {['Memory', 'Workflows', 'Visibility', 'Governance', 'Research', 'Execution'].map((s, i, arr) => (
        <React.Fragment key={s}>
          <span>{s}</span>
          {i < arr.length - 1 && <span className={t.accent}>•</span>}
        </React.Fragment>
      ))}
    </div>
    <div className={`mt-12 p-4 border ${t.border} ${t.surface} rounded backdrop-blur-sm`}>
      <p className="text-xs uppercase tracking-widest text-slate-400">Operational Intelligence Infrastructure</p>
    </div>
  </div>
);

const DirectionSlide = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center animate-fade-in">
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">The Direction</h2>
        <div className={`w-12 h-1 ${t.accentBg} mb-6 border-b ${t.accentBorder}`} />
      </div>
      <p className="text-xl text-slate-300 leading-relaxed font-light">
        AIMAR started as AI automation work. The stronger pattern became clear:{' '}
        <span className="text-white font-medium">we are building coherent systems around intelligent work.</span>
      </p>
      <ul className="space-y-4 font-mono text-sm">
        {['Workflows', 'Memory Systems', 'Operational Visibility', 'Signal Routing', 'Governance', 'Execution Infrastructure'].map((item, i) => (
          <li key={i} className="flex items-center space-x-3">
            <ChevronRight size={14} className={t.accent} />
            <span className="text-slate-400">{item}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className={`h-full min-h-[400px] border ${t.border} ${t.surface} rounded-lg p-8 relative overflow-hidden flex flex-col justify-center`}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #333 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <div className="relative z-10 flex flex-col space-y-6">
        <div className={`p-4 border ${t.borderHi} rounded flex items-center justify-between`}>
          <span className={`font-mono text-xs ${t.muted}`}>INPUT SIGNAL</span>
          <Activity size={16} className={t.accent} />
        </div>
        <div className="flex justify-center"><ChevronRight size={20} className="text-slate-700 rotate-90" /></div>
        <div className="p-6 border border-[#00E5FF]/20 bg-[#00E5FF]/5 rounded text-center">
          <span className={`font-mono text-sm ${t.accent} uppercase tracking-widest`}>Coherent Execution Engine</span>
        </div>
        <div className="flex justify-center"><ChevronRight size={20} className="text-slate-700 rotate-90" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 border ${t.borderHi} rounded text-center text-xs font-mono ${t.muted}`}>AUTOMATION</div>
          <div className={`p-3 border ${t.borderHi} rounded text-center text-xs font-mono ${t.muted}`}>GOVERNANCE</div>
        </div>
      </div>
    </div>
  </div>
);

const SignalFlowSlide = () => {
  const steps = ['Ingest', 'Normalize', 'Classify', 'Score', 'Route', 'Surface', 'Decide', 'Audit'];
  return (
    <div className="flex flex-col h-full animate-fade-in space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-light text-white">Signal Architecture</h2>
        <p className="text-lg text-slate-400">
          AIMAR treats work as signal flow. This architecture applies uniformly across workflows, operations,
          security, dashboards, research, and execution environments.
        </p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full">
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div className={`px-4 py-3 border ${t.borderHi} ${t.surface} rounded-md text-center min-w-[100px] flex flex-col items-center justify-center gap-2 group hover:border-[#00E5FF]/50 transition-colors`}>
                <span className={`text-xs font-mono ${t.muted} group-hover:text-[#00E5FF] transition-colors`}>{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm font-medium text-slate-200">{step}</span>
              </div>
              {i < steps.length - 1 && <div className="flex items-center text-slate-700"><ChevronRight size={20} /></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
        {[
          { Icon: Database,   label: 'Memory',    hi: false },
          { Icon: GitMerge,   label: 'Workflows',  hi: true  },
          { Icon: LayoutGrid, label: 'Dashboards', hi: false },
        ].map(({ Icon, label, hi }) => (
          <div key={label} className={`p-4 border ${hi ? 'border-[#00E5FF]/20 bg-[#00E5FF]/5' : t.border} rounded text-center`}>
            <Icon className={`mx-auto mb-3 ${hi ? t.accent : 'text-slate-500'}`} size={24} />
            <h4 className={`text-sm font-medium ${hi ? t.accent : 'text-white'}`}>{label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

const ODSMSlide = () => {
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeThreat = async (threat) => {
    setSelectedThreat(threat);
    setIsAnalyzing(true);
    setAnalysis('');
    const prompt = `Analyze this network event. IP: ${threat.ip}, Type: ${threat.type}, Threat Level: ${threat.threat}, Current Status: ${threat.status}.`;
    const sys = 'You are AIMAR ODSM (Operational Threat Intelligence Engine). Provide a stark, highly technical, 3-point briefing: 1. VECTOR (likely attack method), 2. RADIUS (potential blast radius/systems affected), 3. DIRECTIVE (recommended operator action). Keep it extremely concise, modular, and use a commanding operational tone. No pleasantries.';
    const result = await generateAIContent(prompt, sys);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const threatColor = (level) => {
    if (level === 'CRITICAL') return 'bg-red-500/20 text-red-400';
    if (level === 'HIGH')     return 'bg-orange-500/20 text-orange-400';
    if (level === 'MEDIUM')   return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-slate-800 text-slate-400';
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6">
      <div className="flex justify-between items-end">
        <SectionHeader icon={ShieldAlert} title="ODSM" subtitle="Operational Threat Intelligence" />
        <div className="text-xs font-mono flex items-center gap-2 text-green-400 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          SYSTEM LIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
        {selectedThreat ? (
          <div className={`col-span-1 border ${t.border} bg-[#0A0A0C] rounded p-6 flex flex-col space-y-4 shadow-xl shadow-[#00E5FF]/5 animate-fade-in relative`}>
            <button onClick={() => setSelectedThreat(null)} className={`absolute top-4 right-4 ${t.muted} hover:text-white`}><X size={16} /></button>
            <div className={`flex items-center gap-2 ${t.accent} font-mono text-sm uppercase mb-2`}>
              <Sparkles size={16} /> Signal Intelligence
            </div>
            <div className={`font-mono text-xs text-slate-400 border-b border-slate-800 pb-2 mb-2`}>
              TARGET: {selectedThreat.ip}<br />TYPE: {selectedThreat.type}
            </div>
            <div className="flex-grow overflow-y-auto text-sm text-slate-300 font-mono leading-relaxed space-y-4 whitespace-pre-wrap">
              {isAnalyzing
                ? <div className={`flex items-center gap-3 ${t.muted} mt-4`}><Loader2 size={16} className={`animate-spin ${t.accent}`} />CLASSIFYING VECTOR...</div>
                : analysis}
            </div>
          </div>
        ) : (
          <div className={`col-span-1 border ${t.border} ${t.surface} rounded p-6 flex flex-col space-y-6`}>
            <div className="space-y-2">
              <h3 className="text-white text-lg font-medium">Core Capabilities</h3>
              <p className="text-sm text-slate-400 leading-relaxed">AI-assisted threat classification with human-in-the-loop oversight.</p>
            </div>
            <div className="space-y-4 flex-grow">
              {['Signal Ingestion', 'Event Analysis', 'Threat Classification', 'Operational Visibility'].map((item) => (
                <div key={item} className={`p-3 border ${t.borderHi} bg-black/50 rounded flex items-center gap-3`}>
                  <CheckCircle2 size={16} className={t.accent} />
                  <span className="text-sm text-slate-300 font-mono">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`col-span-2 border ${t.border} bg-black rounded p-6 flex flex-col font-mono relative overflow-hidden`}>
          <div className={`flex justify-between items-center border-b border-slate-800 pb-4 mb-4`}>
            <span className={`text-xs ${t.muted}`}>EVENT_LOG // ZERO LATENCY</span>
            <span className={`text-xs ${t.accent}`}>AI_POWERED</span>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { val: '1,204', label: 'TOTAL EVENTS',  cls: 'text-white',    bdr: 'border-slate-800',          bg: '' },
              { val: '3',     label: 'HIGH THREAT',   cls: 'text-red-500',  bdr: 'border-red-900/30',         bg: 'bg-red-900/10' },
              { val: '12',    label: 'MEDIUM THREAT', cls: 'text-yellow-500',bdr:'border-yellow-900/30',      bg: 'bg-yellow-900/10' },
              { val: '1,189', label: 'LOW / SAFE',    cls: 'text-green-500',bdr: 'border-green-900/30',       bg: 'bg-green-900/10' },
            ].map(({ val, label, cls, bdr, bg }) => (
              <div key={label} className={`border ${bdr} ${bg} p-4 rounded text-center`}>
                <div className={`text-2xl ${cls} mb-1`}>{val}</div>
                <div className={`text-[10px] ${t.muted}`}>{label}</div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`${t.muted} border-b border-slate-800`}>
                  {['TIMESTAMP', 'IP ADDRESS', 'EVENT TYPE', 'THREAT', ''].map((h) => (
                    <th key={h} className="pb-2 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-slate-400">
                {threatEvents.map((e, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900 transition-colors">
                    <td className="py-3">{e.time}</td>
                    <td className="py-3">{e.ip}</td>
                    <td className="py-3 text-slate-300">{e.type}</td>
                    <td className="py-3"><span className={`px-2 py-1 rounded text-[10px] ${threatColor(e.threat)}`}>{e.threat}</span></td>
                    <td className="py-3 text-right">
                      <button onClick={() => analyzeThreat(e)} className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border ${t.accentBorder} ${t.accent} hover:${t.accentBg} transition-colors`}>
                        <Sparkles size={12} /> ANALYZE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const OpsSlide = () => {
  const [showModal, setShowModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [draft, setDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const handleDraft = async () => {
    if (!prompt) return;
    setIsDrafting(true);
    setDraft('');
    const sys = 'You are the AIMAR Workflow Classification Engine. Synthesize a workflow blueprint for the given request. Return a clean, stark, text-based blueprint outlining: 1. INGEST (trigger), 2. ROUTE (steps), 3. CLASSIFICATION (must assign as AUTO, ASSIST, or HUMAN), 4. GOVERNANCE (OPSEC/compliance checks required). Format with clear headings and concise bullet points. No conversational filler.';
    const result = await generateAIContent(prompt, sys);
    setDraft(result);
    setIsDrafting(false);
  };

  const typeColor = (type) =>
    type === 'AUTO' ? 'text-cyan-400' : type === 'HUMAN' ? 'text-orange-400' : 'text-purple-400';

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6 relative">
      {showModal && (
        <div className="absolute inset-0 z-50 bg-[#050505]/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
          <div className={`w-full max-w-2xl border ${t.borderHi} bg-[#0A0A0C] rounded-lg p-6 flex flex-col space-y-4 shadow-2xl shadow-[#00E5FF]/5`}>
            <div className={`flex justify-between items-center border-b border-slate-800 pb-4`}>
              <div className={`font-mono text-sm ${t.accent} flex items-center gap-2`}><Sparkles size={16} /> WORKFLOW_SYNTHESIS_ENGINE</div>
              <button onClick={() => setShowModal(false)} className={`${t.muted} hover:text-white`}><X size={18} /></button>
            </div>
            <p className={`text-xs ${t.muted} font-mono`}>Input operational intent. AIMAR Intelligence will draft the workflow architecture.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDraft()}
                placeholder="e.g. Employee Offboarding Protocol..."
                className={`flex-grow bg-[#121216] border ${t.borderHi} rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#00E5FF]/50`}
              />
              <button
                onClick={handleDraft}
                disabled={isDrafting || !prompt}
                className={`px-4 py-2 ${t.accentBg} ${t.accent} border ${t.accentBorder} rounded text-xs font-mono hover:bg-[#00E5FF]/20 transition-colors disabled:opacity-50 flex items-center gap-2`}
              >
                {isDrafting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                GENERATE
              </button>
            </div>
            {(draft || isDrafting) && (
              <div className="mt-4 p-4 border border-slate-800 bg-[#050505] rounded min-h-[150px] max-h-[300px] overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {isDrafting ? <div className="animate-pulse text-slate-500">Processing signal... structuring logic gates...</div> : draft}
              </div>
            )}
          </div>
        </div>
      )}

      <SectionHeader icon={GitMerge} title="AIMAR Ops" subtitle="Workflow Intelligence" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="flex flex-col justify-center space-y-6">
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            AIMAR treats workflows as <span className="text-white">operational signal systems.</span>
          </p>
          <ul className="space-y-4 font-mono text-sm border-l border-slate-800 pl-4">
            {[
              { title: 'Workflow Registry',      desc: 'Centralized mapping of repeatable processes.' },
              { title: 'Classification Engine',  desc: 'Human / Assist / Auto assignment logic.'      },
              { title: 'Command Surfaces',       desc: 'Interfaces for operators to execute and monitor.' },
              { title: 'Execution Visibility',   desc: 'Audit trails and performance metrics.'          },
            ].map(({ title, desc }) => (
              <li key={title} className="flex flex-col gap-1">
                <span className="text-white">{title}</span>
                <span className={`${t.muted} text-xs`}>{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`border ${t.border} bg-[#0A0A0C] rounded-lg p-6 flex flex-col space-y-4`}>
          <div className={`flex items-center justify-between border-b border-slate-800 pb-4`}>
            <div className="font-mono text-sm text-slate-400">WORKFLOW_REGISTRY</div>
            <button onClick={() => setShowModal(true)} className={`text-xs px-3 py-1 rounded ${t.accentBg} ${t.accent} border ${t.accentBorder} flex items-center gap-2 hover:bg-[#00E5FF]/20 transition-colors`}>
              <Sparkles size={12} /> NEW
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
            {workflows.map((wf, i) => (
              <div key={i} className={`p-4 border ${t.borderHi} rounded bg-[#121216] hover:border-slate-600 transition-colors cursor-pointer flex justify-between items-center`}>
                <div>
                  <div className="text-white text-sm font-medium mb-1">{wf.name}</div>
                  <div className="flex gap-2 text-[10px] font-mono">
                    <span className={typeColor(wf.type)}>{wf.type}</span>
                    <span className="text-slate-600">|</span>
                    <span className={t.muted}>{wf.runs} RUNS</span>
                  </div>
                </div>
                <div className={`px-2 py-1 text-[10px] font-mono rounded-full border ${wf.status === 'ACTIVE' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-slate-700 text-slate-500'}`}>
                  {wf.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchitectureSlide = () => {
  const layers = [
    { num: 1, title: 'Brand + Strategy',      desc: 'AIMAR umbrella / flagship'                           },
    { num: 2, title: 'Workspace + Config',    desc: 'Core • Build Lab • Templates'                        },
    { num: 3, title: 'Memory + Knowledge',    desc: 'Instructions • Context • Open Threads'               },
    { num: 4, title: 'Access Layer',          desc: 'Files • Connectors • SaaS • APIs (Read-only first)'  },
    { num: 5, title: 'Execution Layer',       desc: 'Skills • Subagents • Workers • Functions'            },
    { num: 6, title: 'Operator Surfaces',     desc: 'Personal OS • Founder Brief • Ops Inbox'            },
    { num: 7, title: 'Governance + Eval',     desc: 'Validation • Logs • Backups • Accuracy'              },
  ];
  const canon = [
    { title: 'Godfile',            desc: 'Doctrine / Non-negotiables'   },
    { title: 'Research Dossier',   desc: 'Systems synthesis'            },
    { title: 'Configuration Pack', desc: 'Skills, memory, artifacts'    },
  ];
  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6">
      <SectionHeader icon={Layers} title="Layered Architecture" subtitle="AIMAR Mainframe Topology" />
      <div className="flex flex-col md:flex-row gap-8 flex-grow overflow-hidden">
        <div className="w-full md:w-64 flex flex-col gap-4 flex-shrink-0">
          <div className={`text-xs font-mono ${t.muted} uppercase tracking-widest border-b border-slate-800 pb-2`}>Canon / Source of Truth</div>
          {canon.map(({ title, desc }) => (
            <div key={title} className={`p-4 border ${t.border} rounded bg-[#121216] space-y-2`}>
              <div className="text-sm font-medium text-white">{title}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>
        <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-4">
          <div className={`text-xs font-mono ${t.accent} uppercase tracking-widest border-b border-[#00E5FF]/20 pb-2 mb-2 flex items-center gap-2`}>
            <Server size={14} /> AIMAR Mainframe / Working System
          </div>
          {layers.map((layer) => (
            <div key={layer.num} className={`p-3 border ${t.borderHi} bg-[#0A0A0C] rounded flex items-center gap-4 group hover:border-slate-500 transition-colors`}>
              <div className={`w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center font-mono text-xs text-slate-400 group-hover:text-white group-hover:border-[#00E5FF] transition-colors`}>
                {layer.num}
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200">{layer.title}</div>
                <div className={`text-xs ${t.muted}`}>{layer.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GovernanceSlide = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center animate-fade-in">
    <div className="border border-red-900/30 bg-red-950/10 rounded-lg p-8 relative overflow-hidden h-full flex flex-col justify-center font-mono">
      <Lock className="text-red-500 opacity-20 absolute top-[-20%] right-[-10%] w-96 h-96" />
      <div className="relative z-10 space-y-6">
        <div className="text-red-400 text-sm tracking-widest uppercase mb-8 flex items-center gap-2">
          <AlertTriangle size={16} /> Restricted Access Protocol
        </div>
        <div className="space-y-4 text-xs text-slate-300">
          {[
            ['PERMISSION_STAGING',    'ACTIVE'    ],
            ['AUDIT_TRAILS',          'IMMUTABLE' ],
            ['HUMAN_APPROVAL_GATES',  'REQUIRED'  ],
            ['BLAST_RADIUS_CONTROL',  'MODULAR'   ],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-red-900/30 pb-2">
              <span>{k}</span><span className="text-green-400">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Security & OPSEC</h2>
        <div className="w-12 h-1 bg-red-500/20 mb-6 border-b border-red-500/50" />
      </div>
      <p className="text-xl text-slate-300 leading-relaxed font-light">
        Automation should increase clarity, not invisible risk. AIMAR systems are designed around governance-first automation.
      </p>
      <div className={`p-6 border ${t.border} rounded bg-[#121216]`}>
        <h4 className="text-white text-sm font-medium mb-3">Core OPSEC Principles</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li>• Source awareness in all generated actions.</li>
          <li>• Read-only access before write-back authorization.</li>
          <li>• Extensive operational logging for accountability.</li>
          <li>• Security-aware architecture by default.</li>
        </ul>
      </div>
    </div>
  </div>
);

const PrinciplesSlide = () => (
  <div className="flex flex-col h-full animate-fade-in space-y-8">
    <div className="text-center max-w-2xl mx-auto space-y-4">
      <h2 className="text-3xl font-light text-white">What AIMAR Protects</h2>
      <p className="text-slate-400">Core fundamentals that do not change.</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow content-center">
      {['Systems over Hype', 'Workflow before Tool', 'Governance before Scale', 'Operational Clarity',
        'Modular Architecture', 'OPSEC & Compliance', 'Proof before Expansion', 'Human Judgment Central'].map((p) => (
        <div key={p} className={`p-6 border ${t.borderHi} bg-[#0A0A0C] rounded-lg text-center flex items-center justify-center hover:border-slate-400 transition-all hover:bg-[#121216]`}>
          <span className="text-sm font-medium text-slate-200">{p}</span>
        </div>
      ))}
    </div>
    <div className="mt-auto pt-8 border-t border-slate-800 text-center">
      <p className={`text-xs font-mono ${t.accent} tracking-widest uppercase`}>Path: Services → Products → Infrastructure</p>
    </div>
  </div>
);

const FinalSlide = () => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-12 animate-fade-in">
    <Command size={48} className="text-slate-700" strokeWidth={1} />
    <div className="max-w-3xl space-y-8">
      <h2 className="text-4xl md:text-5xl font-light text-white leading-tight">
        AIMAR builds operational<br />
        <span className={t.accent}>intelligence infrastructure.</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm font-mono text-slate-400 text-left w-fit mx-auto">
        {['Memory Systems', 'Workflow Engines', 'Dashboards', 'Research Artifacts', 'Governed Automations', 'Execution Systems'].map((item) => (
          <span key={item} className="flex items-center gap-2">
            <div className="w-1 h-1 bg-cyan-500 rounded-full" /> {item}
          </span>
        ))}
      </div>
      <p className="text-xl text-slate-300 pt-8 border-t border-slate-800">
        For people and teams that need <span className="text-white font-medium">cleaner execution.</span>
      </p>
    </div>
  </div>
);

// ─── MAIN APPLICATION ──────────────────────────────────────────────────────────
const slides = [
  { id: 'hero',         name: 'Initialization',     component: HeroSlide       },
  { id: 'direction',    name: 'The Direction',       component: DirectionSlide  },
  { id: 'flow',         name: 'Signal Architecture', component: SignalFlowSlide },
  { id: 'odsm',         name: 'Threat Intel (ODSM)', component: ODSMSlide       },
  { id: 'ops',          name: 'Workflow (Ops)',       component: OpsSlide        },
  { id: 'architecture', name: 'System Topology',     component: ArchitectureSlide },
  { id: 'governance',   name: 'OPSEC & Security',    component: GovernanceSlide },
  { id: 'principles',   name: 'Core Tenets',         component: PrinciplesSlide },
  { id: 'final',        name: 'Positioning',         component: FinalSlide      },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1)), []);
  const prevSlide = useCallback(() => setCurrentSlide(prev => Math.max(prev - 1, 0)), []);

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [nextSlide, prevSlide]);

  const CurrentComponent = slides[currentSlide].component;

  return (
    <div className={`min-h-screen ${t.bg} text-slate-200 font-sans selection:bg-[#00E5FF] selection:text-black flex flex-col overflow-hidden`}>
      {/* TOP BAR */}
      <header className={`h-12 border-b ${t.border} ${t.surface} flex items-center justify-between px-4 z-20`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <Command size={18} className={t.accent} />
            <span className="font-semibold tracking-wide text-sm">AIMAR OS</span>
          </div>
          <div className="h-4 w-px bg-slate-800" />
          <span className={`font-mono text-xs ${t.muted} uppercase tracking-widest hidden md:inline`}>Command Deck // V9</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="hidden sm:inline text-slate-500">SECURE CONNECTION</span>
          <div className="flex items-center gap-2 text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> ACTIVE
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* SIDEBAR */}
        <aside className={`hidden lg:flex w-64 border-r ${t.border} ${t.surface} flex-col justify-between z-10`}>
          <div className="p-4 space-y-1">
            <div className={`text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4 px-2`}>Index</div>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center justify-between ${
                  currentSlide === index
                    ? `bg-[#1A1A24] text-white border-l-2 border-[#00E5FF]`
                    : `text-slate-400 hover:bg-[#121216] border-l-2 border-transparent`
                }`}
              >
                <span>{slide.name}</span>
                {currentSlide === index && <ChevronRight size={14} className={t.accent} />}
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-slate-800/50">
            <div className="text-[10px] font-mono text-slate-600 mb-2">OPERATOR METRICS</div>
            <div className="space-y-2">
              {[['Sys Load', '14%', 'text-white'], ['Active Workflows', '12', t.accent]].map(([k, v, cls]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-slate-400">{k}</span>
                  <span className={`font-mono ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 relative flex flex-col">
          <div className="absolute inset-0 pointer-events-none opacity-5"
               style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="flex-1 p-8 md:p-16 overflow-y-auto relative z-10">
            <div className="max-w-5xl mx-auto h-full min-h-[500px]">
              <CurrentComponent key={slides[currentSlide].id} />
            </div>
          </div>
          <footer className={`h-16 border-t ${t.border} bg-[#0A0A0C]/80 backdrop-blur flex items-center justify-between px-8 z-20`}>
            <div className={`text-xs font-mono ${t.muted}`}>
              {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={prevSlide} disabled={currentSlide === 0}
                className={`p-2 rounded border transition-colors ${currentSlide === 0 ? 'border-slate-800 text-slate-700 cursor-not-allowed' : 'border-slate-700 text-slate-300 hover:bg-slate-800'}`}>
                <ChevronLeft size={18} />
              </button>
              <button onClick={nextSlide} disabled={currentSlide === slides.length - 1}
                className={`p-2 rounded border transition-colors ${currentSlide === slides.length - 1 ? 'border-slate-800 text-slate-700 cursor-not-allowed' : `${t.accentBorder} ${t.accent} ${t.accentBg} hover:bg-[#00E5FF]/20`}`}>
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
