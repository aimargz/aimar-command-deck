import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, Command, Database, GitMerge, LayoutGrid, Layers, Lock, Network, ShieldAlert, X } from 'lucide-react'

const ui = {
  bg: 'bg-[#050609]',
  panel: 'bg-[#0b0d12]/92',
  border: 'border-white/10',
  border2: 'border-white/15',
  cyan: 'text-[#59f0ff]',
  cyanBg: 'bg-[#59f0ff]/10',
  cyanBorder: 'border-[#59f0ff]/30',
  muted: 'text-slate-500'
}

const threatEvents = [
  { time: '14:22:01', ip: '192.168.1.104', type: 'AUTH_BYPASS', threat: 'HIGH', status: 'BLOCKED' },
  { time: '14:21:45', ip: '10.0.0.5', type: 'PORT_SCAN', threat: 'LOW', status: 'LOGGED' },
  { time: '14:20:12', ip: '172.16.0.2', type: 'DATA_EXFIL', threat: 'CRITICAL', status: 'INVESTIGATING' },
  { time: '14:19:59', ip: '192.168.1.200', type: 'MALFORMED_REQ', threat: 'MEDIUM', status: 'DROPPED' }
]

const workflows = [
  { name: 'Client Onboarding', type: 'ASSIST', status: 'ACTIVE', runs: 142 },
  { name: 'Invoice Processing', type: 'AUTO', status: 'DRAFT', runs: 0 },
  { name: 'Threat Triage', type: 'HUMAN', status: 'ACTIVE', runs: 89 },
  { name: 'Vendor Provisioning', type: 'AUTO', status: 'ACTIVE', runs: 412 }
]

function tacticalBrief(event) {
  const lines = {
    AUTH_BYPASS: ['VECTOR - Credential reuse against an exposed auth surface.', 'RADIUS - Privileged application access may be affected across shared sessions.', 'DIRECTIVE - Freeze session, review auth logs, rotate affected credentials, and require operator approval before write-back.'],
    PORT_SCAN: ['VECTOR - Reconnaissance scan against adjacent internal services.', 'RADIUS - Limited to exposed subnet unless lateral credentials are present.', 'DIRECTIVE - Correlate source host, check firewall deltas, and quarantine only if repeated across segments.'],
    DATA_EXFIL: ['VECTOR - Possible bulk transfer outside expected workflow boundaries.', 'RADIUS - High impact if source has database, storage, or report export permissions.', 'DIRECTIVE - Pause outbound route, capture process tree, verify destination, and escalate for review.'],
    MALFORMED_REQ: ['VECTOR - Abnormal request pattern consistent with probing or bad client automation.', 'RADIUS - Low to medium until repeated against authentication or data endpoints.', 'DIRECTIVE - Rate-limit source, retain payload samples, and watch for signature recurrence.']
  }
  return `TARGET ${event.ip}\nTYPE ${event.type}\nSTATUS ${event.status}\n\n${(lines[event.type] || lines.PORT_SCAN).join('\n\n')}`
}

function synthWorkflow(input) {
  const name = input.trim() || 'Operational Process'
  return `WORKFLOW BLUEPRINT: ${name}\n\n1. INGEST\n- Capture request, source, owner, deadline, required systems, and approval boundary.\n\n2. ROUTE\n- Split into human judgment, assistive drafting, and safe automation steps.\n- Surface blockers before execution.\n\n3. CLASSIFICATION\n- HUMAN: approvals, exceptions, sensitive judgment.\n- ASSIST: drafts, summaries, checklists, routing suggestions.\n- AUTO: logging, reminders, formatting, status updates.\n\n4. GOVERNANCE\n- Read-only first.\n- Operator approval before write-back.\n- Audit trail for every handoff.\n- Blast radius limited by role and system.`
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])
  return reduced
}

function Header({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
          {Icon && <Icon className={ui.cyan} size={26} />} {title}
        </h2>
        {subtitle && <p className={`mt-2 font-mono text-xs uppercase tracking-[0.28em] ${ui.muted}`}>{subtitle}</p>}
      </div>
      <div className="hidden items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 font-mono text-[10px] text-green-400 sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" /> PUBLIC DEMO
      </div>
    </div>
  )
}

