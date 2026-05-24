/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// Drone SVG component
// ============================================================
const Drone = ({ size = 200 }) => (
  <svg viewBox="0 0 200 200" width={size} height={size}>
    {/* Arms (X frame) */}
    <g stroke="#1a1a1a" strokeWidth="1.5" fill="#222">
      <rect x="48" y="48" width="104" height="14" transform="rotate(45 100 100)" rx="2"/>
      <rect x="48" y="48" width="104" height="14" transform="rotate(-45 100 100)" rx="2"/>
    </g>
    {/* Central body */}
    <g>
      <rect x="68" y="68" width="64" height="64" rx="6" fill="#0e0e0e" stroke="#DA1F26" strokeWidth="1"/>
      <rect x="76" y="76" width="48" height="48" rx="3" fill="#1a1a1a"/>
      <circle cx="100" cy="100" r="8" fill="#DA1F26"/>
      <circle cx="100" cy="100" r="3" fill="#0a0a0a"/>
      {/* Camera */}
      <rect x="86" y="60" width="28" height="14" rx="2" fill="#0a0a0a" stroke="#DA1F26" strokeWidth="0.6"/>
      <circle cx="100" cy="67" r="3.5" fill="#1a1a1a"/>
      <circle cx="100" cy="67" r="1.5" fill="#DA1F26"/>
      {/* Status LEDs */}
      <circle cx="82" cy="100" r="1.5" fill="#2E8B4A"/>
      <circle cx="118" cy="100" r="1.5" fill="#DA1F26"/>
    </g>
    {/* Motor mounts */}
    {[[32, 32], [168, 32], [32, 168], [168, 168]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r="14" fill="#0a0a0a" stroke="#2a2a2a" strokeWidth="1"/>
        <circle cx={x} cy={y} r="4" fill="#1a1a1a"/>
      </g>
    ))}
    {/* Rotors (spinning) */}
    {[[32, 32, 'cw'], [168, 32, 'ccw'], [32, 168, 'ccw'], [168, 168, 'cw']].map(([x, y, dir], i) => (
      <g key={`r${i}`} className={`rotor ${dir}`} style={{ transformOrigin: `${x}px ${y}px` }}>
        <ellipse cx={x} cy={y} rx="22" ry="2.5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5"/>
        <ellipse cx={x} cy={y} rx="2.5" ry="22" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5"/>
      </g>
    ))}
  </svg>
);

// ============================================================
// Reticle (center crosshair)
// ============================================================
const Reticle = () => (
  <svg viewBox="0 0 200 200">
    <g stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" fill="none">
      <circle cx="100" cy="100" r="60"/>
      <circle cx="100" cy="100" r="90"/>
      <line x1="100" y1="20" x2="100" y2="40"/>
      <line x1="100" y1="160" x2="100" y2="180"/>
      <line x1="20" y1="100" x2="40" y2="100"/>
      <line x1="160" y1="100" x2="180" y2="100"/>
    </g>
    <g stroke="#DA1F26" strokeWidth="1.2" fill="none">
      <line x1="100" y1="60" x2="100" y2="70"/>
      <line x1="100" y1="130" x2="100" y2="140"/>
      <line x1="60" y1="100" x2="70" y2="100"/>
      <line x1="130" y1="100" x2="140" y2="100"/>
    </g>
    <circle cx="100" cy="100" r="1.5" fill="#DA1F26"/>
  </svg>
);

// ============================================================
// Mountain horizon SVG (parallax-able)
// ============================================================
const Horizon = () => (
  <svg viewBox="0 0 1600 400" preserveAspectRatio="none">
    <defs>
      <linearGradient id="m1" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#1a0c10"/>
        <stop offset="1" stopColor="#0a0a0a"/>
      </linearGradient>
      <linearGradient id="m2" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#2a0e12"/>
        <stop offset="1" stopColor="#150506"/>
      </linearGradient>
    </defs>
    {/* Far range */}
    <path d="M0,300 L120,200 L220,240 L340,160 L440,210 L560,180 L680,230 L820,170 L960,220 L1100,180 L1240,240 L1380,200 L1500,230 L1600,210 L1600,400 L0,400 Z" fill="url(#m1)" opacity="0.7"/>
    {/* Near range */}
    <path d="M0,360 L80,300 L180,340 L300,280 L420,320 L540,290 L660,340 L780,300 L900,330 L1040,290 L1180,330 L1320,310 L1460,340 L1600,320 L1600,400 L0,400 Z" fill="url(#m2)"/>
    {/* Ground glow */}
    <rect x="0" y="380" width="1600" height="20" fill="url(#m1)" opacity="0.5"/>
  </svg>
);

