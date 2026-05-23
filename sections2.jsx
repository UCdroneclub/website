/* global React, Section, useEditableList, useEditing, RemoveBtn, AddTile, AddForm */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// GALLERY with lightbox
// ============================================================
const GalleryScene = ({ seed }) => {
  const palettes = [
    ['#3a1f1a', '#7a3a2e', '#d97746'],
    ['#1a2a3a', '#3a5a7a', '#88aacc'],
    ['#1a2a1a', '#3a5a3a', '#8aaa66'],
    ['#2a1a1a', '#5a2a2a', '#aa6644'],
    ['#1a1a2a', '#3a3a5a', '#7a7aaa'],
    ['#3a2a1a', '#7a5a3a', '#cc9966'],
    ['#1a1a1a', '#3a3a3a', '#aaaaaa'],
    ['#2a1a2a', '#5a3a5a', '#aa66aa'],
  ];
  const p = palettes[seed % palettes.length];
  const sky = `linear-gradient(180deg, ${p[0]} 0%, ${p[1]} 45%, ${p[2]} 100%)`;
  return (
    <div className="gtile-bg" style={{ background: sky }}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <circle cx={70 + (seed * 47) % 280} cy={60 + (seed * 23) % 80} r={20 + (seed % 3) * 6} fill={p[2]} opacity="0.35"/>
        <path d={`M0,${180 + (seed % 30)} L${60 + seed*7 % 80},${130 + seed % 40} L${180 + seed*5 % 60},${150} L${280 + seed*3 % 40},${110 + seed % 30} L400,${170} L400,300 L0,300 Z`} fill={p[0]} opacity="0.85"/>
        <path d={`M0,${220} L${100 + seed*11 % 60},${180} L${220},${210} L${340},${190} L400,${210} L400,300 L0,300 Z`} fill={p[0]}/>
        <g transform={`translate(${100 + (seed * 31) % 200}, ${80 + (seed * 17) % 60})`}>
          <rect x="-8" y="-1" width="16" height="2" fill="#0a0a0a"/>
          <rect x="-1" y="-8" width="2" height="16" fill="#0a0a0a"/>
          <circle cx="0" cy="0" r="2" fill="#DA1F26"/>
        </g>
      </svg>
    </div>
  );
};

const GALLERY_DEFAULT = [
  { size: 's-l', cat: 'FPV',       title: 'Russell Ranch \u2014 Golden Hour' },
  { size: 's-m', cat: 'COMP',      title: 'MultiGP West Regional' },
  { size: 's-m', cat: 'BUILD',     title: 'WILDCAT Rev 4 \u2014 Frame Day' },
  { size: 's-w', cat: 'FREESTYLE', title: 'Bainer Rooftop Acro' },
  { size: 's-s', cat: 'TEAM',      title: 'Solder Night Cohort 12' },
  { size: 's-s', cat: 'FPV',       title: 'Lake Berryessa Skim' },
  { size: 's-t', cat: 'CINE',      title: 'Picnic Day Demo' },
  { size: 's-m', cat: 'AUTO',      title: 'Payload Drop \u2014 Pad B' },
  { size: 's-m', cat: 'COMP',      title: 'UCSB Drag Race Final' },
  { size: 's-w', cat: 'NIGHT',     title: 'LED Build-Out \u2014 Tron Night' },
];

const SIZES = ['s-l', 's-m', 's-w', 's-s', 's-t'];

