/**
 * ImgLab Tools – Shared Calculator Logic
 * All pure functions; no DOM references here.
 */

// ── CONVERSION HELPERS ────────────────────────────────────────
function toPercent(cgpa, scale, univ) {
  if (scale === 10) {
    if (univ === 'mumbai') return (cgpa - 0.5) * 10;
    if (univ === 'aktu')   return cgpa * 10;
    return cgpa * 9.5; // VTU, Anna, GTU, SPPU, general
  }
  if (scale === 5) return (cgpa / 5) * 100;
  return (cgpa / 4) * 100;  // 4-point scale
}

function toCGPA(pct, scale, univ) {
  if (scale === 10) {
    if (univ === 'mumbai') return (pct / 10) + 0.5;
    if (univ === 'aktu')   return pct / 10;
    return pct / 9.5;
  }
  if (scale === 5) return (pct / 100) * 5;
  return (pct / 100) * 4;
}

function getGrade(pct) {
  if (pct >= 91) return { g: 'O / A+', cl: 'Outstanding' };
  if (pct >= 81) return { g: 'A',      cl: 'Distinction' };
  if (pct >= 71) return { g: 'B+',     cl: 'First Class' };
  if (pct >= 61) return { g: 'B',      cl: 'First Class' };
  if (pct >= 51) return { g: 'C+',     cl: 'Second Class' };
  if (pct >= 41) return { g: 'C',      cl: 'Pass' };
  if (pct >= 35) return { g: 'D',      cl: 'Pass' };
  return { g: 'F', cl: 'Fail' };
}

function getGradeFromMarks(pct) {
  if (pct >= 91) return { g: 'O',  gp: 10 };
  if (pct >= 81) return { g: 'A',  gp: 9  };
  if (pct >= 71) return { g: 'B+', gp: 8  };
  if (pct >= 61) return { g: 'B',  gp: 7  };
  if (pct >= 51) return { g: 'C+', gp: 6  };
  if (pct >= 41) return { g: 'C',  gp: 5  };
  if (pct >= 35) return { g: 'D',  gp: 4  };
  return { g: 'F', gp: 0 };
}

const FORMULA_MAP = {
  normal: 'CGPA × 9.5',
  vtu:    'CGPA × 9.5 (VTU official)',
  anna:   'CGPA × 9.5 (Anna University)',
  mumbai: '(CGPA – 0.5) × 10 (Mumbai University)',
  gtu:    'CGPA × 9.5 (GTU)',
  aktu:   'CGPA × 10 (AKTU)',
  sppu:   'CGPA × 9.5 (SPPU Pune)',
};

// ── SHARED UI COMPONENTS ──────────────────────────────────────
function buildSidebarTable() {
  const el = document.getElementById('sidebarTable');
  if (!el) return;
  const vals = [10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5];
  let html = '';
  for (const c of vals) {
    const pct = (c * 9.5).toFixed(1) + '%';
    const { g } = getGrade(c * 9.5);
    html += `<tr style="border-bottom:1px solid #f0f0f0">
      <td style="padding:5px 8px;font-size:.82rem">${c.toFixed(1)}</td>
      <td style="padding:5px 8px;font-size:.82rem">${pct}</td>
      <td style="padding:5px 8px;font-size:.82rem;color:#1e73be;font-weight:700">${g}</td>
    </tr>`;
  }
  el.innerHTML = html;
}

function toggleFAQ(el) {
  const item = el.parentElement;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

// ── PAGE SPECIFIC LOGIC ───────────────────────────────────────

// 1. Home Page
let homeScale = 10;
function initHome() {
  const cgpaInput = document.getElementById('homeCGPA');
  const univSelect = document.getElementById('homeUniv');
  const btnCalc = document.getElementById('btnCalcHome');
  const btnReset = document.getElementById('btnResetHome');
  const tabs = document.querySelectorAll('.scale-tabs .scale-tab');

  if (cgpaInput && tabs.length > 0) {
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.textContent);
        homeScale = val;
        tabs.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
      });
    });
    
    const runCalc = () => {
      const cgpa = parseFloat(cgpaInput.value);
      const univ = univSelect.value;
      if (isNaN(cgpa) || cgpa < 0) { alert('Please enter a valid CGPA.'); return; }
      const pct = toPercent(cgpa, homeScale, univ);
      const { g, cl } = getGrade(pct);
      document.getElementById('homeResPct').textContent = pct.toFixed(2) + '%';
      document.getElementById('homeResGrade').textContent = g;
      document.getElementById('homeResClass').textContent = cl;
      document.getElementById('homeBar').style.width = Math.min(pct, 100) + '%';
      document.getElementById('homeBarLabel').textContent = pct.toFixed(2) + '%';
      document.getElementById('homeResult').classList.add('show');
    };

    if (btnCalc) btnCalc.addEventListener('click', runCalc);
    if (btnReset) btnReset.addEventListener('click', () => {
      cgpaInput.value = '';
      document.getElementById('homeResult').classList.remove('show');
      document.getElementById('homeBar').style.width = '0%';
    });
    cgpaInput.addEventListener('keypress', e => { if (e.key === 'Enter') runCalc(); });
  }
}

