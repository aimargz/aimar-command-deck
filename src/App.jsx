import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Command,
  Cpu,
  Database,
  Eye,
  EyeOff,
  GitMerge,
  LayoutGrid,
  Layers,
  Lock,
  Network,
  Radio,
  Search,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  X
} from 'lucide-react'

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

const modes = [
  { id: 'overview', label: 'Overview', accent: 'text-cyan-300' },
  { id: 'operator', label: 'Operator', accent: 'text-green-300' },
  { id: 'technical', label: 'Technical', accent: 'text-violet-300' },
  { id: 'opsec', label: 'OPSEC', accent: 'text-red-300' }
]

const tickerMessages = [
  'SIGNAL ROUTE STABLE // workflow registry online',
  'ODSM SAMPLE STREAM // threat events contained',
  'GOVERNANCE LAYER // approval gates enforced',
  'FOUNDER OS // context surface synchronized',
  'SHARE-SAFE FILTER // public demo data only'
]

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

const topologyNodes = [
  {
    id: 'strategy',
    title: 'Brand + Strategy',
    doctrine: 'AIMAR remains Applied Intelligence Mainframe, Automation, and Research.',
    systems: 'Umbrella positioning, labs, command deck, customer-facing surfaces.',
    proof: 'Consistent language across deck, ops shell, and public demo.'
  },
  {
    id: 'workspace',
    title: 'Workspace + Config',
    doctrine: 'Spec-first structure before scale.',
    systems: 'Templates, project conventions, build lab, operating cadence.',
    proof: 'Reusable command-deck structure and mode-based information views.'
  },
  {
    id: 'memory',
    title: 'Memory + Knowledge',
    doctrine: 'Context should persist outside a single chat session.',
    systems: 'Research canon, project notes, source maps, working memory.',
    proof: 'Founder OS and topology surfaces preserve direction and rationale.'
  },
  {
    id: 'access',
    title: 'Access Layer',
    doctrine: 'Read-only before write-back.',
    systems: 'Files, connectors, SaaS, APIs, scoped permissions.',
    proof: 'Share-safe mode and OPSEC posture reduce accidental exposure.'
  },
  {
    id: 'execution',
    title: 'Execution Layer',
    doctrine: 'Small governed actions over giant opaque automation.',
    systems: 'Skills, workers, workflow synthesis, routing logic, approval gates.',
    proof: 'AIMAR Ops classifies Human / Assist / Auto work.'
  },
  {
    id: 'operator',
    title: 'Operator Surfaces',
    doctrine: 'Interfaces should make work visible and executable.',
    systems: 'Command deck, Founder OS, Ops inbox, dashboards.',
    proof: 'Live command shell, registry, ODSM, and event ticker.'
  },
  {
    id: 'governance',
    title: 'Governance + Evaluation',
    doctrine: 'Automation should increase clarity, not invisible risk.',
    systems: 'Logs, audit trails, validation, approval gates, OPSEC checks.',
    proof: 'Security slide and restricted access protocol panel.'
  }
]

function tacticalBrief(event, mode) {
  const lines = {
    AUTH_BYPASS: ['VECTOR - Credential reuse against an exposed auth surface.', 'RADIUS - Privileged application access may be affected across shared sessions.', 'DIRECTIVE - Freeze session, review auth logs, rotate affected credentials, and require operator approval before write-back.'],
    PORT_SCAN: ['VECTOR - Reconnaissance scan against adjacent internal services.', 'RADIUS - Limited to exposed subnet unless lateral credentials are present.', 'DIRECTIVE - Correlate source host, check firewall deltas, and quarantine only if repeated across segments.'],
    DATA_EXFIL: ['VECTOR - Possible bulk transfer outside expected workflow boundaries.', 'RADIUS - High impact if source has database, storage, or report export permissions.', 'DIRECTIVE - Pause outbound route, capture process tree, verify destination, and escalate for review.'],
    MALFORMED_REQ: ['VECTOR - Abnormal request pattern consistent with probing or bad client automation.', 'RADIUS - Low to medium until repeated against authentication or data endpoints.', 'DIRECTIVE - Rate-limit source, retain payload samples, and watch for signature recurrence.']
  }
  const modeLine = mode === 'opsec' ? '\n\nOPSEC LENS - preserve logs, avoid irreversible action, require approval before changes.' : ''
  return `TARGET ${event.ip}\nTYPE ${event.type}\nSTATUS ${event.status}\n\n${(lines[event.type] || lines.PORT_SCAN).join('\n\n')}${modeLine}`
}