const Gallery = ({ idx, total }) => {
  const { items: gallery, add, remove } = useEditableList('gallery', GALLERY_DEFAULT);
  const { editing } = useEditing();
  const [open, setOpen] = useState(-1);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (open < 0) return;
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowLeft')  setOpen((open - 1 + gallery.length) % gallery.length);
      if (e.key === 'ArrowRight') setOpen((open + 1) % gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, gallery.length]);

  return (
    <Section id="gallery" idx={idx} total={total} label="Gallery"
             title={<>Frames from the air,<br/>shot by our pilots.</>}
             intro={<>Every image below was captured by a UCDC member, in the air, with a drone the pilot built. Tap any frame to view full-bleed.</>}>
      <div className="gallery">
        {gallery.map((g, i) => (
          <div key={i} className={`gtile ${g.size}`} onClick={() => editing ? null : setOpen(i)}>
            <GalleryScene seed={i + 3}/>
            <span className="gtile-num">FRAME {String(i + 1).padStart(3,'0')}</span>
            <span className="gtile-cam"></span>
            <div className="gtile-meta">
              <div className="gtile-title">{g.title}</div>
              <div className="gtile-cat">{g.cat}</div>
            </div>
            <RemoveBtn onClick={() => remove(i)} label="frame"/>
          </div>
        ))}
        {editing && (
          <button className="add-tile shape-portrait" style={{ gridColumn: 'span 3', gridRow: 'span 2' }}
                  onClick={() => setAddOpen(true)}>
            <span className="add-tile-plus">+</span>
            <span className="add-tile-label">Add frame</span>
          </button>
        )}
      </div>

      <div className={`lightbox ${open >= 0 ? 'is-open' : ''}`} onClick={() => setOpen(-1)}>
        {open >= 0 && gallery[open] && (
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-img">
              <GalleryScene seed={open + 3}/>
            </div>
            <div className="lightbox-corners"><span></span><span></span></div>
            <div className="lightbox-meta">
              <span><span className="red">FRAME {String(open + 1).padStart(3,'0')}</span> / {String(gallery.length).padStart(3,'0')}</span>
              <span>{gallery[open].cat}</span>
              <span>{gallery[open].title}</span>
            </div>
          </div>
        )}
        {open >= 0 && (
          <>
            <button className="lightbox-close" onClick={() => setOpen(-1)}>&times;</button>
            <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + gallery.length) % gallery.length); }}>&larr;</button>
            <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % gallery.length); }}>&rarr;</button>
          </>
        )}
      </div>

      <AddForm
        open={addOpen}
        title="Add a gallery frame"
        fields={[
          { name: 'title', label: 'Title',    required: true, placeholder: 'Sunset Run \u2014 Field B' },
          { name: 'cat',   label: 'Category', placeholder: 'FPV / COMP / BUILD / CINE / TEAM' },
          { name: 'size',  label: 'Tile size', type: 'select', options: [
            { value: 's-m', label: 'Medium' },
            { value: 's-l', label: 'Large feature' },
            { value: 's-w', label: 'Wide' },
            { value: 's-s', label: 'Small' },
            { value: 's-t', label: 'Tall' },
          ]},
        ]}
        onCancel={() => setAddOpen(false)}
        onSubmit={(v) => {
          add({ title: v.title, cat: (v.cat || 'FPV').toUpperCase(), size: v.size || 's-m' });
          setAddOpen(false);
        }}
      />
    </Section>
  );
};