// 2. CGPA to Percentage Page
let c2pScale = 10;
let c2pSubCnt = 0;
function initC2P() {
  const cgpaInput = document.getElementById('c2pCGPA');
  if (!cgpaInput) return;
  
  const tabs = document.querySelectorAll('.scale-tabs .scale-tab');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
       const val = parseInt(btn.textContent);
       c2pScale = val;
       tabs.forEach(b => b.classList.remove('active'));
       btn.classList.add('active');
       document.getElementById('c2pScaleMax').textContent = val;
    });
  });

  const btnCalc = document.getElementById('btnCalcC2P');
  if (btnCalc) btnCalc.addEventListener('click', () => {
    const cgpa = parseFloat(cgpaInput.value);
    const univ = document.getElementById('c2pUniv').value;
    if (isNaN(cgpa) || cgpa < 0) { alert('Please enter a valid CGPA.'); return; }
    const pct = toPercent(cgpa, c2pScale, univ);
    const { g, cl } = getGrade(pct);
    document.getElementById('c2pResPct').textContent = pct.toFixed(2) + '%';
    document.getElementById('c2pResGrade').textContent = g;
    document.getElementById('c2pResDivision').textContent = cl;
    document.getElementById('c2pBar').style.width = ((cgpa/c2pScale)*100).toFixed(0) + '%';
    document.getElementById('c2pFormula').innerHTML = '<strong>Formula used:</strong> ' + (FORMULA_MAP[univ] || 'CGPA × 9.5') + ' = ' + pct.toFixed(2) + '%';
    document.getElementById('c2pResult').classList.add('show');
  });

  const btnReset = document.getElementById('btnResetC2P');
  if (btnReset) btnReset.addEventListener('click', () => {
    cgpaInput.value = '';
    document.getElementById('c2pResult').classList.remove('show');
    document.getElementById('c2pBar').style.width = '0%';
  });

  cgpaInput.addEventListener('keypress', e => { if (e.key === 'Enter' && btnCalc) btnCalc.click(); });

  // Subjects part of C2P Page
  const addSub = (n='', gp='', cr='') => {
    c2pSubCnt++;
    const container = document.getElementById('c2pSubjects');
    if(!container) return;
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.id = 'c2psub_' + c2pSubCnt;
    div.innerHTML = `<input type="text" placeholder="Subject ${c2pSubCnt}" value="${n}">
      <input type="number" placeholder="0–10" class="s-gp" value="${gp}" step="0.01">
      <input type="number" placeholder="Credits" class="s-cr" value="${cr}" step="0.5">
      <button class="btn-del" title="Remove">×</button>`;
    div.querySelector('.btn-del').onclick = () => div.remove();
    container.appendChild(div);
  };
  
  const btnAddS = document.getElementById('btnAddC2PSub');
  if (btnAddS) btnAddS.addEventListener('click', () => addSub());
  
  const btnCalcS = document.getElementById('btnCalcC2PSubs');
  if (btnCalcS) btnCalcS.addEventListener('click', () => {
    let totalPts = 0, totalCr = 0;
    document.querySelectorAll('#c2pSubjects .subject-row').forEach(row => {
      const gp = parseFloat(row.querySelector('.s-gp').value);
      const cr = parseFloat(row.querySelector('.s-cr').value);
      if(!isNaN(gp) && !isNaN(cr) && cr > 0) {
        totalPts += (gp * cr);
        totalCr += cr;
      }
    });
    if(totalCr === 0) return alert('Enter at least one subject.');
    const cgpa = totalPts / totalCr;
    const pct = cgpa * 9.5;
    document.getElementById('c2pSubCGPA').textContent = cgpa.toFixed(2);
    document.getElementById('c2pSubPct').textContent = pct.toFixed(2) + '%';
    document.getElementById('c2pSubCred').textContent = totalCr;
    document.getElementById('c2pSubResult').classList.add('show');
  });

  const btnResetS = document.getElementById('btnResetC2PSubs');
  if (btnResetS) btnResetS.addEventListener('click', () => {
    document.getElementById('c2pSubjects').innerHTML = '';
    c2pSubCnt = 0;
    document.getElementById('c2pSubResult').classList.remove('show');
    addSub('Mathematics','','4'); addSub('Physics','','3'); addSub('Chemistry','','3');
  });
  
  if (document.getElementById('c2pSubjects') && document.getElementById('c2pSubjects').children.length === 0) {
    addSub('Mathematics','','4'); addSub('Physics','','3'); addSub('Chemistry','','3');
  }
}

