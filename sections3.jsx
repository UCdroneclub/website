/* global React, Section, useEditableList, useEditing, RemoveBtn, AddTile, AddForm */
const { useState, useEffect, useRef, useMemo } = React;

// ============================================================
// PARTNERS & SUPPORT (was Sponsors — no pricing, free club)
// ============================================================
const PARTNERS_DEFAULT = [
  'UC Davis College of Engineering',
  'UC Davis Center for Student Involvement',
  'Russell Ranch \u2014 Field Access',
  'IEEE Davis Student Branch',
  'EBII Maker Space',
  'Davis Aero Hobby Shop',
  'AggieHacks',
  'COSMOS Program',
  'Bambu Lab Education',
  'TechShop Sacramento',
];

const WAYS_TO_HELP = [
  { kind: 'PARTS',     title: 'Donate parts',        body: 'Motors, frames, FCs, props, batteries. New, used, or pulled \u2014 we can use almost anything.' },
  { kind: 'FIELD',     title: 'Lend a flight field', body: 'Open land within 30mi of Davis, with clear airspace and no overhead wires. We bring spotters and a kill-switch SOP.' },
  { kind: 'MENTOR',    title: 'Mentor a cohort',     body: 'One night per quarter. Walk our build cohort through PID tuning, autonomy, photogrammetry, or your specialty.' },
  { kind: 'SPONSOR',   title: 'Department support',  body: 'In-kind shop time, machine access, lab space, or printable materials. We&rsquo;re a registered RSO; donations flow through CSI.' },
  { kind: 'RECRUIT',   title: 'Recruit our pilots',  body: 'We graduate eight to twelve hardware-fluent students every year. Send us your spring openings and we&rsquo;ll circulate them.' },
  { kind: 'COLLAB',    title: 'Research collaborations', body: 'CV, SLAM, swarming, payload delivery. We&rsquo;ve worked with three labs across COE; bring us a problem.' },
];

const Sponsors = ({ idx, total }) => {
  const { items: partners, add, remove } = useEditableList('partners', PARTNERS_DEFAULT);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <Section id="sponsors" idx={idx} total={total} label="Partners"
             title={<>UCDC runs on people,<br/>not paywalls.</>}
             intro={<>Membership is free for every UC Davis student. We keep the lights on with department support, donated parts, mentor time, and field access from organizations who believe in hands-on engineering.</>}>
      <div className="ways">
        {WAYS_TO_HELP.map((w, i) => (
          <div className="way" key={w.title}>
            <span className="way-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="way-kind">{w.kind}</span>
            <h4 className="way-title">{w.title}</h4>
            <p className="way-body">{w.body}</p>
          </div>
        ))}
      </div>

      <div className="partners">
        <div className="partners-head">Current &amp; past partners &mdash; {partners.length} organizations</div>
        <div className="partner-grid">
          {partners.map((p, i) => (
            <div className="partner" key={`${p}-${i}`}>
              <RemoveBtn onClick={() => remove(i)} label="partner"/>
              {p}
            </div>
          ))}
          <AddTile onClick={() => setAddOpen(true)} label="Add partner" shape="partner"/>
        </div>
      </div>

      <div className="partner-cta">
        <div>
          <h3 className="h3">Want to support UCDC?</h3>
          <p>Email <a href="mailto:partners@ucdroneclub.org">partners@ucdroneclub.org</a> or talk to Linh (treasurer) at any open meeting. We can usually return a one-pager and a quick coffee within the week.</p>
        </div>
        <a href="mailto:partners@ucdroneclub.org" className="btn btn--red">Get in touch <span className="arrow">&rarr;</span></a>
      </div>

      <AddForm
        open={addOpen}
        title="Add a partner"
        fields={[
          { name: 'name', label: 'Organization name', required: true, placeholder: 'Davis Robotics Lab' },
        ]}
        onCancel={() => setAddOpen(false)}
        onSubmit={(v) => { add(v.name); setAddOpen(false); }}
      />
    </Section>
  );
};

// ============================================================
// JOIN FORM (free \u2014 no dues language)
// ============================================================
const EXPERIENCE = ['Never flown', 'Hobby pilot', 'Built a kit', 'Built from scratch'];
const TRACKS = ['FPV / Freestyle', 'Racing', 'Autonomous / Payload', 'Cinematography', 'Not sure yet'];