// ============================================================
// BUILD LOG
// ============================================================
const BuildScene = ({ seed }) => (
  <div className="build-img-canvas" style={{
    background: 'linear-gradient(160deg, #1a1a1a 0%, #2a1a1a 60%, #3a0e10 100%)',
  }}>
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <pattern id={`g${seed}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="300" fill={`url(#g${seed})`}/>
      <g transform={`translate(200, 150) rotate(${seed * 18})`}>
        <g stroke="#DA1F26" strokeWidth="1" fill="none">
          <line x1="-80" y1="-80" x2="80" y2="80"/>
          <line x1="80" y1="-80" x2="-80" y2="80"/>
          <rect x="-30" y="-30" width="60" height="60" rx="3"/>
          <circle cx="-80" cy="-80" r="15"/>
          <circle cx="80" cy="-80" r="15"/>
          <circle cx="80" cy="80" r="15"/>
          <circle cx="-80" cy="80" r="15"/>
        </g>
        <g fill="rgba(218,31,38,0.2)" stroke="#DA1F26" strokeWidth="0.5">
          <circle cx="-80" cy="-80" r="22"/>
          <circle cx="80" cy="-80" r="22"/>
          <circle cx="80" cy="80" r="22"/>
          <circle cx="-80" cy="80" r="22"/>
        </g>
        <circle cx="0" cy="0" r="6" fill="#DA1F26"/>
      </g>
      <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.5">
        <line x1="200" y1="0" x2="200" y2="300"/>
        <line x1="0" y1="150" x2="400" y2="150"/>
      </g>
    </svg>
  </div>
);

const BUILDS_DEFAULT = [
  {
    bid: 'WC-05', name: 'WILDCAT Rev 5', status: 'active', statusLabel: 'IN BUILD',
    desc: 'Our flagship 6\u2033 race frame. Carbon arms, T-mount motors, F7 stack. Designed in-house, milled at the EBII shop.',
    progress: 64,
    spec1Label: 'WEIGHT',  spec1Value: '548g',
    spec2Label: 'PROP',    spec2Value: '6\u2033 / 3-blade',
    spec3Label: 'POWER',   spec3Value: '6S / 1300mAh',
    spec4Label: 'TOP V',   spec4Value: '142mph',
  },
  {
    bid: 'KT-02', name: 'KESTREL Mk II', status: 'testing', statusLabel: 'TUNING',
    desc: 'Autonomous payload platform for the Sprint comp. ROS2 stack, RTK GPS, 1kg cargo capacity. Currently tuning landing PID.',
    progress: 88,
    spec1Label: 'WEIGHT',   spec1Value: '2.1kg',
    spec2Label: 'PROP',     spec2Value: '10\u2033 / 2-blade',
    spec3Label: 'PAYLOAD',  spec3Value: '1.0kg',
    spec4Label: 'AUTONOMY', spec4Value: 'ROS2 / RTK',
  },
  {
    bid: 'WH-12', name: 'WHISKER Cohort Kit', status: 'complete', statusLabel: 'SHIPPING',
    desc: 'Sub-250g tinywhoop kit \u2014 the build every new member starts with. We assemble cohorts of 24 at a time. Cohort 12 ships this Friday.',
    progress: 100,
    spec1Label: 'WEIGHT',  spec1Value: '32g',
    spec2Label: 'PROP',    spec2Value: '1.6\u2033 / 4-blade',
    spec3Label: 'POWER',   spec3Value: '1S / 450mAh',
    spec4Label: 'COHORT',  spec4Value: '24 units',
  },
];

const Builds = ({ idx, total }) => {
  const { items: builds, add, remove } = useEditableList('builds', BUILDS_DEFAULT);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <Section id="builds" idx={idx} total={total} label="Build Log"
             title={<>Active airframes<br/>in the hangar.</>}
             intro={<>Every UCDC aircraft is documented end-to-end: BOM, CAD, tune file, and the maiden crash report. Members can fork any design.</>}>
      <div className="builds">
        {builds.map((b, i) => {
          const specs = [
            [b.spec1Label, b.spec1Value], [b.spec2Label, b.spec2Value],
            [b.spec3Label, b.spec3Value], [b.spec4Label, b.spec4Value],
          ].filter(([k, v]) => k && v);
          const progress = Math.max(0, Math.min(100, parseInt(b.progress, 10) || 0));
          return (
            <div className="build" key={`${b.bid}-${i}`}>
              <RemoveBtn onClick={() => remove(i)} label="build"/>
              <div className="build-img">
                <BuildScene seed={i + 1}/>
                <span className={`build-status ${b.status || 'active'}`}>&middot; {b.statusLabel || 'ACTIVE'}</span>
                <span className="build-id">UCDC-{b.bid}</span>
              </div>
              <div className="build-body">
                <div className="build-name">{b.name}</div>
                <div className="build-desc">{b.desc}</div>
                {specs.length > 0 && (
                  <div className="build-specs">
                    {specs.map(([k, v]) => (
                      <div className="spec" key={k}>
                        <span className="l">{k}</span>
                        <span className="v">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8 }}>
                  <span>BUILD PROGRESS</span>
                  <span>{progress}%</span>
                </div>
                <div className="build-progress"><span style={{ width: `${progress}%` }}></span></div>
              </div>
            </div>
          );
        })}
        <AddTile onClick={() => setAddOpen(true)} label="Add build" shape="card"/>
      </div>

      <AddForm
        open={addOpen}
        title="Add a build"
        fields={[
          { name: 'name',        label: 'Build name',     required: true, placeholder: 'RAVEN Mk I' },
          { name: 'bid',         label: 'ID code',        required: true, placeholder: 'RV-01' },
          { name: 'statusLabel', label: 'Status label',   placeholder: 'IN BUILD' },
          { name: 'status',      label: 'Status color',   type: 'select', options: [
            { value: 'active',   label: 'Active (red)' },
            { value: 'testing',  label: 'Testing (amber)' },
            { value: 'complete', label: 'Complete (green)' },
          ]},
          { name: 'desc',        label: 'Description',    type: 'textarea', placeholder: 'What is it, what is it for.' },
          { name: 'progress',    label: 'Progress %',     type: 'number',   placeholder: '50' },
          { name: 'spec1Label',  label: 'Spec 1 label',   placeholder: 'WEIGHT' },
          { name: 'spec1Value',  label: 'Spec 1 value',   placeholder: '500g' },
          { name: 'spec2Label',  label: 'Spec 2 label',   placeholder: 'PROP' },
          { name: 'spec2Value',  label: 'Spec 2 value',   placeholder: '5\u2033 / 3-blade' },
        ]}
        onCancel={() => setAddOpen(false)}
        onSubmit={(v) => {
          add({ ...v, status: v.status || 'active', statusLabel: (v.statusLabel || 'ACTIVE').toUpperCase() });
          setAddOpen(false);
        }}
      />
    </Section>
  );
};

window.Gallery = Gallery;
window.Builds = Builds;