// 3. Grade Calculator Page
let gradeSubCnt = 0;
function initGradeCalc() {
  const container = document.getElementById('gradeSubjects');
  if (!container) return;
  
  const addSub = (n='', mk='', cr='') => {
    gradeSubCnt++;
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.id = 'grsub_' + gradeSubCnt;
    div.innerHTML = `<input type="text" placeholder="Subject ${gradeSubCnt}" value="${n}">
      <input type="number" placeholder="Marks %" class="s-mk" value="${mk}">
      <input type="number" placeholder="Credits" class="s-cr" value="${cr}">
      <button class="btn-del" title="Remove">×</button>`;
    div.querySelector('.btn-del').onclick = () => div.remove();
    container.appendChild(div);
  };

  const btnAdd = document.getElementById('btnAddGradeSub');
  if (btnAdd) btnAdd.addEventListener('click', () => addSub());
  
  const btnCalc = document.getElementById('btnCalcGrade');
  if (btnCalc) btnCalc.addEventListener('click', () => {
    let totalPts = 0, totalCr = 0;
    document.querySelectorAll('#gradeSubjects .subject-row').forEach(row => {
      const mk = parseFloat(row.querySelector('.s-mk').value);
      const cr = parseFloat(row.querySelector('.s-cr').value);
      if(!isNaN(mk) && !isNaN(cr)) {
        const { gp } = getGradeFromMarks(mk);
        totalPts += (gp * cr);
        totalCr += cr;
      }
    });
    if(totalCr === 0) return alert('Please add at least one subject.');
    const cgpa = totalPts / totalCr;
    document.getElementById('resGCGPA').textContent = cgpa.toFixed(2);
    document.getElementById('resGPCT').textContent = (cgpa * 9.5).toFixed(2) + '%';
    const { g } = getGrade(cgpa * 9.5);
    document.getElementById('resGGrade').textContent = g;
    document.getElementById('gradeResult').classList.add('show');
  });

  const btnReset = document.getElementById('btnResetGrade');
  if (btnReset) btnReset.addEventListener('click', () => {
    container.innerHTML = '';
    gradeSubCnt = 0;
    document.getElementById('gradeResult').classList.remove('show');
    for(let i=0; i<6; i++) addSub();
  });

  if (container.children.length === 0) {
    for(let i=0; i<6; i++) addSub();
  }
}

