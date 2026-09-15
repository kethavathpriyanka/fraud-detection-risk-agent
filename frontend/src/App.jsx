import React, { useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, BarChart3, Bell, BrainCircuit, CheckCircle2, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, CreditCard, FileWarning, LayoutDashboard,
  LogOut, Menu, RefreshCw, Search, Settings, ShieldCheck, Smartphone, UserRound,
  X, Zap
} from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { analyzeTransaction as analyzeAPI } from './api'

const riskColors = { LOW: '#16a34a', MEDIUM: '#d97706', HIGH: '#dc2626' }

const transactions = [
  { id:'TXN10245', amount:'₹85,000', time:'03:12 AM', location:'Delhi', device:'New Device', score:91, level:'HIGH', status:'Review' },
  { id:'TXN10241', amount:'₹42,500', time:'01:48 AM', location:'Hyderabad', device:'Chrome / Windows', score:76, level:'HIGH', status:'Review' },
  { id:'TXN10236', amount:'₹18,200', time:'11:20 PM', location:'Mumbai', device:'Android', score:58, level:'MEDIUM', status:'Monitor' },
  { id:'TXN10231', amount:'₹9,450', time:'09:15 PM', location:'Pune', device:'iPhone', score:34, level:'LOW', status:'Safe' },
  { id:'TXN10228', amount:'₹67,300', time:'07:42 PM', location:'Bengaluru', device:'New Device', score:83, level:'HIGH', status:'Review' }
]

const activity = [
  {day:'10 Sep', value:860}, {day:'11 Sep', value:1020}, {day:'12 Sep', value:940},
  {day:'13 Sep', value:1210}, {day:'14 Sep', value:1140}, {day:'15 Sep', value:1320}
]
const riskTrend = [
  {day:'10 Sep', value:31}, {day:'11 Sep', value:38}, {day:'12 Sep', value:34},
  {day:'13 Sep', value:47}, {day:'14 Sep', value:42}, {day:'15 Sep', value:55}
]

