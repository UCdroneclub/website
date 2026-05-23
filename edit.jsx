/* global React */
const { useState, useEffect, createContext, useContext } = React;

// ============================================================
// Edit Mode Context + LocalStorage list hook
// ============================================================
const EditContext = createContext({ editing: false, toggle: () => {} });

const EditProvider = ({ children }) => {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('is-editing', editing);
  }, [editing]);
  return (
    <EditContext.Provider value={{ editing, toggle: () => setEditing(e => !e) }}>
      {children}
    </EditContext.Provider>
  );
};

const useEditing = () => useContext(EditContext);

// Persist a list per key. Includes add/remove/reset.
const useEditableList = (key, defaults) => {
  const storeKey = `ucdc.${key}`;
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storeKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return defaults;
  });
  const persist = (next) => {
    setItems(next);
    try { localStorage.setItem(storeKey, JSON.stringify(next)); } catch (e) {}
  };
  const add    = (item)     => persist([...items, item]);
  const remove = (idx)      => persist(items.filter((_, i) => i !== idx));
  const reset  = ()         => {
    try { localStorage.removeItem(storeKey); } catch (e) {}
    setItems(defaults);
  };
  return { items, add, remove, reset };
};

// ============================================================
// Floating edit toggle (bottom-right)
// ============================================================
const EditToggle = () => {
  const { editing, toggle } = useEditing();
  return (
    <button className={`edit-toggle ${editing ? 'is-on' : ''}`} onClick={toggle}
            title={editing ? 'Exit edit mode' : 'Edit mode'}>
      <span className="edit-toggle-dot"></span>
      <span className="edit-toggle-label">
        {editing ? 'EDITING' : 'EDIT MODE'}
      </span>
      <span className="edit-toggle-icon" aria-hidden="true">
        {editing ? '\u00d7' : (
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12 L10 4 L12 6 L4 14 L2 14 Z"/>
            <path d="M10 4 L12 2 L14 4 L12 6"/>
          </svg>
        )}
      </span>
    </button>
  );
};

// ============================================================
// Remove button — inline × on each item
// ============================================================
const RemoveBtn = ({ onClick, label = 'Remove', float = false }) => {
  const { editing } = useEditing();
  if (!editing) return null;
  return (
    <button
      className={`remove-btn ${float ? 'is-float' : ''}`}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); if (confirm(`Remove this ${label.toLowerCase()}?`)) onClick(); }}
      title={`Remove ${label}`}
    >
      <span>&times;</span>
    </button>
  );
};

// ============================================================
// AddTile — placeholder card to launch the Add form
// ============================================================
const AddTile = ({ onClick, label, shape = 'card' }) => {
  const { editing } = useEditing();
  if (!editing) return null;
  return (
    <button className={`add-tile shape-${shape}`} onClick={onClick}>
      <span className="add-tile-plus">+</span>
      <span className="add-tile-label">{label}</span>
    </button>
  );
};

// ============================================================
// AddForm — generic modal with named fields
// fields: [{ name, label, type: 'text'|'textarea'|'select', options?, placeholder?, required? }]
// ============================================================
const AddForm = ({ open, title, fields, onCancel, onSubmit }) => {
  const [values, setValues] = useState({});
  const [errs, setErrs] = useState({});

  useEffect(() => {
    if (open) { setValues({}); setErrs({}); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    fields.forEach(f => {
      if (f.required && !(values[f.name] || '').toString().trim()) next[f.name] = 'Required';
    });
    setErrs(next);
    if (Object.keys(next).length === 0) onSubmit(values);
  };

  return (
    <div className="addform-backdrop" onClick={onCancel}>
      <form className="addform" onClick={e => e.stopPropagation()} onSubmit={submit}>
        <span className="form-corner tl"></span><span className="form-corner tr"></span>
        <span className="form-corner bl"></span><span className="form-corner br"></span>

        <div className="addform-head">
          <span className="form-id">
            <span>UCDC &middot; NEW ENTRY</span>
            <span className="red">REC</span>
          </span>
          <h4>{title}</h4>
        </div>

        <div className="addform-body">
          {fields.map(f => (
            <div key={f.name} className={`field ${errs[f.name] ? 'has-error' : ''}`}>
              <label>
                {f.label} {f.required && <span className="req">*</span>}
                {errs[f.name] && <span className="field-error">{errs[f.name]}</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea rows={f.rows || 3} value={values[f.name] || ''}
                          onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}
                          placeholder={f.placeholder}/>
              ) : f.type === 'select' ? (
                <select value={values[f.name] || ''}
                        onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}>
                  <option value="">Select&hellip;</option>
                  {f.options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={values[f.name] || ''}
                       onChange={e => setValues(v => ({ ...v, [f.name]: e.target.value }))}
                       placeholder={f.placeholder}/>
              )}
            </div>
          ))}
        </div>

        <div className="addform-submit">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn">Add entry <span className="arrow">&rarr;</span></button>
        </div>
      </form>
    </div>
  );
};

window.EditContext = EditContext;
window.EditProvider = EditProvider;
window.useEditing = useEditing;
window.useEditableList = useEditableList;
window.EditToggle = EditToggle;
window.RemoveBtn = RemoveBtn;
window.AddTile = AddTile;
window.AddForm = AddForm;
