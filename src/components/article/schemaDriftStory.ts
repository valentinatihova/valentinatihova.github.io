// "Schema drift, played back": a 960x540 story in five shots about a deleted field
// mapping. The same renderer builds the static final shot at build time and every
// shot in the browser. All data is synthetic.

export const SHOTS = 5;
export const DURATIONS = [2000, 2500, 2500, 2000, 3000];
export const CAPTIONS = [
  'Your CLV dashboard just broke.',
  'Nobody touched the dashboard.',
  'One field mapping was deleted upstream.',
  'Everything downstream breaks silently.',
  'Flagged at the next drift check.',
];
const MAP_LABELS: Record<number, string> = {
  3: 'Map of the org: the mapping from Orders_Raw.Amount to Sales Order Total_Amount was deleted, so Total_Amount is empty',
  4: 'Map of the org: empty Total_Amount values break CLV metric, Churn Risk and the dashboard',
  5: 'Map of the org: the scheduled drift check fails on the removed field mapping and alerts the team',
};

export const COL_X = [0, 179, 358, 537, 716];
export const ROW_Y = [34, 104, 174, 244, 314];
export const W = 140;
export const H = 46;

type State = 'path' | 'changed' | 'broken' | 'quiet' | 'safe' | 'hidden';
export interface Node { id: string; label: string; c: number; r: number; s?: Record<number, [string, State]> }

// Nodes without an entry for a shot are faded context.
export const NODES: Node[] = [
  { id: 's_web', label: 'Web Engagement', c: 0, r: 0 },
  { id: 's_crm', label: 'CRM Contacts', c: 0, r: 1 },
  { id: 's_ord', label: 'Orders file', c: 0, r: 2, s: { 3: ['Nightly upload', 'path'], 4: ['Nightly upload', 'path'], 5: ['Nightly upload', 'path'] } },
  { id: 's_email', label: 'Email Events', c: 0, r: 3 },
  { id: 'd_web', label: 'Web_Engagement', c: 1, r: 0 },
  { id: 'd_contact', label: 'Contact', c: 1, r: 1 },
  { id: 'd_ord', label: 'Orders_Raw', c: 1, r: 2, s: { 3: ['Raw orders', 'path'], 4: ['Raw orders', 'path'], 5: ['Raw orders', 'path'] } },
  { id: 'd_email', label: 'Email_Engagement', c: 1, r: 3 },
  { id: 'm_ind', label: 'Individual', c: 2, r: 0 },
  { id: 'm_cpe', label: 'Contact Point Email', c: 2, r: 1 },
  { id: 'm_eng', label: 'Engagement', c: 2, r: 2 },
  { id: 'm_so', label: 'Sales Order', c: 2, r: 3, s: { 3: ['', 'hidden'], 4: ['Amount unmapped', 'changed'], 5: ['Flagged by CI', 'changed'] } },
  { id: 'c_clv', label: 'CLV metric', c: 3, r: 1, s: { 3: ['Calculated nightly', 'path'], 4: ['Adds up blanks', 'broken'], 5: ['Adds up blanks', 'quiet'] } },
  { id: 'c_churn', label: 'Churn Risk', c: 3, r: 3, s: { 3: ['Calculated nightly', 'path'], 4: ['Reads blanks', 'broken'], 5: ['Reads blanks', 'quiet'] } },
  { id: 'r_dash', label: 'Dashboard', c: 4, r: 1, s: { 3: ['Shows CLV €0', 'path'], 4: ['Shows CLV €0', 'broken'], 5: ['Fix before review', 'safe'] } },
];
// [from, to, kind, draw delay in seconds for shot 4]
export const EDGES: [string, string, ('path' | 'chain')?, number?][] = [
  ['s_web', 'd_web'], ['s_crm', 'd_contact'], ['s_ord', 'd_ord', 'path'], ['s_email', 'd_email'],
  ['d_contact', 'm_ind'], ['d_contact', 'm_cpe'], ['d_web', 'm_eng'], ['d_email', 'm_eng'],
  ['d_ord', 'm_so', 'path'], ['m_ind', 'c_clv'], ['m_eng', 'c_churn'],
  ['m_so', 'c_clv', 'chain', 0.2], ['m_so', 'c_churn', 'chain', 0.2], ['c_clv', 'r_dash', 'chain', 0.75],
];
// Shot 4: each broken node turns red when its incoming line arrives.
const RED_DELAY: Record<string, number> = { c_clv: 0.65, c_churn: 0.65, r_dash: 1.2 };
const LOOK: Record<string, { bg: string; border: string; sub: string; bold: boolean }> = {
  path: { bg: '#FFFFFF', border: '1px solid #7E938B', sub: '#4F5F66', bold: false },
  changed: { bg: '#F8ECDD', border: '2px solid #9A4F00', sub: '#9A4F00', bold: true },
  broken: { bg: '#F7E0E2', border: '2px solid #A3242F', sub: '#A3242F', bold: true },
  quiet: { bg: '#F7E0E2', border: '1px solid #A3242F', sub: '#A3242F', bold: false },
  safe: { bg: '#E3EEF8', border: '2px solid #1D5FA0', sub: '#1D5FA0', bold: true },
};
const FADED = { bg: '#FFFFFF', border: '1px solid #B9C6C0', sub: '#4F5F66', bold: false };
const byId = (id: string) => NODES.find((n) => n.id === id)!;

