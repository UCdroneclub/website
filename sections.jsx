/* global React, PortraitSilhouette, useEditableList, useEditing, RemoveBtn, AddTile, AddForm */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// Section wrapper with index marker
// ============================================================
const Section = ({ id, idx, total, label, title, intro, children, className = '' }) => (
  <section id={id} className={className} data-screen-label={`${String(idx).padStart(2,'0')} ${label}`}>
    <div className="sec-idx">
      <span>SEC &middot; {String(idx).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
      <span>{label}</span>
    </div>
    <div className="container">
      <div className="section-head">
        <div className="lhs">
          <span className="eyebrow">{label}</span>
          <h2 className="h2">{title}</h2>
        </div>
        {intro && <div className="rhs">{intro}</div>}
      </div>
      {children}
    </div>
  </section>
);

// ============================================================
// ABOUT + OFFICERS
// ============================================================
const OFFICERS_DEFAULT = [
  { name: 'Mohit Timalsina',     role: 'Co-Founder',       spec: '',    bio: '2nd-year Mechanical Engineering. Refuses to fly anything he didn\u2019t solder.' },
  { name: 'Thomas Burkholder',        role: 'Co-Founder', spec: '', bio: '2ne-year Mechanical Engineer. Owns more LiPo bags than couches.' }
];

const About = ({ idx, total }) => {
  const { items: officers, add, remove } = useEditableList('officers', OFFICERS_DEFAULT);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <Section id="about" idx={idx} total={total} label="About"
             title={<>A student squadron,<br/>built for flight.</>}
             intro={<>UCDC is a UC registered student organization. We design, build, fly, and race drones &mdash; and we train every member to the FAA Part 107 standard before they take a stick.</>}>
      <div className="about-grid">
        <div>
          <p className="about-lead">
            We don&rsquo;t buy drones &mdash; we <span className="red">build them.</span> Every airframe in our hangar was cut, soldered, tuned, and crashed at least once by an undergraduate.
          </p>
          <div className="about-body">
            <p>Since 2018, the UC Drone Club has been the home base for UC students who want to put hardware in the air. We meet weekly at Bainer Hall for builds and at Russell Ranch for flights &mdash; rain or shine, as long as the wind is below 18 knots.</p>
            <p>Our program is structured around three tracks: <strong>FPV freestyle</strong>, <strong>multi-rotor racing</strong>, and <strong>autonomous payload</strong>. Members move between tracks as they level up. Membership is free for all UC students &mdash; we provide build kits, parts, and field access.</p>
            <p>We are open to all majors. Half our active roster is non-engineering &mdash; we&rsquo;ve had English majors place top-5 at regionals, and our best aerial cinematographer is a Plant Sciences PhD.</p>
          </div>
        </div>
        <div className="stats ticked">
          <span className="tk-tr"></span><span className="tk-bl"></span>
          <div className="cell"><span className="v">{officers.length * 18}</span><span className="l">Active members &lsquo;25&ndash;&rsquo;26</span></div>
          <div className="cell"><span className="v">37</span><span className="l">Aircraft in fleet</span></div>
          <div className="cell"><span className="v">28</span><span className="l">FAA Part 107 pilots</span></div>
          <div className="cell"><span className="v">1,284<span className="u">hrs</span></span><span className="l">Flight time logged &lsquo;24&ndash;&rsquo;25</span></div>
          <div className="cell"><span className="v">11</span><span className="l">Competitions entered</span></div>
          <div className="cell"><span className="v">FREE</span><span className="l">Membership for all majors</span></div>
        </div>
      </div>

      <div style={{ marginTop: 'clamp(60px, 8vw, 100px)' }}>
        <div className="eyebrow" style={{ marginBottom: 16 }}>2025&ndash;2026 Officers</div>
        <h3 className="h3" style={{ marginBottom: 32, maxWidth: '30ch' }}>The team that keeps the fleet flying.</h3>
        <div className="officers">
          {officers.map((o, i) => (
            <div className="officer" key={`${o.name}-${i}`}>
              <RemoveBtn onClick={() => remove(i)} label="officer"/>
              <div className="officer-portrait">
                <PortraitSilhouette seed={i}/>
              </div>
              <div className="officer-corner"></div>
              <div className="officer-label">{String(i + 1).padStart(2, '0')} &middot; {o.role}</div>
              <div className="officer-meta">
                <div className="officer-name">{o.name}</div>
                <div className="officer-role">{o.role}</div>
                <div className="officer-bio">{o.bio}</div>
                <div className="officer-spec">
                  {(o.spec || '').split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s}>&middot; {s}</span>)}
                </div>
              </div>
            </div>
          ))}
          <AddTile onClick={() => setAddOpen(true)} label="Add officer" shape="portrait"/>
        </div>
      </div>

      <AddForm
        open={addOpen}
        title="Add an officer"
        fields={[
          { name: 'name', label: 'Name',     required: true, placeholder: 'Alex Chen' },
          { name: 'role', label: 'Role',     required: true, placeholder: 'Membership Chair' },
          { name: 'spec', label: 'Tags',     placeholder: 'CINE, COMMS' },
          { name: 'bio',  label: 'Short bio', type: 'textarea', placeholder: 'One sentence about them.' },
        ]}
        onCancel={() => setAddOpen(false)}
        onSubmit={(v) => { add(v); setAddOpen(false); }}
      />
    </Section>
  );
};

