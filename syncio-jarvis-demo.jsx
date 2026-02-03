import { useState, useEffect, useRef, useCallback } from "react";

// ─── Animated Number Counter ───
function AnimCounter({ target, duration = 2000, prefix = "", suffix = "", decimals = 0 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{prefix}{decimals ? val.toFixed(decimals) : Math.floor(val)}{suffix}</span>;
}

// ─── Pulsing Orb ───
function PulseOrb({ color = "#D4A843", size = 8, delay = 0 }) {
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full" style={{
        backgroundColor: color, opacity: 0.8,
        animation: `pulse-glow 2s ease-in-out ${delay}s infinite`
      }} />
      <span className="absolute rounded-full" style={{
        inset: -size * 0.6, backgroundColor: color, opacity: 0.15,
        animation: `pulse-glow 2s ease-in-out ${delay}s infinite`,
        filter: `blur(${size}px)`
      }} />
    </span>
  );
}

// ─── HUD Corner Brackets ───
function HUDBrackets({ children, color = "#D4A843", className = "" }) {
  const c = color;
  return (
    <div className={`relative ${className}`} style={{ padding: "2px" }}>
      <svg className="absolute top-0 left-0 w-5 h-5" viewBox="0 0 20 20"><path d="M0 8 L0 0 L8 0" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" /></svg>
      <svg className="absolute top-0 right-0 w-5 h-5" viewBox="0 0 20 20"><path d="M12 0 L20 0 L20 8" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" /></svg>
      <svg className="absolute bottom-0 left-0 w-5 h-5" viewBox="0 0 20 20"><path d="M0 12 L0 20 L8 20" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" /></svg>
      <svg className="absolute bottom-0 right-0 w-5 h-5" viewBox="0 0 20 20"><path d="M12 20 L20 20 L20 12" fill="none" stroke={c} strokeWidth="1.5" opacity="0.6" /></svg>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ─── Scan Line Effect ───
function ScanLine() {
  return <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden",
    background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,168,67,0.015) 2px, rgba(212,168,67,0.015) 4px)"
  }}>
    <div style={{
      position: "absolute", left: 0, right: 0, height: "2px", top: 0,
      background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.3) 50%, transparent 100%)",
      animation: "scanline 4s linear infinite"
    }} />
  </div>;
}