// 4. SGPA to CGPA Page
let sgpaSubCnt = 0;
function initSGPACalc() {
  const container = document.getElementById('sgpaList');
  if (!container) return;
  
  const addSem = (n='', val='', cr='') => {
    sgpaSubCnt++;
    const div = document.createElement('div');
    div.className = 'subject-row';
    div.id = 'sgsub_' + sgpaSubCnt;
    div.innerHTML = `<input type="text" value="${n || 'Semester ' + sgpaSubCnt}">
      <input type="number" placeholder="SGPA" class="s-val" step="0.01" value="${val}">
      <input type="number" placeholder="Total Credits" class="s-cr" value="${cr}">
      <button class="btn-del" title="Remove">×</button>`;
    div.querySelector('.btn-del').onclick = () => div.remove();
    container.appendChild(div);
  };

  const btnAdd = document.getElementById('btnAddSGPASem');
  if (btnAdd) btnAdd.addEventListener('click', () => addSem());
  
  const btnCalc = document.getElementById('btnCalcSGPA');
  if (btnCalc) btnCalc.addEventListener('click', () => {
    let totalPts = 0, totalCr = 0;
    document.querySelectorAll('#sgpaList .subject-row').forEach(row => {
      const val = parseFloat(row.querySelector('.s-val').value);
      const cr = parseFloat(row.querySelector('.s-cr').value);
      if(!isNaN(val) && !isNaN(cr)) {
        totalPts += (val * cr);
        totalCr += cr;
      }
    });
    if(totalCr === 0) return alert('Enter at least one semester.');
    const result = totalPts / totalCr;
    document.getElementById('resSCGPA').textContent = result.toFixed(2);
    document.getElementById('resSPCT').textContent = (result * 9.5).toFixed(2) + '%';
    document.getElementById('sgpaResult').classList.add('show');
  });

  const btnReset = document.getElementById('btnResetSGPA');
  if (btnReset) btnReset.addEventListener('click', () => {
    container.innerHTML = '';
    sgpaSubCnt = 0;
    document.getElementById('sgpaResult').classList.remove('show');
    for(let i=1; i<=4; i++) addSem('Semester ' + i);
  });

  if (container.children.length === 0) {
    for(let i=1; i<=4; i++) addSem('Semester ' + i);
  }
}

// 5. Percentage to CGPA Page
function initP2C() {
  const btn = document.getElementById('btnCalcP2C');
  if (!btn) return;
  const pctInput = document.getElementById('p2cPct');
  
  btn.addEventListener('click', () => {
    const pct = parseFloat(pctInput.value);
    const univ = document.getElementById('p2cUniv').value;
    if (isNaN(pct) || pct < 0 || pct > 100) return alert('Enter valid percentage (0-100)');
    const cgpa = toCGPA(pct, 10, univ);
    document.getElementById('resPCGPA').textContent = cgpa.toFixed(2);
    const { g } = getGrade(pct);
    document.getElementById('resPGrade').textContent = g;
    document.getElementById('p2cResult').classList.add('show');
  });
  
  if(pctInput) {
    pctInput.addEventListener('keypress', e => { if (e.key === 'Enter') btn.click(); });
  }

  const btnReset = document.getElementById('btnResetP2C');
  if(btnReset) {
    btnReset.addEventListener('click', () => {
      pctInput.value = '';
      document.getElementById('p2cResult').classList.remove('show');
    });
  }
}

// ── INITIALIZATION ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Shared
  buildSidebarTable();
  
  // FAQ Accordion Listeners
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => toggleFAQ(q));
    q.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') toggleFAQ(q);
    });
  });

  // Page Specific
  initHome();
  initC2P();
  initGradeCalc();
  initSGPACalc();
  initP2C();
  
  // Table pages
  if (document.getElementById('table10')) {
    const buildTable10 = () => {
      const t = document.getElementById('table10');
      let html = `<thead><tr><th>CGPA (10-pt)</th><th>% (×9.5)</th><th>Mumbai % ((C–0.5)×10)</th><th>Grade</th><th>Division</th></tr></thead><tbody>`;
      for (let c = 100; c >= 30; c--) {
        const cgpa = c / 10;
        const pct1 = (cgpa * 9.5).toFixed(2) + '%';
        const pct2 = ((cgpa - 0.5) * 10).toFixed(2) + '%';
        const { g, cl } = getGrade(cgpa * 9.5);
        html += `<tr><td>${cgpa.toFixed(1)}</td><td>${pct1}</td><td>${pct2}</td><td>${g}</td><td>${cl}</td></tr>`;
      }
      html += '</tbody>';
      t.innerHTML = html;
    };
    buildTable10();
  }
  
  if (document.getElementById('table4')) {
    const buildTable4 = () => {
      const t = document.getElementById('table4');
      const pts = [[4.0,'A+'],[3.7,'A'],[3.3,'A-'],[3.0,'B+'],[2.7,'B'],[2.3,'B-'],[2.0,'C+'],[1.7,'C'],[1.3,'C-'],[1.0,'D'],[0.0,'F']];
      let html = `<thead><tr><th>GPA (4-pt)</th><th>Percentage</th><th>Grade Letter</th></tr></thead><tbody>`;
      for (const [gpa, g] of pts) {
        html += `<tr><td>${gpa.toFixed(1)}</td><td>${((gpa / 4) * 100).toFixed(1)}%</td><td>${g}</td></tr>`;
      }
      html += '</tbody>';
      t.innerHTML = html;
    };
    buildTable4();
  }
});