// ============================================================
// EVENTS
// ============================================================
const EVENTS_DEFAULT = [
  { day: '04', month: 'JUN', year: '2026', title: 'Summer Build Bootcamp \u2014 Cohort 1', desc: 'Five-night intensive: solder, tune, and maiden-flight your first sub-250g whoop.', tag: 'workshop', loc: 'Bainer 1062' },
  { day: '11', month: 'JUN', year: '2026', title: 'Russell Ranch Open Flight Day',         desc: 'Bring a battery, leave with footage. Spotters provided, kill-switch mandatory.',   tag: 'fly',      loc: 'Russell Ranch \u2014 Pad A' },
  { day: '18', month: 'JUN', year: '2026', title: 'FAA Part 107 Study Session',            desc: 'Mateo walks the airspace and weather chapters. Practice exam at the end.',         tag: 'workshop', loc: 'Kemper 1131' },
  { day: '25', month: 'JUN', year: '2026', title: 'Solder Night + Pizza',                  desc: 'Open lab, 6\u201310pm. Bring your build, we bring the iron and the pepperoni.',    tag: 'social',   loc: 'EBII \u2014 Maker Space' },
  { day: '02', month: 'JUL', year: '2026', title: 'Inter-Club Drag Race vs. UCSB',         desc: 'Best of 5 laps on the West Quad gate course. Last year: 4\u20133 us.',             tag: 'comp',     loc: 'West Quad' },
  { day: '09', month: 'JUL', year: '2026', title: 'Autonomous Payload Sprint',             desc: 'Open challenge: deliver a 250g payload to a moving target within 90s.',           tag: 'comp',     loc: 'Russell Ranch \u2014 Pad B' },
  { day: '16', month: 'JUL', year: '2026', title: 'WILDCAT Rev 5 Frame Day',               desc: 'Cut, sand, and dry-fit the new 6\u2033 race frame. Bring safety glasses.',        tag: 'build',    loc: 'EBII \u2014 Machine Shop' },
  { day: '30', month: 'JUL', year: '2026', title: 'High School Outreach \u2014 Davis HS',  desc: 'Demo flight + intro workshop for 40 incoming seniors.',                            tag: 'social',   loc: 'Davis Senior HS' },
  { day: '06', month: 'AUG', year: '2026', title: 'Night Flight \u2014 LED Build-Out',     desc: 'Solder LED whips. Fly with them. Pretend it\u2019s Tron.',                         tag: 'fly',      loc: 'Russell Ranch \u2014 Pad A' },
  { day: '13', month: 'AUG', year: '2026', title: 'MultiGP West Regional Qualifier',       desc: 'Comp team only. Spectators welcome \u2014 bring earplugs.',                        tag: 'comp',     loc: 'Sacramento Raceway' },
];

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'fly',      label: 'Flight Days' },
  { id: 'build',    label: 'Builds' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'comp',     label: 'Competitions' },
  { id: 'social',   label: 'Social' },
];