// ─── Particle Field Background ───
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = c.offsetWidth;
    let h = c.height = c.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, a: Math.random() * 0.4 + 0.1
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,67,${p.a})`; ctx.fill();
        particles.slice(i + 1).forEach(q => {
          const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(212,168,67,${0.08 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />;
}

// ─── Atlanta Map with Glowing Points ───
function AtlantaMap() {
  const leads = [
    { x: 52, y: 38, score: 87, name: "Peachtree Ins." },
    { x: 35, y: 52, score: 74, name: "Metro PM Group" },
    { x: 68, y: 45, score: 91, name: "Decatur Coverage" },
    { x: 44, y: 62, score: 65, name: "Southside Roofing" },
    { x: 58, y: 28, score: 82, name: "Buckhead Financial" },
    { x: 28, y: 40, score: 78, name: "Marietta Ins Co." },
    { x: 72, y: 58, score: 69, name: "Stone Mtn Props" },
    { x: 48, y: 48, score: 95, name: "Midtown Agencies" },
    { x: 62, y: 68, score: 71, name: "Conyers Mgmt" },
    { x: 38, y: 32, score: 84, name: "Smyrna Insurance" },
    { x: 55, y: 55, score: 76, name: "East Point Svcs" },
    { x: 42, y: 72, score: 63, name: "Fayette Roofing" },
  ];
  const [active, setActive] = useState(null);
  const [scan, setScan] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setScan(s => (s + 1) % 100), 40);
    return () => clearInterval(t);
  }, []);
  const getColor = (s) => s >= 80 ? "#22C55E" : s >= 60 ? "#D4A843" : "#3B82F6";
  return (
    <div className="relative w-full" style={{ aspectRatio: "1.3" }}>
      {/* Map grid */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {/* Grid */}
        {Array.from({ length: 11 }, (_, i) => <line key={`h${i}`} x1="0" y1={i*10} x2="100" y2={i*10} stroke="rgba(212,168,67,0.06)" strokeWidth="0.3" />)}
        {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i*10} y1="0" x2={i*10} y2="100" stroke="rgba(212,168,67,0.06)" strokeWidth="0.3" />)}
        {/* Radar sweep */}
        <circle cx="50" cy="50" r={scan * 0.5} fill="none" stroke="rgba(212,168,67,0.08)" strokeWidth="0.5" />
        {/* Highway lines */}
        <path d="M50 10 Q48 30 50 50 Q52 70 48 90" fill="none" stroke="rgba(212,168,67,0.1)" strokeWidth="0.8" strokeDasharray="2 2" />
        <path d="M15 50 Q30 48 50 50 Q70 52 90 48" fill="none" stroke="rgba(212,168,67,0.1)" strokeWidth="0.8" strokeDasharray="2 2" />
        <path d="M20 20 Q35 35 50 50 Q65 65 80 80" fill="none" stroke="rgba(212,168,67,0.08)" strokeWidth="0.6" strokeDasharray="2 2" />
        {/* Perimeter ring */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(212,168,67,0.08)" strokeWidth="0.4" strokeDasharray="3 6" />
        <text x="50" y="50" textAnchor="middle" fill="rgba(212,168,67,0.15)" fontSize="3" fontFamily="monospace">ATLANTA</text>
        {/* Lead dots */}
        {leads.map((l, i) => (
          <g key={i} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} style={{ cursor: "pointer" }}>
            <circle cx={l.x} cy={l.y} r="4" fill={getColor(l.score)} opacity="0.1">
              <animate attributeName="r" values="3;6;3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.15;0.05;0.15" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={l.x} cy={l.y} r="1.5" fill={getColor(l.score)} opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.5;0.9" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
            </circle>
            {active === i && <>
              <rect x={l.x + 3} y={l.y - 8} width="28" height="10" rx="1" fill="rgba(10,10,10,0.9)" stroke={getColor(l.score)} strokeWidth="0.3" />
              <text x={l.x + 5} y={l.y - 3} fill="#F5F5F5" fontSize="2.8" fontFamily="monospace">{l.name}</text>
              <text x={l.x + 5} y={l.y + 0.5} fill={getColor(l.score)} fontSize="2.2" fontFamily="monospace">Score: {l.score}</text>
            </>}
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Live Activity Feed ───
function LiveFeed() {
  const messages = [
    { type: "scan", text: "Agent: Metro Atlanta Insurance scanning Google Maps...", t: 0 },
    { type: "found", text: "3 new insurance agencies identified in Buckhead", t: 2000 },
    { type: "score", text: "Peachtree Insurance Group scored 87 — flagged HOT", t: 3500 },
    { type: "scan", text: "Agent: Property Management scanning Decatur area...", t: 5500 },
    { type: "found", text: "5 property management firms found in DeKalb County", t: 7000 },
    { type: "signal", text: "Pain signal detected: 'billing errors' in 4 reviews — Metro PM Group", t: 8500 },
    { type: "score", text: "Midtown Agencies LLC scored 95 — highest today", t: 10000 },
    { type: "scan", text: "Agent: Roofing scanning Metro Atlanta...", t: 12000 },
    { type: "found", text: "2 new roofing contractors in Gwinnett County", t: 13500 },
    { type: "signal", text: "Pain signal detected: 'spreadsheet' + 'manual process' — Conyers Mgmt", t: 15000 },
    { type: "score", text: "Decatur Coverage Partners scored 91 — flagged HOT", t: 17000 },
    { type: "found", text: "Pipeline: 4 leads promoted to Qualified this session", t: 19000 },
  ];
  const [visible, setVisible] = useState([]);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % messages.length;
        setVisible(v => [messages[next], ...v].slice(0, 6));
        return next;
      });
    }, 2500);
    return () => clearInterval(t);
  }, []);
  const iconMap = {
    scan: "◎", found: "◆", score: "★", signal: "⚠"
  };
  const colorMap = {
    scan: "#3B82F6", found: "#22C55E", score: "#D4A843", signal: "#EF4444"
  };
  return (
    <div className="space-y-1" style={{ minHeight: 160 }}>
      {visible.map((m, i) => (
        <div key={`${m.t}-${i}`} className="flex items-start gap-2 py-1.5 px-2 rounded" style={{
          opacity: 1 - i * 0.13, animation: "feed-in 0.5s ease-out",
          background: i === 0 ? "rgba(212,168,67,0.04)" : "transparent"
        }}>
          <span style={{ color: colorMap[m.type], fontSize: 11, marginTop: 2 }}>{iconMap[m.type]}</span>
          <span style={{ color: i === 0 ? "#F5F5F5" : "#6B7280", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.4 }}>{m.text}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Mini Score Bar Chart ───
function ScoreChart() {
  const data = [
    { range: "90+", count: 8, color: "#22C55E" },
    { range: "70-89", count: 15, color: "#D4A843" },
    { range: "50-69", count: 22, color: "#3B82F6" },
    { range: "30-49", count: 12, color: "#6B7280" },
    { range: "<30", count: 5, color: "#374151" },
  ];
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="space-y-2">
      {data.map((d, i) => (
        <div key={d.range} className="flex items-center gap-2">
          <span style={{ width: 36, fontSize: 9, color: "#6B7280", fontFamily: "monospace", textAlign: "right" }}>{d.range}</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="h-full rounded-full" style={{
              width: `${(d.count / max) * 100}%`, background: d.color, opacity: 0.7,
              animation: `bar-grow 1.5s ease-out ${i * 0.2}s both`
            }} />
          </div>
          <span style={{ width: 20, fontSize: 10, color: d.color, fontFamily: "monospace" }}>{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Agent Status Ring ───
function AgentRing({ name, status, leads, color }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setProgress(leads), 500);
    return () => clearTimeout(t);
  }, [leads]);
  const r = 28, c = 2 * Math.PI * r, offset = c - (progress / 100) * c;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: 70, height: 70 }}>
        <svg viewBox="0 0 70 70" className="w-full h-full">
          <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            transform="rotate(-90 35 35)" style={{ transition: "stroke-dashoffset 2s ease-out" }}>
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "monospace" }}>{leads}</span>
          <span style={{ fontSize: 7, color: "#6B7280" }}>LEADS</span>
        </div>
      </div>
      <span style={{ fontSize: 9, color: "#9CA3AF", fontFamily: "monospace", textAlign: "center", maxWidth: 80 }}>{name}</span>
      <span className="flex items-center gap-1">
        <PulseOrb color={status === "active" ? "#22C55E" : "#6B7280"} size={5} />
        <span style={{ fontSize: 8, color: status === "active" ? "#22C55E" : "#6B7280", textTransform: "uppercase", fontFamily: "monospace" }}>{status}</span>
      </span>
    </div>
  );
}

// ─── SYNC AI Status ───
function SyncAI() {
  const phrases = [
    "Monitoring Metro Atlanta for lead signals...",
    "3 agents active. Next scheduled scan: 06:00 EST.",
    "12 hot leads identified today. 4 promoted to qualified.",
    "Pain signal clustering detected in insurance vertical.",
    "Outscraper API: 847 of 1,000 credits remaining.",
    "Scanning Gwinnett County for roofing contractors...",
    "Anomaly: 40% score increase in property management leads.",
    "Pipeline health: strong. Conversion rate: 18.4%.",
  ];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const phrase = phrases[idx];
    let i = 0;
    setTyping(true); setText("");
    const typeTimer = setInterval(() => {
      if (i <= phrase.length) { setText(phrase.slice(0, i)); i++; }
      else { clearInterval(typeTimer); setTyping(false);
        setTimeout(() => setIdx(n => (n + 1) % phrases.length), 3000);
      }
    }, 35);
    return () => clearInterval(typeTimer);
  }, [idx]);

  return (
    <div className="flex items-start gap-3">
      <div className="relative flex-shrink-0" style={{ width: 32, height: 32 }}>
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <circle cx="16" cy="16" r="14" fill="none" stroke="#D4A843" strokeWidth="1" opacity="0.3" />
          <circle cx="16" cy="16" r="10" fill="none" stroke="#D4A843" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 3">
            <animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="16" cy="16" r="4" fill="#D4A843" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ fontSize: 10, fontWeight: 700, color: "#D4A843", fontFamily: "monospace", letterSpacing: 2 }}>SYNC</span>
          <PulseOrb color="#D4A843" size={4} />
        </div>
        <p style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, minHeight: 18 }}>
          {text}{typing && <span style={{ color: "#D4A843", animation: "blink 0.8s infinite" }}>▍</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───
export default function JarvisDashboard() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      background: "radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.03) 0%, #050505 50%, #030303 100%)",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Orbitron:wght@400;500;700;900&display=swap');
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes scanline { 0% { top: -2px; } 100% { top: 100%; } }
        @keyframes feed-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bar-grow { from { width: 0%; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow-border { 0%,100% { border-color: rgba(212,168,67,0.15); } 50% { border-color: rgba(212,168,67,0.3); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(212,168,67,0.2); border-radius: 2px; }
      `}</style>

      <ParticleField />
      <ScanLine />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4" style={{ animation: "fade-up 1s ease-out" }}>
        {/* ─── Top Bar ─── */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div style={{ animation: "float 3s ease-in-out infinite" }}>
              <svg width="32" height="32" viewBox="0 0 32 32">
                <polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="none" stroke="#D4A843" strokeWidth="1.2" opacity="0.6" />
                <polygon points="16,6 24,12 24,20 16,26 8,20 8,12" fill="rgba(212,168,67,0.05)" stroke="#D4A843" strokeWidth="0.5" opacity="0.4" />
                <circle cx="16" cy="16" r="3" fill="#D4A843" opacity="0.6">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span style={{ color: "#D4A843", fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>&lt;sync</span>
                <span style={{ color: "#6B7280", fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: 14 }}>IO</span>
                <span style={{ color: "#D4A843", fontFamily: "Orbitron, monospace", fontWeight: 700, fontSize: 14 }}>/&gt;</span>
                <span style={{ color: "#F5F5F5", fontSize: 13, fontWeight: 500, marginLeft: 6, fontFamily: "Orbitron, monospace", letterSpacing: 2 }}>AGENT HUB</span>
              </div>
              <span style={{ fontSize: 8, color: "#4B5563", letterSpacing: 3, textTransform: "uppercase" }}>AI-Powered Lead Intelligence Platform</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <PulseOrb color="#22C55E" size={6} />
              <span style={{ fontSize: 9, color: "#22C55E", letterSpacing: 1 }}>ALL SYSTEMS NOMINAL</span>
            </div>
            <div className="text-right">
              <div style={{ fontSize: 11, color: "#D4A843", fontFamily: "Orbitron, monospace" }}>{time.toLocaleTimeString()}</div>
              <div style={{ fontSize: 8, color: "#4B5563" }}>{time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</div>
            </div>
          </div>
        </div>

        {/* ─── Stat Row ─── */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {[
            { label: "TOTAL LEADS", value: 62, color: "#3B82F6", icon: "◆" },
            { label: "HOT PROSPECTS", value: 23, color: "#22C55E", icon: "★" },
            { label: "AGENTS ACTIVE", value: 3, color: "#D4A843", icon: "◎" },
            { label: "AVG SCORE", value: 72.4, decimals: 1, color: "#8B5CF6", icon: "△" },
            { label: "THIS WEEK", value: 18, color: "#F59E0B", icon: "↑" },
          ].map((s, i) => (
            <div key={s.label} className="relative" style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,168,67,0.1)",
              borderRadius: 8, padding: "12px 14px",
              animation: `fade-up 0.6s ease-out ${0.1 + i * 0.1}s both, glow-border 4s ease-in-out ${i * 0.5}s infinite`,
              backdropFilter: "blur(10px)"
            }}>
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 8, color: "#4B5563", letterSpacing: 2 }}>{s.label}</span>
                <span style={{ fontSize: 12, color: s.color, opacity: 0.5 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "Orbitron, monospace" }}>
                <AnimCounter target={s.value} duration={2000 + i * 300} decimals={s.decimals || 0} />
              </div>
            </div>
          ))}
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-12 gap-3">
          {/* Left Column — Map */}
          <div className="col-span-5" style={{
            background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,168,67,0.08)",
            borderRadius: 10, padding: 16, animation: "fade-up 0.8s ease-out 0.3s both",
            backdropFilter: "blur(10px)"
          }}>
            <HUDBrackets>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 9, color: "#D4A843", letterSpacing: 2, fontWeight: 700 }}>METRO ATLANTA — LEAD MAP</span>
                <span className="flex items-center gap-1">
                  <PulseOrb color="#22C55E" size={4} />
                  <span style={{ fontSize: 8, color: "#22C55E" }}>LIVE</span>
                </span>
              </div>
              <AtlantaMap />
              <div className="flex justify-center gap-4 mt-3">
                {[
                  { label: "Hot (80+)", color: "#22C55E" },
                  { label: "Warm (60-79)", color: "#D4A843" },
                  { label: "Cool (<60)", color: "#3B82F6" }
                ].map(l => (
                  <span key={l.label} className="flex items-center gap-1">
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, opacity: 0.7 }} />
                    <span style={{ fontSize: 8, color: "#6B7280" }}>{l.label}</span>
                  </span>
                ))}
              </div>
            </HUDBrackets>
          </div>

          {/* Center Column — Feed + AI */}
          <div className="col-span-4 flex flex-col gap-3">
            {/* Live Feed */}
            <div style={{
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,168,67,0.08)",
              borderRadius: 10, padding: 16, flex: 1, animation: "fade-up 0.8s ease-out 0.4s both",
              backdropFilter: "blur(10px)"
            }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 9, color: "#D4A843", letterSpacing: 2, fontWeight: 700 }}>ACTIVITY FEED</span>
                <span className="flex items-center gap-1">
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4A843", animation: "pulse-glow 1.5s infinite" }} />
                  <span style={{ fontSize: 8, color: "#D4A843" }}>STREAMING</span>
                </span>
              </div>
              <LiveFeed />
            </div>

            {/* SYNC AI */}
            <div style={{
              background: "rgba(212,168,67,0.03)", border: "1px solid rgba(212,168,67,0.12)",
              borderRadius: 10, padding: 16, animation: "fade-up 0.8s ease-out 0.5s both",
              backdropFilter: "blur(10px)"
            }}>
              <SyncAI />
            </div>
          </div>

          {/* Right Column — Agents + Scores */}
          <div className="col-span-3 flex flex-col gap-3">
            {/* Agents */}
            <div style={{
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,168,67,0.08)",
              borderRadius: 10, padding: 16, animation: "fade-up 0.8s ease-out 0.5s both",
              backdropFilter: "blur(10px)"
            }}>
              <span style={{ fontSize: 9, color: "#D4A843", letterSpacing: 2, fontWeight: 700 }}>ACTIVE AGENTS</span>
              <div className="flex justify-around mt-4">
                <AgentRing name="Insurance" status="active" leads={78} color="#22C55E" />
                <AgentRing name="Property" status="active" leads={54} color="#D4A843" />
                <AgentRing name="Roofing" status="active" leads={41} color="#3B82F6" />
              </div>
            </div>

            {/* Score Distribution */}
            <div style={{
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,168,67,0.08)",
              borderRadius: 10, padding: 16, flex: 1, animation: "fade-up 0.8s ease-out 0.6s both",
              backdropFilter: "blur(10px)"
            }}>
              <span style={{ fontSize: 9, color: "#D4A843", letterSpacing: 2, fontWeight: 700 }}>SCORE DISTRIBUTION</span>
              <div className="mt-4">
                <ScoreChart />
              </div>
            </div>

            {/* Pipeline */}
            <div style={{
              background: "rgba(255,255,255,0.015)", border: "1px solid rgba(212,168,67,0.08)",
              borderRadius: 10, padding: 16, animation: "fade-up 0.8s ease-out 0.7s both",
              backdropFilter: "blur(10px)"
            }}>
              <span style={{ fontSize: 9, color: "#D4A843", letterSpacing: 2, fontWeight: 700 }}>PIPELINE</span>
              <div className="flex justify-between mt-3">
                {[
                  { label: "NEW", val: 28, color: "#3B82F6" },
                  { label: "REVIEW", val: 15, color: "#D4A843" },
                  { label: "QUAL", val: 12, color: "#22C55E" },
                  { label: "SENT", val: 7, color: "#8B5CF6" },
                ].map((p, i) => (
                  <div key={p.label} className="text-center">
                    <div style={{ fontSize: 18, fontWeight: 700, color: p.color, fontFamily: "Orbitron, monospace" }}>
                      <AnimCounter target={p.val} duration={1500 + i * 200} />
                    </div>
                    <div style={{ fontSize: 7, color: "#6B7280", letterSpacing: 1, marginTop: 2 }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="flex items-center justify-between mt-4 px-4 py-2" style={{
          background: "rgba(255,255,255,0.01)", borderRadius: 8,
          border: "1px solid rgba(212,168,67,0.05)", animation: "fade-up 1s ease-out 0.8s both"
        }}>
          <div className="flex items-center gap-6">
            {[
              { label: "DATABASE", val: "CONNECTED", color: "#22C55E" },
              { label: "REDIS", val: "CONNECTED", color: "#22C55E" },
              { label: "OUTSCRAPER", val: "847 CREDITS", color: "#D4A843" },
              { label: "UPTIME", val: "99.7%", color: "#3B82F6" },
            ].map(s => (
              <span key={s.label} className="flex items-center gap-2">
                <PulseOrb color={s.color} size={4} delay={Math.random()} />
                <span style={{ fontSize: 8, color: "#4B5563", letterSpacing: 1 }}>{s.label}:</span>
                <span style={{ fontSize: 8, color: s.color, fontWeight: 500 }}>{s.val}</span>
              </span>
            ))}
          </div>
          <span style={{ fontSize: 8, color: "#374151", letterSpacing: 1 }}>SyncIO Labs © 2026 · Atlanta, GA</span>
        </div>
      </div>
    </div>
  );
}