// ============================================================
// Officer portrait silhouette
// ============================================================
const PortraitSilhouette = ({ seed = 1 }) => {
  // simple parameterized silhouette
  const cfg = [
    { skin: '#d8c4a8', shirt: '#9b3a3a' },
    { skin: '#c8a37c', shirt: '#2a3a55' },
    { skin: '#e0c4a2', shirt: '#3a3a3a' },
    { skin: '#b8946a', shirt: '#5a3a2a' },
  ][seed % 4];
  return (
    <svg viewBox="0 0 200 240">
      <rect width="200" height="240" fill="none"/>
      <ellipse cx="100" cy="92" rx="38" ry="44" fill={cfg.skin}/>
      <path d={`M 100 130 C 60 130 38 180 38 240 L 162 240 C 162 180 140 130 100 130 Z`} fill={cfg.shirt}/>
      {/* subtle face features */}
      <ellipse cx="86" cy="90" rx="2.5" ry="3" fill="#2a2a2a"/>
      <ellipse cx="114" cy="90" rx="2.5" ry="3" fill="#2a2a2a"/>
      <path d="M 90 108 Q 100 114 110 108" stroke="#2a2a2a" strokeWidth="1.2" fill="none"/>
    </svg>
  );
};

// ============================================================
// NAV
// ============================================================
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? '' : 'is-dark'}`}>
      <a href="#top" className="nav-logo">
        <span className="mark">
          <svg viewBox="0 0 28 28" width="28" height="28">
            <rect x="0.5" y="0.5" width="27" height="27" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="6" cy="6" r="2.5" fill="#DA1F26"/>
            <circle cx="22" cy="6" r="2.5" fill="currentColor"/>
            <circle cx="6" cy="22" r="2.5" fill="currentColor"/>
            <circle cx="22" cy="22" r="2.5" fill="#DA1F26"/>
            <line x1="6" y1="6" x2="22" y2="22" stroke="currentColor"/>
            <line x1="22" y1="6" x2="6" y2="22" stroke="currentColor"/>
            <circle cx="14" cy="14" r="3" fill="currentColor"/>
          </svg>
        </span>
        <span>UCDC</span>
      </a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#events">Events</a>
        <a href="#gallery">Gallery</a>
        <a href="#builds">Build Log</a>
        <a href="#sponsors">Sponsors</a>
        <a href="#join">Join</a>
      </div>
      <div className="nav-cta">
        <span className="nav-status">Fleet online</span>
        <a href="#join" className="btn btn--red">Apply</a>
      </div>
    </nav>
  );
};

// ============================================================
// HERO with FPV scroll effect + flying drone
// ============================================================
const Hero = () => {
  const [scroll, setScroll] = useState(0);
  const [tick, setTick] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const h = window.innerHeight;
      // 0 when hero top is at viewport top; grows as scrolled past
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - h + 1)));
      setScroll(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live telemetry tick
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 600);
    return () => clearInterval(id);
  }, []);

  // Telemetry values that drift based on scroll + tick
  const altitude = (122 + scroll * 84 + Math.sin(tick / 3) * 1.4).toFixed(1);
  const speed = (18.4 + scroll * 12 + Math.sin(tick / 2.1) * 0.6).toFixed(1);
  const bearing = ((242 + scroll * 18 + Math.sin(tick / 5) * 2) % 360).toFixed(0).padStart(3, '0');
  const battery = (88 - Math.floor(tick / 60) % 6 - scroll * 4).toFixed(0);
  const sats = 14 + (tick % 3);
  const lat = '38.5382';
  const lon = '−121.7617';
  const sig = (-58 - Math.floor(scroll * 6)).toFixed(0);

  // Drone flight path: starts upper-left, traces curve down/right as scroll progresses
  const droneX = 10 + scroll * 70; // % of viewport width
  const droneY = 20 + scroll * 45 + Math.sin(scroll * 6) * 4; // % of viewport height
  const droneRot = -8 + scroll * 28;
  const droneScale = 0.85 + scroll * 0.3;

  return (
    <header className="hero" id="top" ref={heroRef} data-screen-label="01 Hero">
      <div className="hero-sky"/>
      <div className="hero-stars" style={{ transform: `translateY(${-scroll * 40}px)` }}/>
      <div className="hero-grid" style={{ transform: `translateY(${-scroll * 60}px)` }}/>
      <div className="hero-horizon" style={{ transform: `translate(${-scroll * 80}px, ${scroll * 30}px)` }}>
        <Horizon/>
      </div>

      {/* HUD corners */}
      <div className="hud hud-tl">
        <div className="hud-row"><span className="lbl">FEED</span><span className="val red">●REC</span><span className="val">04:21:08</span></div>
        <div className="hud-row"><span className="lbl">CAM</span><span className="val">FPV-01 / 4K60</span></div>
        <div className="hud-row"><span className="lbl">SIG</span><span className="val">{sig}dBm</span><span className="val">SAT {sats}</span></div>
      </div>
      <div className="hud hud-tr">
        <div className="hud-row"><span className="lbl">UCDC</span><span className="val">UAV-007 “WILDCAT”</span></div>
        <div className="hud-row"><span className="lbl">MODE</span><span className="val">ACRO</span><span className="lbl">PILOT</span><span className="val">J. RIVERA</span></div>
        <div className="hud-row"><span className="lbl">FAA</span><span className="val">PART 107 ✓</span></div>
      </div>
      <div className="hud hud-bl">
        <div className="hud-row"><span className="lbl">LAT</span><span className="val">{lat}°N</span></div>
        <div className="hud-row"><span className="lbl">LON</span><span className="val">{lon}°W</span></div>
        <div className="hud-row"><span className="lbl">FIELD</span><span className="val">RUSSELL RANCH — PAD A</span></div>
      </div>
      <div className="hud hud-br">
        <div className="hud-row"><span className="lbl">BAT</span><span className="val red">{battery}%</span><span className="lbl">CELLS</span><span className="val">6S / 22.8V</span></div>
        <div className="hud-row"><span className="lbl">TEMP</span><span className="val">42°C</span><span className="lbl">RPM</span><span className="val">14,820</span></div>
        <div className="hud-row"><span className="lbl">WIND</span><span className="val">7.2 kt / 264°</span></div>
      </div>

      {/* Reticle (only visible faintly) */}
      <div className="reticle" style={{ opacity: 0.3 + scroll * 0.35, transform: `translate(-50%, -50%) scale(${1 + scroll * 0.4})` }}>
        <Reticle/>
      </div>

      {/* Drone */}
      <div className="drone-wrap" style={{
        left: `${droneX}%`,
        top: `${droneY}%`,
        transform: `translate(-50%, -50%) rotate(${droneRot}deg) scale(${droneScale})`,
      }}>
        <div className="drone">
          <Drone/>
          <div className="drone-target">
            <svg viewBox="0 0 240 240">
              <g stroke="#DA1F26" strokeWidth="1.2" fill="none">
                <path d="M 10 30 L 10 10 L 30 10"/>
                <path d="M 210 10 L 230 10 L 230 30"/>
                <path d="M 230 210 L 230 230 L 210 230"/>
                <path d="M 30 230 L 10 230 L 10 210"/>
              </g>
              <text x="14" y="22">TRK · UAV-007</text>
              <text x="14" y="225">LOCK</text>
              <text x="180" y="225" textAnchor="end">D 42.6m</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="hero-inner">
        {/* spacer top */}
        <div/>

        <div className="hero-copy">
          <div>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
              <span style={{ color: '#fff' }}>UC DRONE CLUB · UC · EST. 2026</span>
            </div>
            <h1 className="hero-title">
              <div className="row">FLY <span className="accent">FAST.</span></div>
              <div className="row">BUILD <span className="outline">BOLD.</span></div>
              <div className="row"><span className="accent">WIN</span> LOUDER.</div>
            </h1>
          </div>
          <div>
            <p className="hero-sub">
              We are a registered student organization at UC designing, building, and racing autonomous and FPV drones. From sub-250g whoops to full carbon X-class racers — we ship hardware, win competitions, and train the next class of FAA‑certified pilots.
            </p>
            <div className="hero-actions">
              <a href="#join" className="btn">Apply for Fall 2026 <span className="arrow">→</span></a>
              <a href="#sponsors" className="btn btn--ghost">Partner with us</a>
            </div>
          </div>
        </div>

        <div className="hero-strip">
          <div className="cell"><span className="l">Active members</span><span className="v">142</span></div>
          <div className="cell"><span className="l">Aircraft in fleet</span><span className="v">37</span></div>
          <div className="cell"><span className="l">Logged flight hours / yr</span><span className="v">1,284</span></div>
          <div className="cell"><span className="l">Pt‑107 pilots</span><span className="v">28</span></div>
        </div>
      </div>

      <div className="scroll-cue">
        <span>SCROLL · DESCEND</span>
        <span className="bar"/>
      </div>
    </header>
  );
};

window.Drone = Drone;
window.PortraitSilhouette = PortraitSilhouette;
window.Nav = Nav;
window.Hero = Hero;