const Events = ({ idx, total }) => {
  const { items: events, add, remove } = useEditableList('events', EVENTS_DEFAULT);
  const { editing } = useEditing();
  const [filter, setFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  const counts = useMemo(() => {
    const c = { all: events.length };
    FILTERS.forEach(f => { if (f.id !== 'all') c[f.id] = events.filter(e => e.tag === f.id).length; });
    return c;
  }, [events]);

  // Pass through original index for correct removal
  const indexed = events.map((e, i) => ({ ...e, _i: i }));
  const list = filter === 'all' ? indexed : indexed.filter(e => e.tag === filter);
  const tagLabel = { fly: 'FLIGHT', build: 'BUILD', workshop: 'WORKSHOP', comp: 'COMP', social: 'SOCIAL' };

  return (
    <Section id="events" idx={idx} total={total} label="Schedule"
             title={<>Ten weeks of flight,<br/>tuning, and trophies.</>}
             intro={<>Our calendar runs Wednesday builds, Saturday flights, and a sprinkle of competitions. Members get the full ICS feed; below is the public summary.</>}>
      <div className="events-filters">
        {FILTERS.map(f => (
          <button key={f.id} className={`filter-pill ${filter === f.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(f.id)}>
            {f.label} <span className="count">{String(counts[f.id] || 0).padStart(2,'0')}</span>
          </button>
        ))}
      </div>

      <div className="events-list">
        {list.map((e) => (
          <div className="event-row" key={e._i}>
            <div className="event-date">
              <span className="day">{e.day}</span>
              <span className="month">{e.month} {e.year}</span>
            </div>
            <div>
              <div className="event-title">{e.title}</div>
              <div className="event-desc" style={{ marginTop: 4 }}>{e.loc}</div>
            </div>
            <div className="event-desc">{e.desc}</div>
            <span className={`event-tag tag-${e.tag}`}>{tagLabel[e.tag]}</span>
            {editing ? (
              <RemoveBtn onClick={() => remove(e._i)} label="event"/>
            ) : (
              <span className="event-cta">RSVP <span className="arrow">&rarr;</span></span>
            )}
          </div>
        ))}
        {list.length === 0 && !editing && (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--f-mono)', fontSize: 13, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
            No events in this filter.
          </div>
        )}
        <AddTile onClick={() => setAddOpen(true)} label="Add event" shape="row"/>
      </div>

      <AddForm
        open={addOpen}
        title="Add an event"
        fields={[
          { name: 'day',   label: 'Day (e.g. 04)',     required: true, placeholder: '04' },
          { name: 'month', label: 'Month (e.g. SEP)',  required: true, placeholder: 'SEP' },
          { name: 'year',  label: 'Year',              required: true, placeholder: '2026' },
          { name: 'title', label: 'Title',             required: true, placeholder: 'Open Flight Day' },
          { name: 'loc',   label: 'Location',          placeholder: 'Russell Ranch \u2014 Pad A' },
          { name: 'desc',  label: 'Description',       type: 'textarea', placeholder: 'One sentence about the event.' },
          { name: 'tag',   label: 'Category',          type: 'select', required: true, options: [
            { value: 'fly',      label: 'Flight Day' },
            { value: 'build',    label: 'Build' },
            { value: 'workshop', label: 'Workshop' },
            { value: 'comp',     label: 'Competition' },
            { value: 'social',   label: 'Social' },
          ]},
        ]}
        onCancel={() => setAddOpen(false)}
        onSubmit={(v) => { add({ ...v, day: v.day.padStart(2, '0'), month: v.month.toUpperCase() }); setAddOpen(false); }}
      />
    </Section>
  );
};

window.Section = Section;
window.About = About;
window.Events = Events;