function Card({ children, className = '', tilt = true }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const move = useCallback((event) => {
    if (!tilt || reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    const rx = (py - 0.5) * -7
    const ry = (px - 0.5) * 7
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`
  }, [tilt, reduced])

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={reset} onBlur={reset} className={`motion-card rounded-2xl border ${ui.border} ${ui.panel} shadow-2xl shadow-black/30 ${className}`}>
      {children}
    </div>
  )
}

function MagneticButton({ children, className = '', disabled, ...props }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  const move = useCallback((event) => {
    if (disabled || reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const mx = event.clientX - (rect.left + rect.width / 2)
    const my = event.clientY - (rect.top + rect.height / 2)
    ref.current.style.transform = `translate(${mx * 0.1}px, ${my * 0.1}px)`
  }, [disabled, reduced])

  const reset = useCallback(() => {
    if (ref.current) ref.current.style.transform = ''
  }, [])

  return (
    <button ref={ref} disabled={disabled} onPointerMove={move} onPointerLeave={reset} onBlur={reset} className={`magnetic-button ${className}`} {...props}>
      {children}
    </button>
  )
}

function Hero() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl" />
        <Command className={`relative ${ui.cyan}`} size={70} strokeWidth={1} />
      </div>
      <h1 className="text-7xl font-semibold tracking-[-0.07em] text-white md:text-8xl">AIMAR</h1>
      <p className={`mt-5 font-mono text-sm uppercase tracking-[0.45em] ${ui.cyan}`}>Command Deck</p>
      <p className="mt-10 max-w-3xl text-xl font-light leading-relaxed text-slate-300">
        Applied Intelligence Mainframe, Automation, and Research. Operational intelligence infrastructure for workflows, memory, visibility, governance, research, and execution.
      </p>
    </div>
  )
}

function Direction() {
  const items = ['Workflows', 'Memory Systems', 'Operational Visibility', 'Signal Routing', 'Governance', 'Execution Infrastructure']
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-2">
      <div>
        <Header title="The Direction" />
        <p className="text-2xl font-light leading-relaxed text-slate-300">
          AIMAR started as AI automation work. The stronger pattern became clear: <span className="text-white">building coherent systems around intelligent work.</span>
        </p>
        <div className="mt-8 grid gap-3">
          {items.map(item => <div key={item} className="flex items-center gap-3 font-mono text-sm text-slate-400"><ChevronRight className={ui.cyan} size={16} />{item}</div>)}
        </div>
      </div>
      <Card className="scanline signal-sweep relative overflow-hidden p-8">
        <div className="absolute inset-0 opacity-[.08]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 space-y-6">
          <div className={`rounded-xl border ${ui.border2} bg-black/40 p-5 font-mono text-xs text-slate-400`}>INPUT SIGNAL</div>
          <div className="mx-auto h-8 w-px bg-white/10" />
          <div className={`rounded-xl border ${ui.cyanBorder} ${ui.cyanBg} p-6 text-center font-mono text-sm uppercase tracking-[0.25em] ${ui.cyan}`}>Coherent Execution Engine</div>
          <div className="grid grid-cols-2 gap-4">
            <div className={`rounded-xl border ${ui.border2} p-4 text-center font-mono text-xs text-slate-400`}>Automation</div>
            <div className={`rounded-xl border ${ui.border2} p-4 text-center font-mono text-xs text-slate-400`}>Governance</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Signal() {
  const steps = ['Ingest', 'Normalize', 'Classify', 'Score', 'Route', 'Surface', 'Decide', 'Audit']
  return (
    <div className="flex h-full flex-col justify-center">
      <Header icon={Network} title="Operational Intelligence" subtitle="work as signal flow" />
      <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-slate-300">
        AIMAR applies the same operating primitive across workflows, operations, security systems, dashboards, research, and signal environments.
      </p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {steps.map((step, index) => <Card key={step} className="p-5 text-center transition hover:border-cyan-300/40"><div className={`font-mono text-xs ${ui.muted}`}>{String(index + 1).padStart(2, '0')}</div><div className="mt-2 font-semibold text-white">{step}</div></Card>)}
      </div>
      <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-3 gap-4">
        {[[Database, 'Memory'], [GitMerge, 'Workflows'], [LayoutGrid, 'Dashboards']].map(([Icon, label]) => <Card key={label} className="p-5 text-center"><Icon className={`mx-auto mb-3 ${ui.cyan}`} size={22} /><div className="font-mono text-xs text-slate-300">{label}</div></Card>)}
      </div>
    </div>
  )
}

function ODSM() {
  const [picked, setPicked] = useState(null)
  return (
    <div className="flex h-full flex-col">
      <Header icon={ShieldAlert} title="ODSM" subtitle="operational threat intelligence" />
      <div className="grid flex-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-3 text-lg font-semibold text-white">Core Capabilities</h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-400">AI-assisted threat classification with human-in-the-loop oversight. Real operational systems, not abstract demos.</p>
          {['Signal Ingestion', 'Event Analysis', 'Threat Classification', 'Operational Visibility'].map(item => <div key={item} className={`mb-3 rounded-xl border ${ui.border2} bg-black/30 p-3 font-mono text-sm text-slate-300`}>{item}</div>)}
        </Card>
        <Card className="p-6 lg:col-span-2">
          <div className="mb-5 grid grid-cols-4 gap-3">
            {[["1,204", 'TOTAL EVENTS', 'text-white'], ['3', 'HIGH', 'text-red-400'], ['12', 'MEDIUM', 'text-yellow-400'], ["1,189", 'LOW / SAFE', 'text-green-400']].map(([value, label, color]) => <div key={label} className={`rounded-xl border ${ui.border2} bg-black/40 p-4 text-center`}><div className={`font-mono text-2xl ${color}`}>{value}</div><div className={`mt-1 font-mono text-[10px] ${ui.muted}`}>{label}</div></div>)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className={ui.muted}><tr>{['TIME', 'IP', 'TYPE', 'THREAT', 'ACTION'].map(head => <th className="pb-3 font-normal" key={head}>{head}</th>)}</tr></thead>
              <tbody>{threatEvents.map((event, index) => <tr key={index} className="border-t border-white/10 text-slate-300"><td className="py-3">{event.time}</td><td>{event.ip}</td><td>{event.type}</td><td>{event.threat}</td><td><MagneticButton onClick={() => setPicked(event)} className={`rounded-lg border ${ui.cyanBorder} ${ui.cyanBg} px-3 py-1 ${ui.cyan}`}>ANALYZE</MagneticButton></td></tr>)}</tbody>
            </table>
          </div>
          {picked && <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap"><button className="float-right text-slate-500" onClick={() => setPicked(null)}><X size={14} /></button>{tacticalBrief(picked)}</div>}
        </Card>
      </div>
    </div>
  )
}

function Ops() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [draft, setDraft] = useState('')
  const run = () => setDraft(synthWorkflow(input))
  return (
    <div className="relative flex h-full flex-col">
      <Header icon={GitMerge} title="AIMAR Ops" subtitle="workflow intelligence" />
      <div className="grid flex-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <p className="text-xl font-light leading-relaxed text-slate-300">AIMAR treats workflows as <span className="text-white">operational signal systems.</span></p>
          {[["Workflow Registry", 'Centralized mapping of repeatable processes.'], ['Classification Engine', 'Human / Assist / Auto assignment logic.'], ['Command Surfaces', 'Interfaces for operators to execute and monitor.'], ['Execution Visibility', 'Audit trails and performance metrics.']].map(([title, body]) => <div key={title} className="border-l border-white/10 pl-4"><div className="font-mono text-sm text-white">{title}</div><div className={`text-xs ${ui.muted}`}>{body}</div></div>)}
        </div>
        <Card className="p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><div className="font-mono text-sm text-slate-400">WORKFLOW REGISTRY</div><MagneticButton onClick={() => setOpen(true)} className={`rounded-lg border ${ui.cyanBorder} ${ui.cyanBg} px-3 py-1 font-mono text-xs ${ui.cyan}`}>NEW</MagneticButton></div>
          {workflows.map(workflow => <div key={workflow.name} className={`mb-3 flex items-center justify-between rounded-xl border ${ui.border2} bg-black/30 p-4`}><div><div className="font-semibold text-white">{workflow.name}</div><div className={`mt-1 font-mono text-[10px] ${ui.muted}`}>{workflow.type} | {workflow.runs} RUNS</div></div><div className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 font-mono text-[10px] text-green-400">{workflow.status}</div></div>)}
        </Card>
      </div>
      {open && <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-6 backdrop-blur"><Card tilt={false} className="w-full max-w-2xl p-6"><div className="mb-4 flex justify-between border-b border-white/10 pb-4"><div className={`font-mono text-sm ${ui.cyan}`}>WORKFLOW SYNTHESIS ENGINE</div><button onClick={() => setOpen(false)}><X size={18} /></button></div><input value={input} onChange={event => setInput(event.target.value)} placeholder="e.g. employee offboarding protocol" className={`w-full rounded-xl border ${ui.border2} bg-black/40 p-3 font-mono text-sm text-white outline-none focus:border-cyan-300/40`} /><MagneticButton onClick={run} className={`mt-3 rounded-xl border ${ui.cyanBorder} ${ui.cyanBg} px-4 py-2 font-mono text-xs ${ui.cyan}`}>GENERATE</MagneticButton>{draft && <pre className="mt-4 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">{draft}</pre>}</Card></div>}
    </div>
  )
}

function Architecture() {
  const layers = ['Brand + Strategy', 'Workspace + Config', 'Memory + Knowledge', 'Access Layer', 'Execution Layer', 'Operator Surfaces', 'Governance + Evaluation']
  return (
    <div className="flex h-full flex-col">
      <Header icon={Layers} title="Layered Architecture" subtitle="AIMAR mainframe topology" />
      <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="space-y-3"><div className={`font-mono text-xs uppercase tracking-[0.25em] ${ui.muted}`}>Canon</div>{['Godfile', 'Research Dossier', 'Configuration Pack'].map(item => <Card key={item} className="p-4"><div className="font-semibold text-white">{item}</div><div className={`text-xs ${ui.muted}`}>source layer</div></Card>)}</div>
        <div className="space-y-3">{layers.map((layer, index) => <Card key={layer} className="flex items-center gap-4 p-4"><div className={`flex h-9 w-9 items-center justify-center rounded-full border ${ui.border2} font-mono text-xs ${ui.cyan}`}>{index + 1}</div><div><div className="font-semibold text-white">{layer}</div><div className={`text-xs ${ui.muted}`}>modular operating layer</div></div></Card>)}</div>
      </div>
    </div>
  )
}

function Governance() {
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-2">
      <Card className="relative overflow-hidden border-red-500/20 bg-red-950/10 p-8"><Lock className="absolute -right-14 -top-14 h-72 w-72 text-red-500/10" /><div className="relative z-10"><div className="mb-8 flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-red-300"><AlertTriangle size={16} /> Restricted Access Protocol</div>{[['PERMISSION STAGING', 'ACTIVE'], ['AUDIT TRAILS', 'IMMUTABLE'], ['HUMAN APPROVAL GATES', 'REQUIRED'], ['BLAST RADIUS CONTROL', 'MODULAR']].map(([name, status]) => <div key={name} className="flex justify-between border-b border-red-500/20 py-4 font-mono text-xs"><span>{name}</span><span className="text-green-400">{status}</span></div>)}</div></Card>
      <div><Header title="Security & OPSEC" /><p className="text-xl font-light leading-relaxed text-slate-300">Automation should increase clarity, not invisible risk. AIMAR systems are designed around governance-first automation.</p><Card className="mt-8 p-6"><div className="mb-3 font-semibold text-white">Core OPSEC Principles</div><ul className="space-y-2 text-sm text-slate-400"><li>Source awareness in generated actions.</li><li>Read-only access before write-back authorization.</li><li>Operational logging for accountability.</li><li>Security-aware architecture by default.</li></ul></Card></div>
    </div>
  )
}

function Founder() {
  return <div className="flex h-full flex-col justify-center"><Header icon={Activity} title="Founder OS" subtitle="operator command surface" /><div className="grid gap-4 md:grid-cols-3">{['Priorities', 'Memory', 'Workflows', 'Tasks', 'Signals', 'Visibility', 'Execution Support', 'Decision Context', 'Review Loops'].map(item => <Card key={item} className="p-5 text-center font-mono text-sm text-slate-300 hover:border-cyan-300/30">{item}</Card>)}</div><p className="mx-auto mt-10 max-w-2xl text-center text-lg text-slate-400">The objective is reducing fragmentation and context switching while preserving human judgment.</p></div>
}

function Protects() {
  const items = ['Systems over Hype', 'Workflow before Tool', 'Governance before Scale', 'Operational Clarity', 'Modular Architecture', 'OPSEC & Compliance', 'Proof before Expansion', 'Human Judgment Central']
  return (
    <div className="flex h-full flex-col justify-center">
      <Header title="What AIMAR Protects" />
      <p className="mb-10 text-center text-slate-400">Core fundamentals that do not change as AIMAR scales.</p>
      <div className="grid gap-4 md:grid-cols-4">{items.map(item => <Card key={item} className="p-6 text-center font-semibold text-slate-200 hover:border-white/30">{item}</Card>)}</div>
      <div className={`mt-10 text-center font-mono text-xs uppercase tracking-[0.25em] ${ui.cyan}`}>{'Path: Services -> Products -> Infrastructure'}</div>
    </div>
  )
}

function Final() {
  return <div className="flex h-full flex-col items-center justify-center text-center"><Command size={44} className="mb-8 text-slate-700" strokeWidth={1} /><h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">AIMAR builds operational <span className={ui.cyan}>intelligence infrastructure.</span></h2><div className="mt-10 grid gap-x-8 gap-y-4 text-left font-mono text-sm text-slate-400 md:grid-cols-3">{['Memory Systems', 'Workflow Engines', 'Dashboards', 'Research Artifacts', 'Governed Automations', 'Execution Systems'].map(item => <div key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{item}</div>)}</div><p className="mt-12 border-t border-white/10 pt-8 text-xl text-slate-300">For people and teams that need cleaner execution.</p></div>
}

const slideList = [
  ['init', 'Initialization', Hero],
  ['direction', 'The Direction', Direction],
  ['signal', 'Operational Intelligence', Signal],
  ['odsm', 'ODSM', ODSM],
  ['ops', 'AIMAR Ops', Ops],
  ['topology', 'Topology', Architecture],
  ['opsec', 'Security & OPSEC', Governance],
  ['founder', 'Founder OS', Founder],
  ['protect', 'Core Tenets', Protects],
  ['final', 'Positioning', Final]
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const rootRef = useRef(null)
  const next = useCallback(() => setCurrent(index => Math.min(index + 1, slideList.length - 1)), [])
  const prev = useCallback(() => setCurrent(index => Math.max(index - 1, 0)), [])

  const moveSpotlight = useCallback((event) => {
    if (!rootRef.current) return
    rootRef.current.style.setProperty('--mx', `${event.clientX}px`)
    rootRef.current.style.setProperty('--my', `${event.clientY}px`)
  }, [])

  useEffect(() => {
    const handler = event => {
      if (event.key === 'ArrowRight' || event.key === ' ') next()
      if (event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  const Active = useMemo(() => slideList[current][2], [current])

  return (
    <div ref={rootRef} onPointerMove={moveSpotlight} className={`cursor-spotlight min-h-screen ${ui.bg} text-slate-200`}>
      <div className="fixed inset-0 opacity-[.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '42px 42px' }} />
      <header className={`relative z-20 flex h-14 items-center justify-between border-b ${ui.border} ${ui.panel} px-4 md:px-6`}>
        <div className="flex items-center gap-3"><Command className={ui.cyan} size={18} /><span className="font-semibold text-white">AIMAR OS</span><span className={`hidden font-mono text-xs uppercase tracking-[0.25em] ${ui.muted} md:inline`}>Command Deck</span></div>
        <div className="flex items-center gap-3 font-mono text-xs"><span className="hidden text-slate-500 sm:inline">SECURE CONNECTION</span><span className="rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-green-400">ACTIVE</span></div>
      </header>
      <div className="relative z-10 flex h-[calc(100vh-3.5rem)]">
        <aside className={`hidden w-64 shrink-0 border-r ${ui.border} ${ui.panel} p-4 lg:block`}><div className={`mb-4 px-2 font-mono text-[10px] uppercase tracking-[0.25em] ${ui.muted}`}>Index</div>{slideList.map(([id, name], index) => <MagneticButton key={id} onClick={() => setCurrent(index)} className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${current === index ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}><span>{name}</span>{current === index && <ChevronRight className={ui.cyan} size={14} />}</MagneticButton>)}<div className="mt-8 border-t border-white/10 pt-5 font-mono text-xs text-slate-500"><div className="mb-2 flex justify-between"><span>System Load</span><span className="text-white">14%</span></div><div className="flex justify-between"><span>Workflows</span><span className={ui.cyan}>12</span></div></div></aside>
        <main className="flex flex-1 flex-col overflow-hidden">
          <section className="no-scrollbar flex-1 overflow-auto p-6 md:p-10 lg:p-14"><div className="mx-auto h-full min-h-[620px] max-w-6xl animate-fade-in"><Active /></div></section>
          <footer className={`flex h-16 items-center justify-between border-t ${ui.border} ${ui.panel} px-6`}><div className={`font-mono text-xs ${ui.muted}`}>{String(current + 1).padStart(2, '0')} / {String(slideList.length).padStart(2, '0')}</div><div className="flex gap-3"><MagneticButton onClick={prev} disabled={current === 0} className={`rounded-xl border ${ui.border2} p-2 text-slate-400 disabled:opacity-25`}><ChevronLeft size={18} /></MagneticButton><MagneticButton onClick={next} disabled={current === slideList.length - 1} className={`rounded-xl border ${ui.cyanBorder} ${ui.cyanBg} p-2 ${ui.cyan} disabled:opacity-25`}><ChevronRight size={18} /></MagneticButton></div></footer>
        </main>
      </div>
    </div>
  )
}