function shot1() {
  return `<div style="align-self:center;margin-top:28px;width:460px;box-sizing:border-box;background:#FFFFFF;border:2px solid #A3242F;border-radius:12px;padding:28px 36px;display:flex;flex-direction:column;gap:6px;animation:sd-fade .35s ease-out both">
<p style="margin:0;font-size:14px;color:#4F5F66">Dashboard</p>
<p style="margin:0;font-size:18px;font-weight:600">CLV, Customer Lifetime Value</p>
<div style="display:flex;align-items:baseline;gap:20px;margin-top:16px">
<p style="margin:0;font-size:96px;font-weight:600;line-height:1;color:#A3242F;animation:sd-drop .45s cubic-bezier(.2,.8,.2,1) .7s both">€0</p>
<p style="position:relative;margin:0;font-size:28px;color:#6B7A80">€1,240<span aria-hidden="true" style="position:absolute;left:-2px;right:-2px;top:52%;border-top:2px solid #6B7A80;transform-origin:left;animation:sd-strike .35s ease-out .35s both"></span></p>
</div>
<p style="margin:14px 0 0;font-size:14px;color:#A3242F;font-weight:600;animation:sd-fade .3s ease-out 1.1s both">Down 100% since last week</p>
</div>`;
}

function shot2() {
  const box = (title: string, sub: string) =>
    `<div style="width:170px;box-sizing:border-box;background:#FFFFFF;border:1px solid #B9C6C0;border-radius:8px;padding:14px 16px"><p style="margin:0;font-weight:600;font-size:16px">${title}</p><p style="margin:2px 0 0;font-size:14px;color:#4F5F66">${sub}</p></div>`;
  const line = '<div aria-hidden="true" style="flex:1;border-top:2px solid #9DB0A8"></div>';
  return `<div style="margin-top:110px;display:flex;align-items:center;transform-origin:right center;animation:sd-pull .9s cubic-bezier(.2,.8,.2,1) both">
${box('Orders file', 'Nightly upload')}${line}${box('Sales Order', 'Unified order table')}${line}${box('CLV metric', 'Calculated nightly')}${line}
<div style="width:170px;box-sizing:border-box;background:#FFFFFF;border:2px solid #A3242F;border-radius:12px;padding:12px 16px"><p style="margin:0;font-size:13px;color:#4F5F66">Dashboard</p><p style="margin:0;font-weight:600;font-size:16px">CLV <span style="color:#A3242F">€0</span></p></div>
</div>`;
}