function synthWorkflow(input, mode) {
  const name = input.trim() || 'Operational Process'
  const lens = {
    overview: 'Explain the process clearly enough for a collaborator to understand.',
    operator: 'Prioritize next actions, blockers, owners, and execution visibility.',
    technical: 'Expose triggers, data fields, classification logic, and system boundaries.',
    opsec: 'Emphasize permission staging, auditability, approval gates, and blast-radius control.'
  }[mode]
  return `WORKFLOW BLUEPRINT: ${name}\n\nMODE LENS\n- ${lens}\n\n1. INGEST\n- Capture request, source, owner, deadline, required systems, and approval boundary.\n\n2. ROUTE\n- Split into human judgment, assistive drafting, and safe automation steps.\n- Surface blockers before execution.\n\n3. CLASSIFICATION\n- HUMAN: approvals, exceptions, sensitive judgment.\n- ASSIST: drafts, summaries, checklists, routing suggestions.\n- AUTO: logging, reminders, formatting, status updates.\n\n4. GOVERNANCE\n- Read-only first.\n- Operator approval before write-back.\n- Audit trail for every handoff.\n- Blast radius limited by role and system.`
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

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function useTypedText(text, active = true, speed = 10) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(active ? '' : text)
  useEffect(() => {
    if (!active || reduced) {
      setShown(text)
      return undefined
    }
    setShown('')
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setShown(text.slice(0, index))
      if (index >= text.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [text, active, speed, reduced])
  return shown
}

function Header({ icon: Icon, title, subtitle, mode, shareSafe }) {
  const modeMeta = modes.find(item => item.id === mode) || modes[0]
  return (
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <h2 className="flex items-center gap-3 text-3xl font-semibold tracking-tight text-white">
          {Icon && <Icon className={ui.cyan} size={26} />} {title}
        </h2>
        {subtitle && <p className={`mt-2 font-mono text-xs uppercase tracking-[0.28em] ${ui.muted}`}>{subtitle}</p>}
      </div>
      <div className="hidden flex-col items-end gap-2 sm:flex">
        <div className={`rounded-full border ${ui.cyanBorder} ${ui.cyanBg} px-3 py-1 font-mono text-[10px] uppercase ${modeMeta.accent}`}>{modeMeta.label} Mode</div>
        {shareSafe && <div className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 font-mono text-[10px] text-green-400">SHARE-SAFE ACTIVE</div>}
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

function TerminalText({ text, className = '' }) {
  const shown = useTypedText(text, true, 7)
  return <pre className={`terminal-cursor whitespace-pre-wrap ${className}`}>{shown}</pre>
}

function ModeSwitcher({ mode, setMode }) {
  return (
    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-black/25 p-1 lg:flex">
      {modes.map(item => (
        <button key={item.id} onClick={() => setMode(item.id)} className={`rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition ${mode === item.id ? `${ui.cyanBg} ${ui.cyan} border ${ui.cyanBorder}` : 'text-slate-500 hover:text-slate-300'}`}>
          {item.label}
        </button>
      ))}
    </div>
  )
}

function CommandPalette({ open, onClose, commands, runCommand }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const filtered = commands.filter(command => `${command.name} ${command.keywords}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-24 backdrop-blur-md" onClick={onClose}>
      <div className={`w-full max-w-2xl overflow-hidden rounded-3xl border ${ui.border2} bg-[#07090d] shadow-2xl shadow-cyan-950/20`} onClick={event => event.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search className={ui.cyan} size={18} />
          <input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Jump to ODSM, workflows, topology, security..." className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-slate-600" />
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={18} /></button>
        </div>
        <div className="max-h-96 overflow-auto p-2">
          {filtered.map(command => (
            <button key={command.id} onClick={() => runCommand(command)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/5">
              <div>
                <div className="font-medium text-white">{command.name}</div>
                <div className={`mt-1 font-mono text-xs ${ui.muted}`}>{command.description}</div>
              </div>
              <ChevronRight className={ui.cyan} size={16} />
            </button>
          ))}
          {filtered.length === 0 && <div className={`p-6 text-center font-mono text-xs ${ui.muted}`}>NO MATCHING MODULE</div>}
        </div>
      </div>
    </div>
  )
}

function Hero({ mode, shareSafe }) {
  const descriptor = {
    overview: 'Operational intelligence infrastructure for workflows, memory, visibility, governance, research, and execution.',
    operator: 'A command surface for turning scattered signals into priorities, workflows, decisions, and accountable action.',
    technical: 'A modular operating layer: ingest, normalize, classify, score, route, surface, decide, and audit.',
    opsec: 'A security-aware system posture: read-only first, approval gates, audit trails, and blast-radius control.'
  }[mode]

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="aurora-orb relative mb-10">
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl" />
        <Command className={`relative ${ui.cyan}`} size={70} strokeWidth={1} />
      </div>
      <h1 className="text-7xl font-semibold tracking-[-0.07em] text-white md:text-8xl">AIMAR</h1>
      <p className={`mt-5 font-mono text-sm uppercase tracking-[0.45em] ${ui.cyan}`}>Command Deck</p>
      <p className="mt-10 max-w-3xl text-xl font-light leading-relaxed text-slate-300">
        Applied Intelligence Mainframe, Automation, and Research. {descriptor}
      </p>
      <div className="mt-8 grid gap-3 text-center font-mono text-xs text-slate-500 sm:grid-cols-3">
        <div className={`rounded-full border ${ui.border2} px-4 py-2`}>Mode: {modes.find(item => item.id === mode)?.label}</div>
        <div className={`rounded-full border ${ui.border2} px-4 py-2`}>Press Cmd/Ctrl K</div>
        <div className={`rounded-full border ${shareSafe ? 'border-green-500/25 text-green-400' : ui.border2} px-4 py-2`}>{shareSafe ? 'Share-Safe On' : 'Internal Labels Visible'}</div>
      </div>
    </div>
  )
}

function Direction({ mode, shareSafe }) {
  const items = mode === 'technical'
    ? ['Ingest Layer', 'Memory Systems', 'Routing Logic', 'Evaluation Loops', 'Governed Connectors', 'Execution Infrastructure']
    : ['Workflows', 'Memory Systems', 'Operational Visibility', 'Signal Routing', 'Governance', 'Execution Infrastructure']
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-2">
      <div>
        <Header title="The Direction" mode={mode} shareSafe={shareSafe} />
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

function Signal({ mode, shareSafe }) {
  const steps = ['Ingest', 'Normalize', 'Classify', 'Score', 'Route', 'Surface', 'Decide', 'Audit']
  return (
    <div className="flex h-full flex-col justify-center">
      <Header icon={Network} title="Operational Intelligence" subtitle="work as signal flow" mode={mode} shareSafe={shareSafe} />
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

function ODSM({ mode, shareSafe }) {
  const [picked, setPicked] = useState(null)
  const brief = picked ? tacticalBrief(picked, mode) : ''
  const displayIp = address => shareSafe ? address.replace(/\d+$/, 'xxx') : address
  return (
    <div className="flex h-full flex-col">
      <Header icon={ShieldAlert} title="ODSM" subtitle="operational threat intelligence" mode={mode} shareSafe={shareSafe} />
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
              <tbody>{threatEvents.map((event, index) => <tr key={index} className="border-t border-white/10 text-slate-300"><td className="py-3">{event.time}</td><td>{displayIp(event.ip)}</td><td>{event.type}</td><td>{event.threat}</td><td><MagneticButton onClick={() => setPicked(event)} className={`rounded-lg border ${ui.cyanBorder} ${ui.cyanBg} px-3 py-1 ${ui.cyan}`}>ANALYZE</MagneticButton></td></tr>)}</tbody>
            </table>
          </div>
          {picked && <div className="mt-5 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-4 font-mono text-xs leading-relaxed text-slate-300"><button className="float-right text-slate-500" onClick={() => setPicked(null)}><X size={14} /></button><TerminalText text={shareSafe ? brief.replaceAll(picked.ip, displayIp(picked.ip)) : brief} /></div>}
        </Card>
      </div>
    </div>
  )
}

function Ops({ mode, shareSafe }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [draft, setDraft] = useState('')
  const run = () => setDraft(synthWorkflow(input, mode))
  return (
    <div className="relative flex h-full flex-col">
      <Header icon={GitMerge} title="AIMAR Ops" subtitle="workflow intelligence" mode={mode} shareSafe={shareSafe} />
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
      {open && <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-6 backdrop-blur"><Card tilt={false} className="w-full max-w-2xl p-6"><div className="mb-4 flex justify-between border-b border-white/10 pb-4"><div className={`font-mono text-sm ${ui.cyan}`}>WORKFLOW SYNTHESIS ENGINE</div><button onClick={() => setOpen(false)}><X size={18} /></button></div><input value={input} onChange={event => setInput(event.target.value)} placeholder="e.g. employee offboarding protocol" className={`w-full rounded-xl border ${ui.border2} bg-black/40 p-3 font-mono text-sm text-white outline-none focus:border-cyan-300/40`} /><MagneticButton onClick={run} className={`mt-3 rounded-xl border ${ui.cyanBorder} ${ui.cyanBg} px-4 py-2 font-mono text-xs ${ui.cyan}`}>GENERATE</MagneticButton>{draft && <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-xs leading-relaxed text-slate-300"><TerminalText text={draft} /></div>}</Card></div>}
    </div>
  )
}

function Architecture({ mode, shareSafe }) {
  const [activeNode, setActiveNode] = useState(topologyNodes[0])
  return (
    <div className="flex h-full flex-col">
      <Header icon={Layers} title="Layered Architecture" subtitle="clickable AIMAR mainframe topology" mode={mode} shareSafe={shareSafe} />
      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {topologyNodes.map((node, index) => <button key={node.id} onClick={() => setActiveNode(node)} className={`motion-card flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${activeNode.id === node.id ? `${ui.cyanBorder} ${ui.cyanBg}` : `${ui.border2} bg-black/25 hover:border-cyan-300/30`}`}><div className={`flex h-9 w-9 items-center justify-center rounded-full border ${ui.border2} font-mono text-xs ${ui.cyan}`}>{index + 1}</div><div><div className="font-semibold text-white">{shareSafe && node.id === 'memory' ? 'Knowledge Layer' : node.title}</div><div className={`text-xs ${ui.muted}`}>Click to reveal doctrine, systems, and proof</div></div></button>)}
        </div>
        <Card tilt={false} className="signal-sweep relative overflow-hidden p-6">
          <div className={`mb-4 font-mono text-xs uppercase tracking-[0.25em] ${ui.cyan}`}>Node Detail</div>
          <h3 className="mb-4 text-2xl font-semibold text-white">{shareSafe && activeNode.id === 'memory' ? 'Knowledge Layer' : activeNode.title}</h3>
          {['doctrine', 'systems', 'proof'].map(label => <div key={label} className="mb-4 rounded-xl border border-white/10 bg-black/30 p-4"><div className={`mb-2 font-mono text-[10px] uppercase tracking-[0.2em] ${ui.muted}`}>{label}</div><div className="text-sm leading-relaxed text-slate-300">{activeNode[label]}</div></div>)}
        </Card>
      </div>
    </div>
  )
}

function Governance({ mode, shareSafe }) {
  return (
    <div className="grid h-full items-center gap-10 lg:grid-cols-2">
      <Card className="relative overflow-hidden border-red-500/20 bg-red-950/10 p-8"><Lock className="absolute -right-14 -top-14 h-72 w-72 text-red-500/10" /><div className="relative z-10"><div className="mb-8 flex items-center gap-2 font-mono text-sm uppercase tracking-[0.2em] text-red-300"><AlertTriangle size={16} /> {shareSafe ? 'Governance Protocol' : 'Restricted Access Protocol'}</div>{[['PERMISSION STAGING', 'ACTIVE'], ['AUDIT TRAILS', 'IMMUTABLE'], ['HUMAN APPROVAL GATES', 'REQUIRED'], ['BLAST RADIUS CONTROL', 'MODULAR']].map(([name, status]) => <div key={name} className="flex justify-between border-b border-red-500/20 py-4 font-mono text-xs"><span>{name}</span><span className="text-green-400">{status}</span></div>)}</div></Card>
      <div><Header title="Security & OPSEC" mode={mode} shareSafe={shareSafe} /><p className="text-xl font-light leading-relaxed text-slate-300">Automation should increase clarity, not invisible risk. AIMAR systems are designed around governance-first automation.</p><Card className="mt-8 p-6"><div className="mb-3 font-semibold text-white">Core OPSEC Principles</div><ul className="space-y-2 text-sm text-slate-400"><li>Source awareness in generated actions.</li><li>Read-only access before write-back authorization.</li><li>Operational logging for accountability.</li><li>Security-aware architecture by default.</li></ul></Card></div>
    </div>
  )
}

function Founder({ mode, shareSafe }) {
  return <div className="flex h-full flex-col justify-center"><Header icon={Activity} title="Founder OS" subtitle="operator command surface" mode={mode} shareSafe={shareSafe} /><div className="grid gap-4 md:grid-cols-3">{['Priorities', 'Memory', 'Workflows', 'Tasks', 'Signals', 'Visibility', 'Execution Support', 'Decision Context', 'Review Loops'].map(item => <Card key={item} className="p-5 text-center font-mono text-sm text-slate-300 hover:border-cyan-300/30">{item}</Card>)}</div><p className="mx-auto mt-10 max-w-2xl text-center text-lg text-slate-400">The objective is reducing fragmentation and context switching while preserving human judgment.</p></div>
}

function Protects({ mode, shareSafe }) {
  const items = ['Systems over Hype', 'Workflow before Tool', 'Governance before Scale', 'Operational Clarity', 'Modular Architecture', 'OPSEC & Compliance', 'Proof before Expansion', 'Human Judgment Central']
  return (
    <div className="flex h-full flex-col justify-center">
      <Header title="What AIMAR Protects" mode={mode} shareSafe={shareSafe} />
      <p className="mb-10 text-center text-slate-400">Core fundamentals that do not change as AIMAR scales.</p>
      <div className="grid gap-4 md:grid-cols-4">{items.map(item => <Card key={item} className="p-6 text-center font-semibold text-slate-200 hover:border-white/30">{item}</Card>)}</div>
      <div className={`mt-10 text-center font-mono text-xs uppercase tracking-[0.25em] ${ui.cyan}`}>{'Path: Services -> Products -> Infrastructure'}</div>
    </div>
  )
}

function FounderContact({ mode, shareSafe }) {
  return (
    <div className="grid h-full items-center gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <Header icon={ShieldCheck} title="Founder / Contact" subtitle="operator signature" mode={mode} shareSafe={shareSafe} />
        <p className="max-w-3xl text-2xl font-light leading-relaxed text-slate-300">
          Built by Ari Gonzalez, a systems-oriented builder focused on AI workflows, operational intelligence, security-aware automation, infrastructure, and research systems.
        </p>
        <p className="mt-6 max-w-2xl text-slate-400">
          AIMAR is being developed as a practical operating layer for intelligent work: memory, workflows, dashboards, governance, signal processing, and execution support.
        </p>
      </div>
      <Card className="p-6">
        <div className={`mb-4 font-mono text-xs uppercase tracking-[0.25em] ${ui.cyan}`}>Contact Path</div>
        <a href="mailto:ari@aimar.store" className="text-2xl font-semibold text-white hover:text-cyan-200">ari@aimar.store</a>
        <div className="mt-6 grid gap-3 font-mono text-xs text-slate-400">
          <div className={`rounded-xl border ${ui.border2} bg-black/30 p-3`}>Purpose: collaborators, operators, builders</div>
          <div className={`rounded-xl border ${ui.border2} bg-black/30 p-3`}>Status: early operating system / research lab</div>
          <div className={`rounded-xl border ${ui.border2} bg-black/30 p-3`}>Tone: systems-first, governance-first</div>
        </div>
      </Card>
    </div>
  )
}

function Final({ mode, shareSafe }) {
  return <div className="flex h-full flex-col items-center justify-center text-center"><Command size={44} className="mb-8 text-slate-700" strokeWidth={1} /><h2 className="max-w-3xl text-5xl font-semibold tracking-tight text-white">AIMAR builds operational <span className={ui.cyan}>intelligence infrastructure.</span></h2><div className="mt-10 grid gap-x-8 gap-y-4 text-left font-mono text-sm text-slate-400 md:grid-cols-3">{['Memory Systems', 'Workflow Engines', 'Dashboards', 'Research Artifacts', 'Governed Automations', 'Execution Systems'].map(item => <div key={item} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{item}</div>)}</div><p className="mt-12 border-t border-white/10 pt-8 text-xl text-slate-300">For people and teams that need cleaner execution.</p><a href="mailto:ari@aimar.store" className={`mt-5 font-mono text-sm ${ui.cyan}`}>ari@aimar.store</a></div>
}

const slideList = [
  ['init', 'Initialization', Hero, 'home overview start'],
  ['direction', 'The Direction', Direction, 'evolution strategy'],
  ['signal', 'Operational Intelligence', Signal, 'signal flow primitive'],
  ['odsm', 'ODSM', ODSM, 'threat security events'],
  ['ops', 'AIMAR Ops', Ops, 'workflows registry synthesis'],
  ['topology', 'Topology', Architecture, 'architecture layers nodes'],
  ['opsec', 'Security & OPSEC', Governance, 'security governance compliance'],
  ['founder', 'Founder OS', Founder, 'operator command surface'],
  ['protect', 'Core Tenets', Protects, 'doctrine scale principles'],
  ['contact', 'Founder / Contact', FounderContact, 'email founder contact'],
  ['final', 'Positioning', Final, 'closing positioning']
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const [mode, setMode] = useState('overview')
  const [shareSafe, setShareSafe] = useState(true)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [tickerIndex, setTickerIndex] = useState(0)
  const rootRef = useRef(null)
  const clock = useClock()

  const next = useCallback(() => setCurrent(index => Math.min(index + 1, slideList.length - 1)), [])
  const prev = useCallback(() => setCurrent(index => Math.max(index - 1, 0)), [])

  const moveSpotlight = useCallback((event) => {
    if (!rootRef.current) return
    rootRef.current.style.setProperty('--mx', `${event.clientX}px`)
    rootRef.current.style.setProperty('--my', `${event.clientY}px`)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setTickerIndex(index => (index + 1) % tickerMessages.length), 3400)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = event => {
      const tag = document.activeElement?.tagName?.toLowerCase()
      const typing = tag === 'input' || tag === 'textarea'
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
        return
      }
      if (event.key === 'Escape') setPaletteOpen(false)
      if (!typing && !paletteOpen && (event.key === 'ArrowRight' || event.key === ' ')) next()
      if (!typing && !paletteOpen && event.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, paletteOpen])

  const commands = useMemo(() => [
    ...slideList.map(([id, name, Component, keywords], index) => ({ id, name, keywords, description: `Jump to ${name}`, run: () => setCurrent(index) })),
    ...modes.map(item => ({ id: `mode-${item.id}`, name: `Switch to ${item.label} Mode`, keywords: `mode ${item.id}`, description: 'Change presentation lens', run: () => setMode(item.id) })),
    { id: 'share-safe', name: shareSafe ? 'Disable Share-Safe' : 'Enable Share-Safe', keywords: 'share safe public private sensitive', description: 'Toggle public-safe label filtering', run: () => setShareSafe(value => !value) }
  ], [shareSafe])

  const runCommand = command => {
    command.run()
    setPaletteOpen(false)
  }

  const Active = useMemo(() => slideList[current][2], [current])

  return (
    <div ref={rootRef} onPointerMove={moveSpotlight} className={`cursor-spotlight min-h-screen ${ui.bg} text-slate-200`}>
      <div className="fixed inset-0 opacity-[.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '42px 42px' }} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} runCommand={runCommand} />
      <header className={`relative z-20 flex h-14 items-center justify-between border-b ${ui.border} ${ui.panel} px-4 md:px-6`}>
        <div className="flex min-w-0 items-center gap-3"><Command className={ui.cyan} size={18} /><span className="font-semibold text-white">AIMAR OS</span><span className={`hidden font-mono text-xs uppercase tracking-[0.25em] ${ui.muted} xl:inline`}>Command Deck</span></div>
        <ModeSwitcher mode={mode} setMode={setMode} />
        <div className="flex items-center gap-3 font-mono text-xs">
          <MagneticButton onClick={() => setPaletteOpen(true)} className={`hidden rounded-full border ${ui.border2} px-3 py-1 text-slate-400 hover:text-white md:inline-flex`}><Search size={13} className="mr-2" />Cmd K</MagneticButton>
          <MagneticButton onClick={() => setShareSafe(value => !value)} className={`rounded-full border px-3 py-1 ${shareSafe ? 'border-green-500/25 bg-green-500/10 text-green-400' : `${ui.border2} text-slate-400`}`}>{shareSafe ? <EyeOff size={13} className="mr-2" /> : <Eye size={13} className="mr-2" />}{shareSafe ? 'Safe' : 'Internal'}</MagneticButton>
          <span className="hidden items-center gap-2 text-slate-500 lg:flex"><Clock size={13} />{clock}</span>
        </div>
      </header>
      <div className={`relative z-20 flex h-9 items-center justify-between border-b ${ui.border} bg-black/30 px-4 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500 md:px-6`}>
        <div className="flex min-w-0 items-center gap-2"><Radio size={12} className={ui.cyan} /><span className="ticker-dot h-1.5 w-1.5 rounded-full bg-cyan-300" /><span className="truncate">{tickerMessages[tickerIndex]}</span></div>
        <div className="hidden items-center gap-4 lg:flex"><span>Integrity 98%</span><span>Nodes 07</span><span>Mode {modes.find(item => item.id === mode)?.label}</span></div>
      </div>
      <div className="relative z-10 flex h-[calc(100vh-5.75rem)]">
        <aside className={`hidden w-64 shrink-0 border-r ${ui.border} ${ui.panel} p-4 lg:block`}>
          <div className={`mb-4 px-2 font-mono text-[10px] uppercase tracking-[0.25em] ${ui.muted}`}>Index</div>
          {slideList.map(([id, name], index) => <MagneticButton key={id} onClick={() => setCurrent(index)} className={`mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${current === index ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}><span>{name}</span>{current === index && <ChevronRight className={ui.cyan} size={14} />}</MagneticButton>)}
          <div className="mt-8 border-t border-white/10 pt-5 font-mono text-xs text-slate-500">
            {[['System Load', '14%'], ['Workflows', '12'], ['Signal Health', 'Nominal'], ['Audit State', 'Clean']].map(([name, value]) => <div key={name} className="mb-3"><div className="mb-1 flex justify-between"><span>{name}</span><span className={value === 'Clean' || value === 'Nominal' ? 'text-green-400' : ui.cyan}>{value}</span></div><div className="h-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-cyan-300/50" style={{ width: value === '14%' ? '14%' : value === '12' ? '48%' : '92%' }} /></div></div>)}
          </div>
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden">
          <section className="no-scrollbar flex-1 overflow-auto p-6 md:p-10 lg:p-14"><div className="mx-auto h-full min-h-[620px] max-w-6xl animate-fade-in"><Active mode={mode} shareSafe={shareSafe} /></div></section>
          <footer className={`flex h-16 items-center justify-between border-t ${ui.border} ${ui.panel} px-6`}><div className={`font-mono text-xs ${ui.muted}`}>{String(current + 1).padStart(2, '0')} / {String(slideList.length).padStart(2, '0')}</div><div className="flex gap-3"><MagneticButton onClick={prev} disabled={current === 0} className={`rounded-xl border ${ui.border2} p-2 text-slate-400 disabled:opacity-25`}><ChevronLeft size={18} /></MagneticButton><MagneticButton onClick={next} disabled={current === slideList.length - 1} className={`rounded-xl border ${ui.cyanBorder} ${ui.cyanBg} p-2 ${ui.cyan} disabled:opacity-25`}><ChevronRight size={18} /></MagneticButton></div></footer>
        </main>
      </div>
    </div>
  )
}