const Join = ({ idx, total }) => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', major: '', year: '',
    experience: '', track: '', why: '', acknowledge: false,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim())     e.email     = 'Required';
    else if (!/^[^\s@]+@(ucdavis\.edu|.+\..+)$/i.test(form.email)) e.email = 'Invalid email';
    if (!form.major.trim())     e.major     = 'Required';
    if (!form.year)             e.year      = 'Required';
    if (!form.experience)       e.experience = 'Pick one';
    if (!form.track)            e.track     = 'Pick one';
    if (!form.why.trim())       e.why       = 'Tell us why';
    else if (form.why.trim().length < 20) e.why = 'At least 20 chars';
    if (!form.acknowledge)      e.acknowledge = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <Section id="join" idx={idx} total={total} label="Join" className="join"
             title={<>Apply for the <span style={{color: 'var(--red)'}}>Fall 2026</span> cohort.</>}
             intro={<>We accept new members each fall and a smaller winter cohort. No experience needed &mdash; just hands, time, and a willingness to crash on day one. Membership is <strong style={{ color: '#fff' }}>free</strong> for every UC Davis student.</>}>
      <div className="join-grid">
        <div className="join-pitch">
          <h3>What you&rsquo;ll get in your <span className="red">first quarter.</span></h3>
          <p>A sub-250g build kit (yours to keep). Three solder nights. One FAA Part 107 study cohort. Six flight days at Russell Ranch. And as many crashes as it takes &mdash; we keep the spare parts bin stocked.</p>

          <div className="join-reqs">
            <h4>Requirements</h4>
            <ul>
              <li>Enrolled UC Davis student (undergrad or grad)</li>
              <li>Free to join &mdash; build kits and parts provided by the club</li>
              <li>Sign the club SOP and FAA airspace acknowledgement</li>
              <li>Attend at least one solder night before your first flight</li>
            </ul>
          </div>
        </div>

        {submitted ? (
          <div className="form">
            <span className="form-corner tl"></span><span className="form-corner tr"></span>
            <span className="form-corner bl"></span><span className="form-corner br"></span>
            <div className="form-success">
              <div className="checkmark"></div>
              <h4>Application received.</h4>
              <p>You&rsquo;ll get a Discord invite + onboarding packet at <strong>{form.email}</strong> within 48 hours. See you at Bainer 1062.</p>
              <div className="form-id" style={{ marginTop: 24 }}>
                <span>APP ID</span>
                <span className="red">UCDC-{String(Math.floor(Math.random() * 9000) + 1000)}-{form.lastName.slice(0,3).toUpperCase()}</span>
              </div>
            </div>
          </div>
        ) : (
          <form className="form" onSubmit={submit} noValidate>
            <span className="form-corner tl"></span><span className="form-corner tr"></span>
            <span className="form-corner bl"></span><span className="form-corner br"></span>

            <div className="form-id">
              <span>UCDC &middot; MEMBERSHIP APPLICATION &middot; v2.6</span>
              <span className="red">REC &middot; SECURE</span>
            </div>

            <div className="form-row">
              <div className={`field ${errors.firstName ? 'has-error' : ''}`}>
                <label>First name <span className="req">*</span>{errors.firstName && <span className="field-error">{errors.firstName}</span>}</label>
                <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Jordan"/>
              </div>
              <div className={`field ${errors.lastName ? 'has-error' : ''}`}>
                <label>Last name <span className="req">*</span>{errors.lastName && <span className="field-error">{errors.lastName}</span>}</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Rivera"/>
              </div>
            </div>

            <div className={`field ${errors.email ? 'has-error' : ''}`}>
              <label>UC Davis email <span className="req">*</span>{errors.email && <span className="field-error">{errors.email}</span>}</label>
              <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jrivera@ucdavis.edu"/>
            </div>

            <div className="form-row">
              <div className={`field ${errors.major ? 'has-error' : ''}`}>
                <label>Major <span className="req">*</span>{errors.major && <span className="field-error">{errors.major}</span>}</label>
                <input type="text" value={form.major} onChange={e => update('major', e.target.value)} placeholder="Aerospace Engineering"/>
              </div>
              <div className={`field ${errors.year ? 'has-error' : ''}`}>
                <label>Year <span className="req">*</span>{errors.year && <span className="field-error">{errors.year}</span>}</label>
                <select value={form.year} onChange={e => update('year', e.target.value)}>
                  <option value="">Select&hellip;</option>
                  <option>1st year</option>
                  <option>2nd year</option>
                  <option>3rd year</option>
                  <option>4th year</option>
                  <option>5th+ year</option>
                  <option>Graduate</option>
                </select>
              </div>
            </div>

            <div className={`field ${errors.experience ? 'has-error' : ''}`}>
              <label>Flight / build experience <span className="req">*</span>{errors.experience && <span className="field-error">{errors.experience}</span>}</label>
              <div className="experience-grid">
                {EXPERIENCE.map(x => (
                  <div key={x} className={`exp ${form.experience === x ? 'is-selected' : ''}`} onClick={() => update('experience', x)}>
                    {x}
                  </div>
                ))}
              </div>
            </div>

            <div className={`field ${errors.track ? 'has-error' : ''}`}>
              <label>Track of interest <span className="req">*</span>{errors.track && <span className="field-error">{errors.track}</span>}</label>
              <select value={form.track} onChange={e => update('track', e.target.value)}>
                <option value="">Select&hellip;</option>
                {TRACKS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className={`field ${errors.why ? 'has-error' : ''}`}>
              <label>Why UCDC? <span className="req">*</span>{errors.why && <span className="field-error">{errors.why}</span>}</label>
              <textarea rows="3" value={form.why} onChange={e => update('why', e.target.value)} placeholder="What you want to build, fly, or learn this year."/>
            </div>

            <label className={`checkbox ${errors.acknowledge ? 'has-error' : ''}`}>
              <input type="checkbox" checked={form.acknowledge} onChange={e => update('acknowledge', e.target.checked)}/>
              <span className="box"></span>
              <span>I have read and agree to the UCDC SOP and FAA airspace acknowledgement.</span>
            </label>
            {errors.acknowledge && <span className="field-error" style={{ marginTop: -12 }}>{errors.acknowledge}</span>}

            <div className="form-submit">
              <span className="meta">Last submitted: 04:21:08 UTC</span>
              <button type="submit" className="btn">Transmit application <span className="arrow">&rarr;</span></button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
};

// ============================================================
// FOOTER
// ============================================================
const Footer = () => (
  <footer className="footer" data-screen-label="08 Footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="mark">
            <svg viewBox="0 0 28 28" width="28" height="28">
              <rect x="0.5" y="0.5" width="27" height="27" fill="none" stroke="#fff" strokeWidth="1"/>
              <circle cx="6" cy="6" r="2.5" fill="#DA1F26"/>
              <circle cx="22" cy="6" r="2.5" fill="#fff"/>
              <circle cx="6" cy="22" r="2.5" fill="#fff"/>
              <circle cx="22" cy="22" r="2.5" fill="#DA1F26"/>
              <line x1="6" y1="6" x2="22" y2="22" stroke="#fff"/>
              <line x1="22" y1="6" x2="6" y2="22" stroke="#fff"/>
              <circle cx="14" cy="14" r="3" fill="#fff"/>
            </svg>
            <span className="mark-name">UC Drone Club</span>
          </div>
          <p>Registered student organization at the University of California, Davis. Free to join, open to all majors. Building, flying, and racing since 2018.</p>
        </div>

        <div className="footer-col">
          <h5>Explore</h5>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#builds">Build Log</a></li>
            <li><a href="#sponsors">Partners</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Connect</h5>
          <ul>
            <li><a href="#">Instagram &mdash; @ucdronclub</a></li>
            <li><a href="#">YouTube &mdash; UCDC Flight Log</a></li>
            <li><a href="#">Discord &mdash; members only</a></li>
            <li><a href="#">GitHub &mdash; ucdroneclub</a></li>
            <li><a href="#">TikTok &mdash; @ucdrone</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact</h5>
          <ul>
            <li><a href="mailto:hello@ucdroneclub.org">hello@ucdroneclub.org</a></li>
            <li><a href="mailto:partners@ucdroneclub.org">partners@ucdroneclub.org</a></li>
            <li><a href="mailto:safety@ucdroneclub.org">safety@ucdroneclub.org</a></li>
            <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Bainer Hall 1062 &middot; Mailbox C-217</li>
            <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>One Shields Ave, Davis CA 95616</li>
          </ul>
        </div>
      </div>

      <div className="footer-mega">UCDC</div>

      <div className="footer-bottom">
        <span>&copy; 2026 UC Drone Club &middot; All flights logged</span>
        <span className="coords">
          <span>38.5382&deg; N</span>
          <span>121.7617&deg; W</span>
          <span>ALT 18m AGL</span>
          <span style={{ color: '#DA1F26' }}>&middot; FLEET ONLINE</span>
        </span>
      </div>
    </div>
  </footer>
);

window.Sponsors = Sponsors;
window.Join = Join;
window.Footer = Footer;