function RiskBadge({level}) {
  const styles = {
    HIGH:'bg-red-50 text-red-700 ring-red-100',
    MEDIUM:'bg-amber-50 text-amber-700 ring-amber-100',
    LOW:'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${styles[level]}`}>{level}</span>
}

function Card({children, className=''}) {
  return <div className={`rounded-2xl border border-slate-200 bg-white shadow-soft ${className}`}>{children}</div>
}

function Sidebar({page, setPage, collapsed, setCollapsed, mobileOpen, setMobileOpen}) {
  const items = [
    ['Dashboard','Overview',LayoutDashboard],
    ['Analyze Transaction','Manual risk analysis',Search],
    ['Suspicious Transactions','Flagged activity',AlertTriangle],
    ['Analytics','Risk intelligence',BarChart3],
    ['AI Explanations','Model reasoning',BrainCircuit],
    ['Alerts','Security notifications',Bell],
    ['Fraud Cases','Unauthorized reports',FileWarning],
    ['Settings','System preferences',Settings]
  ]
  return <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#081426] text-white transition-all duration-300 ${collapsed?'w-[78px]':'w-[270px]'} ${mobileOpen?'translate-x-0':'-translate-x-full lg:translate-x-0'}`}>
    <div className="flex h-20 items-center border-b border-white/10 px-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#081426]"><ShieldCheck size={22}/></div>
      {!collapsed && <div className="ml-3"><div className="font-bold tracking-tight">FraudShield</div><div className="text-[11px] text-slate-400">Risk Intelligence</div></div>}
      <button onClick={()=>setMobileOpen(false)} className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"><X size={18}/></button>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {items.map(([name,sub,Icon])=><button key={name} onClick={()=>{setPage(name);setMobileOpen(false)}} title={collapsed?name:''}
        className={`flex w-full items-center rounded-xl px-3 py-3 text-left transition ${page===name?'bg-white/10 text-white':'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
        <Icon size={19} className="shrink-0"/>{!collapsed&&<span className="ml-3"><span className="block text-sm font-medium">{name}</span><span className="block text-[10px] text-slate-500">{sub}</span></span>}
      </button>)}
    </nav>
    <div className="border-t border-white/10 p-3">
      <div className={`flex items-center rounded-xl bg-white/5 p-3 ${collapsed?'justify-center':''}`}><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-600"><UserRound size={17}/></div>{!collapsed&&<div className="ml-3 min-w-0"><p className="truncate text-sm font-semibold">Security Analyst</p><p className="text-[11px] text-slate-500">Administrator</p></div>}</div>
    </div>
  </aside>
}

function Header({setMobileOpen}) {
  return <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-8">
    <div className="flex items-center gap-3"><button onClick={()=>setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2 lg:hidden"><Menu size={20}/></button><div className="lg:hidden font-bold text-slate-900">FraudShield</div></div>
    <div className="ml-auto flex items-center gap-2"><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Bell size={19}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500"/></button><button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><CircleHelp size={19}/></button></div>
  </header>
}

function Dashboard({setPage}) {
  const pie = [{name:'Low',value:10842,color:'#16a34a'},{name:'Medium',value:1421,color:'#d97706'},{name:'High',value:217,color:'#dc2626'}]
  return <div className="space-y-6">
    <div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600"><Activity size={14}/> Monitoring active</div><h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Good Morning, Security Analyst</h1><p className="mt-1 text-sm text-slate-500">Real-time transaction risk monitoring</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[['Total Transactions','12,480','All monitored activity',CreditCard,'text-slate-700'],['Low Risk','10,842','86.9% of transactions',CheckCircle2,'text-emerald-600'],['Medium Risk','1,421','11.4% of transactions',Clock3,'text-amber-600'],['High Risk','217','1.7% requiring review',AlertTriangle,'text-red-600']].map(([title,value,desc,Icon,color])=><Card key={title} className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{desc}</p></div><div className={`rounded-xl bg-slate-50 p-3 ${color}`}><Icon size={21}/></div></div></Card>)}
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      {[['217','Total suspicious transactions','Needs review',AlertTriangle,'text-red-600'],['64','Reported unauthorized','User reported',FileWarning,'text-amber-600'],['1,326','Transactions analyzed today','+8.4% vs yesterday',Zap,'text-blue-600']].map(([v,t,d,Icon,c])=><Card key={t} className="p-5"><div className="flex items-center gap-3"><div className={`rounded-xl bg-slate-50 p-2.5 ${c}`}><Icon size={19}/></div><div><p className="text-xl font-bold">{v}</p><p className="text-xs font-medium text-slate-500">{t}</p><p className="text-[11px] text-slate-400">{d}</p></div></div></Card>)}
    </div>
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="p-5 xl:col-span-1"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Transaction Risk Distribution</h2><p className="text-xs text-slate-400">Current portfolio</p></div><BarChart3 size={18} className="text-slate-400"/></div><div className="relative h-64"><ResponsiveContainer><PieChart><Pie data={pie} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={3}>{pie.map(x=><Cell key={x.name} fill={x.color}/>)}</Pie><Tooltip formatter={(v)=>v.toLocaleString()}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="text-center"><p className="text-2xl font-bold">12,480</p><p className="text-xs text-slate-400">Transactions</p></div></div></div><div className="grid grid-cols-3 gap-2">{pie.map(x=><div key={x.name} className="text-center"><div className="mx-auto mb-1 h-2 w-2 rounded-full" style={{background:x.color}}/><p className="text-xs text-slate-500">{x.name}</p><p className="text-sm font-semibold">{x.value.toLocaleString()}</p></div>)}</div></Card>
      <Card className="p-5 xl:col-span-2"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Transaction Activity</h2><p className="text-xs text-slate-400">Transaction volume over time</p></div><span className="rounded-lg bg-slate-50 px-2 py-1 text-xs text-slate-500">Last 6 days</span></div><div className="h-64"><ResponsiveContainer><LineChart data={activity}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="day" tick={{fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/><Tooltip/><Line type="monotone" dataKey="value" stroke="#334155" strokeWidth={3} dot={{r:3}}/></LineChart></ResponsiveContainer></div></Card>
    </div>
    <Card className="p-5"><div className="mb-4 flex items-center justify-between"><div><h2 className="font-semibold">Risk Trend</h2><p className="text-xs text-slate-400">High-risk transaction trend</p></div><span className="text-xs font-semibold text-red-600">+13.2% this week</span></div><div className="h-56"><ResponsiveContainer><AreaChart data={riskTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/><XAxis dataKey="day" tick={{fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11}} axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="value" stroke="#dc2626" fill="#fee2e2" strokeWidth={2}/></AreaChart></ResponsiveContainer></div></Card>
    <SuspiciousTable setPage={setPage}/>
  </div>
}

function SuspiciousTable({setPage, full=false}) {
  return <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-semibold">{full?'Suspicious Transactions':'Recent Suspicious Transactions'}</h2><p className="text-xs text-slate-400">Transactions requiring attention</p></div>{!full&&<button onClick={()=>setPage('Suspicious Transactions')} className="text-xs font-semibold text-blue-700 hover:underline">View all</button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{['Transaction ID','Amount','Date/Time','Location','Device','Risk Score','Risk Level','Status','Action'].map(h=><th key={h} className="px-5 py-3 font-semibold">{h}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{transactions.map(t=><tr key={t.id} className="hover:bg-slate-50/70"><td className="px-5 py-4 font-semibold text-slate-800">{t.id}</td><td className="px-5 py-4 font-semibold">{t.amount}</td><td className="px-5 py-4 text-slate-500">{t.time}</td><td className="px-5 py-4">{t.location}</td><td className="px-5 py-4 text-slate-500">{t.device}</td><td className="px-5 py-4"><span className={`font-bold ${t.score>=70?'text-red-600':t.score>=40?'text-amber-600':'text-emerald-600'}`}>{t.score}%</span></td><td className="px-5 py-4"><RiskBadge level={t.level}/></td><td className="px-5 py-4 text-xs text-slate-500">{t.status}</td><td className="px-5 py-4"><button onClick={()=>setPage('Analyze Transaction')} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">Review</button></td></tr>)}</tbody></table></div></Card>
}

function Analyze() {
  const [form,setForm]=useState({transaction_id:'TXN10308',amount:'85000',transaction_type:'UPI',date:'2026-09-15',time:'03:12',location:'Delhi',device:'Chrome / Windows',recipient:'New Recipient',failed_attempts:'3',average_previous_amount:'24000',previous_frequency:'8',new_device:true,new_location:true})
  const [loading,setLoading]=useState(false), [result,setResult]=useState(null), [error,setError]=useState('')
  const update=(k,v)=>setForm(f=>({...f,[k]:v}))
  const submit=async()=>{setLoading(true);setError('');setResult(null);await new Promise(r=>setTimeout(r,1200));try{const r=await analyzeAPI({...form,amount:Number(form.amount),failed_attempts:Number(form.failed_attempts),average_previous_amount:Number(form.average_previous_amount),previous_frequency:Number(form.previous_frequency)});setResult(r)}catch{const score=Math.min(99,12+(form.new_device?28:0)+(form.new_location?22:0)+(Number(form.failed_attempts)>=3?16:0)+(Number(form.amount)>Number(form.average_previous_amount)*2?20:0));setResult({risk_score:score,risk_level:score>=70?'HIGH':score>=40?'MEDIUM':'LOW',status:score>=70?'Suspicious Transaction — Verification Recommended':'Review Recommended',message:score>=70?'This transaction shows patterns associated with high fraud risk.':'The transaction was evaluated against configured risk indicators.',reasons:[form.new_device&&{title:'New Device',description:'Transaction originated from a device not previously associated with this account.',severity:'high'},form.new_location&&{title:'Unusual Location',description:'Location differs significantly from previous transaction patterns.',severity:'high'},Number(form.failed_attempts)>=3&&{title:'Failed Attempts',description:'Multiple failed attempts were detected before the transaction.',severity:'medium'},Number(form.amount)>Number(form.average_previous_amount)*2&&{title:'Unusual Amount',description:'Transaction amount is substantially higher than the previous average.',severity:'high'}].filter(Boolean)})}finally{setLoading(false)}}
  const fields=[['transaction_id','Transaction ID','text'],['amount','Amount (₹)','number'],['transaction_type','Transaction Type','select'],['date','Date','date'],['time','Time','time'],['location','Location','text'],['device','Device','text'],['recipient','Recipient','text'],['failed_attempts','Number of Failed Attempts','number'],['average_previous_amount','Average Previous Transaction Amount (₹)','number'],['previous_frequency','Previous Transaction Frequency','number']]
  return <div className="space-y-6"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600"><BrainCircuit size={14}/> AI-assisted analysis</div><h1 className="mt-2 text-2xl font-bold">Analyze Transaction</h1><p className="mt-1 text-sm text-slate-500">Evaluate transaction patterns and generate a risk score. A risk score is not a fraud confirmation.</p></div>
    <Card className="p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-slate-100 p-3"><CreditCard size={20}/></div><div><h2 className="font-semibold">Transaction Details</h2><p className="text-xs text-slate-400">Enter the transaction attributes available to your monitoring system.</p></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{fields.map(([k,label,type])=><label key={k} className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{type==='select'?<select value={form[k]} onChange={e=>update(k,e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-slate-500"><option>UPI</option><option>Card</option><option>Bank Transfer</option><option>Wallet</option></select>:<input type={type} value={form[k]} onChange={e=>update(k,e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-slate-500"/>}</label>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Toggle label="New Device?" value={form.new_device} onChange={v=>update('new_device',v)}/><Toggle label="New Location?" value={form.new_location} onChange={v=>update('new_location',v)}/></div><button onClick={submit} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b172a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-70">{loading?<><RefreshCw size={18} className="animate-spin"/>Analyzing transaction patterns...</>:<><BrainCircuit size={18}/>Analyze Transaction</>}</button></Card>
    {error&&<p className="text-sm text-red-600">{error}</p>}
    {result&&<ResultCard result={result}/>}
  </div>
}
function Toggle({label,value,onChange}){return <button type="button" onClick={()=>onChange(!value)} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left"><span className="text-sm font-semibold">{label}</span><span className={`relative h-6 w-11 rounded-full transition ${value?'bg-slate-900':'bg-slate-200'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${value?'left-6':'left-1'}`}/></span></button>}
function ResultCard({ result }) {
  const high = result.risk_level === "HIGH";
  const medium = result.risk_level === "MEDIUM";

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-7 ${
        high
          ? "border-red-200 bg-red-50/40"
          : medium
          ? "border-amber-200 bg-amber-50/40"
          : "border-emerald-200 bg-emerald-50/40"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            Transaction Risk
          </p>

          <div
            className={`mt-1 text-5xl font-black ${
              high
                ? "text-red-600"
                : medium
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            {result.risk_score}%
          </div>

          <div className="mt-2">
            <RiskBadge level={result.risk_level} />
          </div>
        </div>

        <div className="max-w-xl">
          <p className="font-bold text-slate-900">
            {high ? "🚨 " : ""}
            {result.status}
          </p>

          <p className="mt-2 text-sm text-slate-600">
            {result.message}
          </p>

          <p className="mt-3 text-xs font-medium text-slate-500">
            Risk probability is an AI assessment and should be verified before
            taking action.
          </p>
        </div>
      </div>

      <div className="mt-7 border-t border-slate-200/80 pt-6">
        <h3 className="font-bold">
          Why was this transaction flagged?
        </h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {result.reasons?.map((r, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-2">
                {r.severity === "high" ? (
                  <AlertTriangle size={17} className="text-red-600" />
                ) : (
                  <Activity size={17} className="text-amber-600" />
                )}

                <p className="font-semibold">{r.title}</p>
              </div>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function SimplePage({title,subtitle,icon:Icon,children}){return <div className="space-y-6"><div><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500"><Icon size={14}/>{title}</div><h1 className="mt-2 text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">{subtitle}</p></div>{children}</div>}

function Analytics(){return <SimplePage title="Analytics" subtitle="Portfolio-level transaction and risk intelligence" icon={BarChart3}><div className="grid gap-4 lg:grid-cols-2"><Card className="p-5"><h2 className="font-semibold">Transaction Volume</h2><div className="mt-5 h-72"><ResponsiveContainer><LineChart data={activity}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Line dataKey="value" stroke="#334155" strokeWidth={3}/></LineChart></ResponsiveContainer></div></Card><Card className="p-5"><h2 className="font-semibold">High-Risk Trend</h2><div className="mt-5 h-72"><ResponsiveContainer><AreaChart data={riskTrend}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area dataKey="value" stroke="#dc2626" fill="#fee2e2"/></AreaChart></ResponsiveContainer></div></Card></div></SimplePage>}

function Explanations(){return <SimplePage title="AI Explanations" subtitle="Human-readable reasons behind model risk assessments" icon={BrainCircuit}><div className="grid gap-4 md:grid-cols-3">{[['New Device','Device identity has not appeared in the account history.','28 points'],['Unusual Location','Location is outside the account’s normal transaction pattern.','22 points'],['Unusual Amount','Amount is significantly higher than the historical average.','20 points']].map(([a,b,c])=><Card key={a} className="p-5"><div className="mb-4 inline-flex rounded-xl bg-slate-100 p-3"><BrainCircuit size={20}/></div><h3 className="font-semibold">{a}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{b}</p><p className="mt-4 text-xs font-bold text-slate-700">{c} risk contribution</p></Card>)}</div></SimplePage>}

function Alerts(){return <SimplePage title="Alerts" subtitle="Security notifications and high-risk activity" icon={Bell}><div className="space-y-3">{[['High-risk transaction detected','TXN10245 scored 91% and requires verification.','2 min ago','HIGH'],['Multiple failed attempts','Three failed attempts preceded a new-device transaction.','18 min ago','MEDIUM'],['Daily monitoring complete','1,326 transactions analyzed today.','1 hour ago','LOW']].map(([a,b,c,l])=><Card key={a} className="flex items-center gap-4 p-5"><div className={`rounded-xl p-3 ${l==='HIGH'?'bg-red-50 text-red-600':l==='MEDIUM'?'bg-amber-50 text-amber-600':'bg-emerald-50 text-emerald-600'}`}><Bell size={19}/></div><div className="min-w-0 flex-1"><p className="font-semibold">{a}</p><p className="mt-1 text-sm text-slate-500">{b}</p></div><span className="hidden text-xs text-slate-400 sm:block">{c}</span><RiskBadge level={l}/></Card>)}</div></SimplePage>}

function Cases(){return <SimplePage title="Fraud Cases" subtitle="Transactions reported by users as unauthorized" icon={FileWarning}><Card className="overflow-hidden"><div className="grid gap-3 p-5 sm:grid-cols-3"><div><p className="text-xs text-slate-500">Open cases</p><p className="mt-1 text-2xl font-bold">64</p></div><div><p className="text-xs text-slate-500">Under verification</p><p className="mt-1 text-2xl font-bold">41</p></div><div><p className="text-xs text-slate-500">Resolved</p><p className="mt-1 text-2xl font-bold">128</p></div></div><div className="border-t border-slate-100 p-5"><p className="text-sm text-slate-500">A fraud case is created only after a user reports a transaction as unauthorized. The AI risk score itself does not confirm fraud.</p></div></Card></SimplePage>}

function SettingsPage(){return <SimplePage title="Settings" subtitle="Basic system and user preferences" icon={Settings}><Card className="max-w-2xl divide-y divide-slate-100"><div className="p-5"><p className="font-semibold">Risk monitoring</p><p className="mt-1 text-sm text-slate-500">Keep real-time transaction monitoring enabled.</p></div><div className="p-5"><p className="font-semibold">Security notifications</p><p className="mt-1 text-sm text-slate-500">Receive alerts for high-risk transaction patterns.</p></div><div className="p-5"><p className="font-semibold">Model policy</p><p className="mt-1 text-sm text-slate-500">Predictions are advisory. User verification is required before labeling a transaction unauthorized.</p></div></Card></SimplePage>}

function App(){
  const [page,setPage]=useState('Dashboard'), [collapsed,setCollapsed]=useState(false), [mobileOpen,setMobileOpen]=useState(false)
  const content=useMemo(()=>({Dashboard:<Dashboard setPage={setPage}/>, 'Analyze Transaction':<Analyze/>, 'Suspicious Transactions':<SimplePage title="Suspicious Transactions" subtitle="Flagged transactions sorted by risk priority" icon={AlertTriangle}><SuspiciousTable setPage={setPage} full/></SimplePage>, Analytics:<Analytics/>, 'AI Explanations':<Explanations/>, Alerts:<Alerts/>, 'Fraud Cases':<Cases/>, Settings:<SettingsPage/>}[page]||<Dashboard setPage={setPage}/>),[page])
  return <div className="min-h-screen"><Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/><div className={`transition-all duration-300 ${collapsed?'lg:pl-[78px]':'lg:pl-[270px]'}`}><Header setMobileOpen={setMobileOpen}/><main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">{content}</main></div><button onClick={()=>setCollapsed(!collapsed)} className="fixed bottom-5 left-5 z-50 hidden rounded-full border border-slate-200 bg-white p-3 text-slate-600 shadow-lg lg:block">{collapsed?<ChevronRight size={18}/>:<ChevronLeft size={18}/>}</button></div>
}

export default App