function map(shot: number) {
  const regions = ['Sources', 'Data lake', 'Data model', 'Insights', 'Reports']
    .map((label, i) => `<p aria-hidden="true" style="position:absolute;left:${COL_X[i]}px;top:0;margin:0;font-family:var(--font-serif);font-style:italic;font-size:20px;color:#5E716A">${label}</p>`)
    .join('');

  const edges = EDGES.map(([from, to, kind, delay]) => {
    const a = byId(from), b = byId(to);
    const x1 = COL_X[a.c] + W, y1 = ROW_Y[a.r] + H / 2;
    const x2 = COL_X[b.c], y2 = ROW_Y[b.r] + H / 2;
    const len = Math.hypot(x2 - x1, y2 - y1);
    const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    let line = '1px solid #B9C6C0', faded = true, anim = '';
    if (kind === 'path') { line = '2px solid #7E938B'; faded = false; }
    if (kind === 'chain') {
      faded = false;
      line = shot === 3 ? '2px solid #7E938B' : shot === 4 ? '4px solid #A3242F' : '2px solid #C98A90';
      if (shot === 4) anim = `;transform-origin:left;animation:sd-draw .45s cubic-bezier(.2,.8,.2,1) ${delay}s both`;
    }
    return `<div aria-hidden="true" style="position:absolute;left:${x1}px;top:${y1}px;width:${len.toFixed(1)}px;height:4px;transform-origin:0 0;transform:rotate(${deg.toFixed(2)}deg)${faded ? ';opacity:.5' : ''}"><div style="width:100%;border-top:${line}${anim}"></div></div>`;
  }).join('');

  const nodes = NODES.map((n) => {
    const [sub, state] = n.s?.[shot] ?? ['', null];
    if (state === 'hidden') return '';
    const look = (state && LOOK[state]) || FADED;
    const anim = shot === 4 && state === 'broken' ? `;animation:sd-red .3s ease-out ${RED_DELAY[n.id]}s both` : '';
    return `<div aria-hidden="true" style="position:absolute;left:${COL_X[n.c]}px;top:${ROW_Y[n.r]}px;width:${W}px;height:${H}px;box-sizing:border-box;padding:5px 8px;border-radius:6px;background:${look.bg};border:${look.border};display:flex;flex-direction:column;justify-content:center;gap:1px${state ? '' : ';opacity:.4'}${anim}">
<span style="font-weight:600;font-size:14px;line-height:1.2">${n.label}</span><span style="font-size:13px;line-height:1.2;color:${look.sub}${look.bold ? ';font-weight:600' : ''}">${sub}</span></div>`;
  }).join('');

  const s3 = shot !== 3 ? '' : `<div aria-hidden="true" style="position:absolute;left:312px;top:226px;width:236px;box-sizing:border-box;background:#FFFFFF;border:2px solid #9A4F00;border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;animation:sd-fade .35s ease-out .15s both">
<p style="margin:0;font-weight:600;font-size:15px">Sales Order mappings</p>
<div style="display:flex;justify-content:space-between;padding:5px 8px;border-radius:5px;background:#F2F4F1;font-size:13px"><span>Order_Id</span><span style="color:#4F5F66">← Id</span></div>
<div style="display:flex;flex-direction:column;gap:2px;padding:6px 8px;border-radius:5px;background:#F8ECDD;border:2px solid #9A4F00;font-size:13px">
<span style="display:flex;justify-content:space-between"><span style="font-weight:600">Total_Amount</span><span style="position:relative;color:#6B7A80">← Amount<span style="position:absolute;left:-1px;right:-1px;top:55%;border-top:1.5px solid #6B7A80;transform-origin:left;animation:sd-strike .35s ease-out .8s both"></span></span></span>
<span style="color:#9A4F00;font-weight:600;animation:sd-fade .3s ease-out 1.2s both">No mapping, value is empty</span>
</div></div>`;
  const s4 = shot !== 4 ? '' : `<div aria-hidden="true" style="position:absolute;left:537px;top:362px;display:flex;align-items:center;gap:8px;font-size:13px;color:#33444C;animation:sd-fade .3s ease-out 1.4s both"><span style="width:28px;border-top:4px solid #A3242F"></span>blank values travel down</div>`;
  const s5 = shot !== 5 ? '' : `<div aria-hidden="true" style="position:absolute;left:270px;top:300px;width:248px;box-sizing:border-box;background:#1D2B33;color:#F2F4F1;border-radius:8px;padding:9px 14px;transform:rotate(-3deg);animation:sd-stamp .4s cubic-bezier(.2,.8,.2,1) .35s both">
<p style="margin:0;font-size:15px;font-weight:600"><span style="display:inline-block;width:8px;height:8px;border-radius:4px;background:#E8806F;margin-right:6px"></span>Schema drift: 1 change</p>
<p style="margin:0;font-size:13px;color:#C9D6D0">Mapping removed: Total_Amount</p></div>`;

  return `<div role="img" aria-label="${MAP_LABELS[shot]}" style="position:relative;margin-top:6px;width:856px;height:380px;background-image:linear-gradient(#E4EAE6 1px,transparent 1px),linear-gradient(90deg,#E4EAE6 1px,transparent 1px);background-size:32px 32px">${regions}${edges}${nodes}${s3}${s4}${s5}</div>`;
}

const CTA = `<div style="position:absolute;right:52px;bottom:18px;display:flex;flex-direction:column;align-items:flex-end;gap:6px;animation:sd-fade .35s ease-out .9s both">
<a href="https://github.com/valentinatihova/data360-autodoc" style="min-height:44px;display:inline-flex;align-items:center;padding:0 20px;border-radius:22px;background:#1D2B33;color:#F2F4F1;text-decoration:none;font-weight:600">See it on GitHub</a>
<code style="font-family:var(--font-mono);font-size:13px;color:#33444C;background:#FFFFFF;border:1px solid #CFD8D3;border-radius:6px;padding:4px 8px">pip install data360-autodoc</code></div>`;

/** Everything under the caption for one shot (1–5). */
export function renderShot(shot: number): string {
  if (shot === 1) return shot1();
  if (shot === 2) return shot2();
  return map(shot) + (shot === 5 ? CTA : '');
}
