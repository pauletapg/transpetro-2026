/* TRANSPETRO 2026 — calendário de estudos
   Dados: dados/plano.json (o plano, fixo) + dados/progresso.json (o que você faz, versionado no git).
   Escrita: só onde o navegador consegue gravar no arquivo (Chrome/Edge no desktop).
   Em qualquer outro lugar — celular incluído — a página abre em modo leitura. */

const $ = q => document.querySelector(q);
const LS_KEY = 'transpetro-2026-progresso';
/* Como esta pagina consegue gravar:
     'api' -> servidor local do iniciar.bat (qualquer navegador, inclusive Brave)
     'fs'  -> File System Access API (Chrome/Edge; Brave bloqueia)
     null  -> so leitura (celular, GitHub Pages) */
let MODO_ESCRITA = null;
const CAN_WRITE = () => MODO_ESCRITA !== null;

let plano = null;
let aulasEscritas = [];
let state = { atualizadoEm: '1970-01-01T00:00:00.000Z', sessoes: {} };
let baseline = '';          // atualizadoEm do arquivo lido no carregamento
let week = 0;
let openSession = null;     // { wi, di }
let fileHandle = null;
let returnFocus = null;

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sid = (wi, di) => `${wi}:${di}`;
const sess = (wi, di) => state.sessoes[sid(wi, di)] || null;

/* Questoes feitas nao e digitada: e acertos + erros registrados.
   Assim o numero nunca contradiz a lista de erros. */
const nErros = st => st?.erros?.length || 0;
const nAcertos = st => st?.qHits || 0;
const nTotal = st => nAcertos(st) + nErros(st);
const touch = () => {
  state.atualizadoEm = new Date().toISOString();
  persistLocal(); markDirty(); agendarGravacao();
};

/* Gravacao automatica: com o servidor local gravar e instantaneo, entao nao ha
   motivo para acumular alteracoes pendentes — era isso que fazia o navegador
   perguntar "deseja sair do site?" ao abrir uma aula. */
let timerGravacao = null;
function agendarGravacao() {
  if (MODO_ESCRITA !== 'api') return;      // no modo 'fs' cada gravacao pede permissao: nao automatiza
  clearTimeout(timerGravacao);
  timerGravacao = setTimeout(() => save(true), 700);
}

/* Garante que nada fique pendente antes de sair da pagina. */
async function gravarAgora() {
  clearTimeout(timerGravacao);
  if (MODO_ESCRITA === 'api' && state.atualizadoEm > baseline) await save(true);
}

function ensure(wi, di) {
  const k = sid(wi, di);
  if (!state.sessoes[k]) state.sessoes[k] = { feito: false, qHits: 0, notas: '', erros: [] };
  return state.sessoes[k];
}

/* ---------------- carregamento ---------------- */

async function boot() {
  try {
    plano = await (await fetch('dados/plano.json', { cache: 'no-store' })).json();
  } catch (e) {
    return fatal();
  }
  try {
    aulasEscritas = (await (await fetch('dados/aulas.json', { cache: 'no-store' })).json()).aulas || [];
  } catch (e) { aulasEscritas = []; }

  let doArquivo = { atualizadoEm: '1970-01-01T00:00:00.000Z', sessoes: {} };
  try { doArquivo = await (await fetch('dados/progresso.json', { cache: 'no-store' })).json(); } catch (e) { /* ainda não existe */ }

  let local = null;
  try { local = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) { local = null; }

  // o mais recente vence: o arquivo traz o que veio do git, o localStorage traz o que ainda não foi gravado
  state = (local && local.atualizadoEm > doArquivo.atualizadoEm) ? local : doArquivo;
  // qTotal virou campo derivado: remove o que sobrou de versoes anteriores
  Object.values(state.sessoes || {}).forEach(st => { delete st.qTotal; });
  baseline = doArquivo.atualizadoEm;

    // o servidor local responde /api/ping; no GitHub Pages nao existe e cai para 'fs' ou leitura
  try {
    const r = await fetch('api/ping', { cache: 'no-store' });
    if (r.ok && (await r.json()).grava) MODO_ESCRITA = 'api';
  } catch (e) { /* sem servidor local */ }
  if (!MODO_ESCRITA && 'showSaveFilePicker' in window) MODO_ESCRITA = 'fs';

  if (!CAN_WRITE()) document.body.classList.add('readonly');
  else {
    $('#save').hidden = false;
    if (MODO_ESCRITA === 'fs') fileHandle = await loadHandle();
  }

  week = Math.min(Math.max(0, Number(localStorage.getItem('transpetro-2026-semana') || 0)), plano.semanas.length - 1);

  buildStatic();
  render();
  markDirty();
}

function fatal() {
  document.querySelector('.wrap').innerHTML =
    `<div class="fatal"><h2>Não consegui ler os dados</h2>
     <p>O navegador bloqueia leitura de arquivos quando a página é aberta direto do disco (<code>file://</code>).
     Feche esta aba e inicie pelo atalho — ele sobe um servidor local e abre no endereço certo:</p>
     <code>iniciar.bat</code>
     <p>No celular, use o endereço do GitHub Pages. Lá isso não acontece.</p></div>`;
}

/* ---------------- gravação ---------------- */

function persistLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }

function markDirty() {
  const dirty = state.atualizadoEm > baseline;
  const b = $('#save');
  if (!b || b.hidden) return;
  b.textContent = dirty ? 'Gravar ●' : 'Gravado';
  b.classList.toggle('dirty', dirty);
  b.classList.toggle('accent', !dirty);
}

/* o handle do arquivo fica no IndexedDB para não pedir a pasta toda vez */
function idb() {
  return new Promise(res => {
    const r = indexedDB.open('transpetro-fs', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('h');
    r.onsuccess = () => res(r.result);
    r.onerror = () => res(null);
  });
}
async function saveHandle(h) {
  const db = await idb(); if (!db) return;
  db.transaction('h', 'readwrite').objectStore('h').put(h, 'progresso');
}
async function loadHandle() {
  const db = await idb(); if (!db) return null;
  return new Promise(res => {
    const r = db.transaction('h', 'readonly').objectStore('h').get('progresso');
    r.onsuccess = () => res(r.result || null);
    r.onerror = () => res(null);
  });
}

async function save(silencioso) {
  const blob = JSON.stringify(state, null, 2);

  // caminho principal: o servidor local grava o arquivo
  if (MODO_ESCRITA === 'api') {
    try {
      const r = await fetch('api/progresso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: blob
      });
      if (!r.ok) throw new Error(await r.text());
      baseline = state.atualizadoEm;
      markDirty();
      return silencioso ? undefined : flash('Gravado. Agora rode publicar.bat para o celular ver.');
    } catch (e) {
      return flash('Falhou ao gravar: ' + e.message, true);
    }
  }

  // reserva: File System Access API (Chrome/Edge sem o servidor local)
  try {
    if (fileHandle) {
      const p = await fileHandle.queryPermission({ mode: 'readwrite' });
      if (p !== 'granted' && await fileHandle.requestPermission({ mode: 'readwrite' }) !== 'granted') fileHandle = null;
    }
    if (!fileHandle) {
      fileHandle = await window.showSaveFilePicker({
        suggestedName: 'progresso.json',
        types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }]
      });
      await saveHandle(fileHandle);
    }
    const w = await fileHandle.createWritable();
    await w.write(blob); await w.close();
    baseline = state.atualizadoEm;
    markDirty();
    flash('Gravado em progresso.json — agora rode publicar.bat');
  } catch (e) {
    if (e.name === 'AbortError') return;
    // ultimo recurso: baixar o arquivo para o usuario substituir a mao
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
    a.download = 'progresso.json'; a.click(); URL.revokeObjectURL(a.href);
    flash('Baixei progresso.json — substitua o arquivo em dados/');
  }
}

function flash(msg, erro) {
  const b = $('#save'); if (!b) return;
  b.textContent = erro ? '✕ erro' : '✓';
  b.title = msg;
  setTimeout(markDirty, erro ? 4000 : 1400);
}

/* ---------------- render ---------------- */

function buildStatic() {
  const sel = $('#weekSelect');
  plano.semanas.forEach((s, i) => {
    const o = document.createElement('option');
    o.value = i; o.textContent = `Semana ${String(s.n).padStart(2, '0')} · ${s.titulo}`;
    sel.appendChild(o);
  });
  $('#legend').innerHTML = Object.entries(plano.disciplinas)
    .map(([, d]) => `<span style="--c:${d.cor}"><i></i>${esc(d.nome)}${d.peso ? ` · ~${d.peso} pts` : ''}</span>`).join('');
  $('#eyebrow').textContent = plano.meta.concurso.split('·').pop().trim();

  const prova = new Date(plano.meta.prova + 'T00:00:00');
  const dias = Math.max(0, Math.ceil((prova - new Date()) / 864e5));
  $('#daysLeft').textContent = dias;
  $('#proofDate').textContent = `dias · prova em ${prova.toLocaleDateString('pt-BR')}`;
}

/* título do card: o assunto de cada tópico, sem a explicação depois do travessão */
function foco(dia) {
  const corta = s => s.length <= 46 ? s : s.slice(0, 45).replace(/\s+\S*$/, '') + '…';
  return corta(dia.topicos
    .map(t => t.t.split(/\s*[—:(]|\s+-\s+/)[0].trim())
    .join(' · '));
}

function render() {
  const s = plano.semanas[week];
  $('#weekSelect').value = week;
  $('#weekTitle').textContent = `Semana ${s.n} · ${s.titulo}`;
  $('#weekMeta').textContent = s.meta;
  $('#weekCount').textContent = `SEMANA ${String(s.n).padStart(2, '0')} / ${plano.semanas.length}`;
  $('#prev').disabled = week === 0;
  $('#next').disabled = week === plano.semanas.length - 1;

  $('#calendar').innerHTML = s.dias.map((dia, di) => {
    const d = plano.disciplinas[dia.disc] || { nome: dia.disc, cor: 'var(--rest)' };
    const st = sess(week, di);
    const done = st?.feito;
    const nErr = nErros(st), tot = nTotal(st);
    const score = tot
      ? `<div class="score"><span class="hit">${nAcertos(st)}/${tot} acertos</span>
         <span>${Math.round((nAcertos(st) / tot) * 100)}%</span>
         ${nErr ? `<span class="miss">${nErr} erro${nErr > 1 ? 's' : ''}</span>` : ''}</div>`
      : '';

    return `<div class="day-shell ${done ? 'is-done' : ''}" style="--i:${di};--accent:${d.cor}">
      <article class="day">
        <header class="day-head">
          <span class="weekday">${esc(dia.d)}</span>
          <span class="session-state"><i></i>${done ? 'concluída' : 'pendente'}</span>
        </header>
        <h2 class="subject">${esc(foco(dia))}</h2>
        <span class="time">${dia.min} min · ${esc(d.nome)}${st?.notas ? ' · com anotação' : ''}</span>
        <div class="topics">${dia.topicos.map((t, n) =>
          `<div class="topic"><i>${String(n + 1).padStart(2, '0')}</i><span>${esc(t.t)}</span></div>`).join('')}</div>
        ${score}
        <button class="open" data-di="${di}">Abrir sessão <i>↗</i></button>
      </article></div>`;
  }).join('');

  document.querySelectorAll('.open').forEach(b =>
    b.addEventListener('click', () => openDay(Number(b.dataset.di), b)));
  requestAnimationFrame(() => document.querySelectorAll('.day-shell').forEach(c => c.classList.add('visible')));

  localStorage.setItem('transpetro-2026-semana', week);
  updateStats();
}

function updateStats() {
  const s = plano.semanas[week];
  const doneWeek = s.dias.filter((_, di) => sess(week, di)?.feito).length;
  $('#progressText').textContent = `${doneWeek} / ${s.dias.length} sessões`;
  $('#progressFill').style.transform = `scaleX(${doneWeek / s.dias.length})`;

  let done = 0, total = 0, qT = 0, qH = 0, errs = 0;
  plano.semanas.forEach((sem, wi) => sem.dias.forEach((_, di) => {
    total++;
    const st = sess(wi, di); if (!st) return;
    if (st.feito) done++;
    qT += nTotal(st); qH += nAcertos(st); errs += nErros(st);
  }));

  // acerto só desta semana — muda quando você troca de semana
  let sT = 0, sH = 0;
  s.dias.forEach((_, di) => { const st = sess(week, di); sT += nTotal(st); sH += nAcertos(st); });
  // >>> Texto do acerto da semana. Para mudar o rótulo, é esta linha. <<<
  const elSem = $('#weekHit');
  elSem.textContent = sT
    ? `ACERTOS · ${Math.round((sH / sT) * 100)}% · ${sH}/${sT}`
    : 'ACERTOS · sem questões';
  elSem.classList.toggle('bom', sT > 0 && sH / sT >= 0.7);
  elSem.classList.toggle('ruim', sT > 0 && sH / sT < 0.5);

  $('#doneAll').textContent = done;
  document.querySelector('#doneAll + small').textContent = `concluídas de ${total}`;
  $('#hitRate').textContent = qT ? Math.round((qH / qT) * 100) + '%' : '—';
  $('#hitDetail').textContent = qT ? `${qH} acertos em ${qT} questões` : 'nenhuma questão registrada';
  $('#errTotal').textContent = errs;
  $('#errCount').textContent = errs;

  $('#weekBars').innerHTML = plano.semanas.map((sem, wi) => {
    const d = sem.dias.filter((_, di) => sess(wi, di)?.feito).length;
    const h = Math.max(4, Math.round((d / sem.dias.length) * 34));
    return `<i class="${d ? 'on' : ''} ${wi === week ? 'now' : ''}" style="height:${h}px" title="Semana ${sem.n}: ${d}/${sem.dias.length}"></i>`;
  }).join('');
}

/* ---------------- diálogo da sessão ---------------- */

function openDay(di, trigger) {
  const dia = plano.semanas[week].dias[di];
  const d = plano.disciplinas[dia.disc] || { nome: dia.disc, cor: 'var(--rest)' };
  const st = sess(week, di) || { feito: false, qHits: 0, notas: '', erros: [] };
  openSession = { wi: week, di }; returnFocus = trigger;

  $('#detail .dialog-core').style.setProperty('--accent', d.cor);
  $('#dialogKicker').textContent = `${dia.d} · Semana ${plano.semanas[week].n} · ${dia.min} min`;
  $('#dialogTitle').textContent = d.nome;

  $('#nodeList').innerHTML = dia.topicos.map(t => {
    const escrita = aulasEscritas.includes(t.id.toLowerCase());
    const destino = t.aula || `aula.html?t=${encodeURIComponent(t.id.toLowerCase())}`;
    return `<a class="node${escrita ? '' : ' no-aula'}" href="${esc(destino)}">
      <span class="node-id">${esc(t.id)}</span>
      <span><b>${esc(t.t)}</b><small>${escrita ? 'abrir a aula' : 'aula ainda não escrita'}</small></span>
      <span class="node-go">↗</span></a>`;
  }).join('');

  $('#qHits').value = st.qHits || '';
  atualizaContadores(st);
  $('#notes').value = st.notas || '';
  $('#toggleDone').textContent = st.feito ? 'Reabrir sessão' : 'Marcar como concluída';

  [...document.querySelectorAll('#detail input,#detail textarea')]
    .forEach(el => { if (!el.readOnly) el.disabled = !CAN_WRITE(); });

  // grava o que estiver pendente ANTES de sair para a aula
  document.querySelectorAll('#nodeList .node').forEach(a => a.addEventListener('click', async e => {
    if (MODO_ESCRITA !== 'api' || state.atualizadoEm <= baseline) return;
    e.preventDefault();
    saveFields();
    await gravarAgora();
    location.href = a.getAttribute('href');
  }));
  $('#errAddBtn').disabled = !CAN_WRITE();
  $('#toggleDone').disabled = !CAN_WRITE();

  renderErrs();
  $('#detail').showModal();
  setTimeout(() => $('#close').focus(), 40);
}

/* Histórico de refação: cada vez que você refaz a questão, marca acertou ou
   errou. O placar mostra a sequência na ordem, para você ver se está fixando. */
function placar(rev) {
  if (!rev || !rev.length) return '<span class="rev-vazio">ainda não refiz</span>';
  const acertos = rev.filter(r => r.acertou).length;
  const bolinhas = rev.map(r =>
    `<i class="${r.acertou ? 'v' : 'x'}" title="${esc(r.em)}">${r.acertou ? '✓' : '✕'}</i>`).join('');
  return `<span class="rev-placar">${bolinhas}<b>${acertos}/${rev.length}</b></span>`;
}

function renderErrs() {
  const st = sess(openSession.wi, openSession.di);
  const list = st?.erros || [];
  const trava = CAN_WRITE() ? '' : 'disabled';

  $('#errList').innerHTML = list.length
    ? list.map((e, i) => `<div class="err">
        <span class="err-q">${esc(e.q || '—')}</span>
        <span>
          <b>${esc(e.assunto)}</b><small>${esc(e.porque)}</small>
          ${e.tag ? `<span class="err-tag">${esc(e.tag)}</span>` : ''}
          <span class="rev-linha">
            ${placar(e.revisoes)}
            <button class="rev-btn v" data-i="${i}" data-ok="1" ${trava}>✓ acertei</button>
            <button class="rev-btn x" data-i="${i}" data-ok="0" ${trava}>✕ errei</button>
          </span>
        </span>
        <button class="err-del" data-i="${i}" ${trava} aria-label="Remover">×</button></div>`).join('')
    : `<div class="empty">Nenhum erro registrado nesta sessão.</div>`;

  document.querySelectorAll('#errList .err-del').forEach(b => b.addEventListener('click', () => {
    const st2 = ensure(openSession.wi, openSession.di);
    st2.erros.splice(Number(b.dataset.i), 1);
    atualizaContadores(st2);
    touch(); renderErrs(); render();
  }));

  document.querySelectorAll('#errList .rev-btn').forEach(b => b.addEventListener('click', () => {
    const erro = ensure(openSession.wi, openSession.di).erros[Number(b.dataset.i)];
    (erro.revisoes = erro.revisoes || []).push({
      em: new Date().toISOString().slice(0, 10),
      acertou: b.dataset.ok === '1'
    });
    touch(); renderErrs(); render();
  }));
}

function addErr() {
  const assunto = $('#eSubj').value.trim();
  const porque = $('#eWhy').value.trim();
  if (!assunto && !porque) { $('#eSubj').focus(); return; }

  saveFields();                       // guarda o que já estiver nos campos de desempenho
  const s = ensure(openSession.wi, openSession.di);
  s.erros.push({
    q: $('#eQ').value.trim(), assunto, porque,
    tag: $('#eTag').value.trim(), em: new Date().toISOString().slice(0, 10),
    revisoes: []
  });
  atualizaContadores(s);          // o total sobe sozinho: ele é acertos + erros

  ['#eQ', '#eSubj', '#eWhy', '#eTag'].forEach(q => $(q).value = '');
  touch(); renderErrs(); render(); $('#eQ').focus();
}

function atualizaContadores(st) {
  $('#qMiss').value = nErros(st);
  $('#qTotal').value = nTotal(st);
  const t = nTotal(st);
  $('#qHint').textContent = t
    ? `${nAcertos(st)} de ${t} — ${Math.round((nAcertos(st) / t) * 100)}% de acerto nesta sessão.`
    : 'Informe os acertos; cada erro registrado abaixo entra no total sozinho.';
}

function saveFields() {
  if (!openSession || !CAN_WRITE()) return;
  const s = ensure(openSession.wi, openSession.di);
  s.qHits = Math.max(0, Number($('#qHits').value) || 0);
  s.notas = $('#notes').value;
  atualizaContadores(s);
  touch();
}

function closeDetail() {
  saveFields();
  if ($('#detail').open) $('#detail').close();
  render();
  if (returnFocus) returnFocus.focus();
}

/* ---------------- painel global de erros ---------------- */

let errFilter = null;

function allErrs() {
  const out = [];
  plano.semanas.forEach((sem, wi) => sem.dias.forEach((dia, di) => {
    (sess(wi, di)?.erros || []).forEach(e => out.push({ ...e, semana: sem.n, dia: dia.d, disc: dia.disc }));
  }));
  return out;
}

function openErrPanel() {
  const list = allErrs();
  const porAssunto = {};
  list.forEach(e => { const k = e.assunto || 'sem assunto'; porAssunto[k] = (porAssunto[k] || 0) + 1; });
  const ranked = Object.entries(porAssunto).sort((a, b) => b[1] - a[1]);

  const pl = (n, s, p) => `${n} ${n === 1 ? s : p}`;
  $('#errSummary').textContent = list.length
    ? `${pl(list.length, 'erro', 'erros')} em ${pl(ranked.length, 'assunto', 'assuntos')}. O topo desta lista é a sua revisão da semana 12.`
    : 'Nada registrado ainda. Cada erro anotado aqui vale mais que uma hora de leitura passiva.';

  $('#errFilters').innerHTML = ranked.map(([k, n]) =>
    `<button class="chip ${errFilter === k ? 'on' : ''}" data-k="${esc(k)}">${esc(k)} · ${n}</button>`).join('');
  document.querySelectorAll('#errFilters .chip').forEach(c => c.addEventListener('click', () => {
    errFilter = errFilter === c.dataset.k ? null : c.dataset.k; openErrPanel();
  }));

  const shown = errFilter ? list.filter(e => (e.assunto || 'sem assunto') === errFilter) : list;
  $('#errAll').innerHTML = shown.length
    ? shown.map(e => `<div class="err">
        <span class="err-q">${esc(e.q || '—')}</span>
        <span><b>${esc(e.assunto)}</b><small>${esc(e.porque)}</small>
        <span class="err-tag">S${e.semana} · ${esc(e.dia)}${e.tag ? ' · ' + esc(e.tag) : ''}</span>
        <span class="rev-linha">${placar(e.revisoes)}</span></span>
        <span></span></div>`).join('')
    : `<div class="empty">Nenhum erro registrado.</div>`;

  if (!$('#errPanel').open) $('#errPanel').showModal();
}

/* ---------------- banca, TRANSPETRO e ajuda ---------------- */

const INFOS = { banca: 'Sobre a banca', transpetro: 'Sobre a TRANSPETRO', ajuda: 'Ajuda' };
const cacheInfo = {};

async function abrirInfo(qual) {
  qual = qual || 'banca';
  $('#infoTitulo').textContent = INFOS[qual] || qual;
  document.querySelectorAll('#infoTabs .chip')
    .forEach(c => c.classList.toggle('on', c.dataset.f === qual));

  if (!cacheInfo[qual]) {
    $('#infoCorpo').innerHTML = '<div class="empty">carregando…</div>';
    try {
      const t = await (await fetch(`info/${qual}.md`)).text();
      cacheInfo[qual] = MD.parse(t).html;
    } catch (e) {
      cacheInfo[qual] = `<div class="empty">Não consegui abrir <code>info/${qual}.md</code>.</div>`;
    }
  }
  $('#infoCorpo').innerHTML = cacheInfo[qual];
  if (!$('#infoPanel').open) $('#infoPanel').showModal();
}

/* ---------------- eventos ---------------- */

$('#prev').addEventListener('click', () => { if (week > 0) { week--; render(); } });
$('#next').addEventListener('click', () => { if (week < plano.semanas.length - 1) { week++; render(); } });
$('#weekSelect').addEventListener('change', e => { week = Number(e.target.value); render(); });
$('#close').addEventListener('click', closeDetail);
$('#closeFooter').addEventListener('click', closeDetail);
$('#detail').addEventListener('click', e => { if (e.target === $('#detail')) closeDetail(); });
$('#detail').addEventListener('cancel', e => { e.preventDefault(); closeDetail(); });
$('#errAddBtn').addEventListener('click', addErr);
$('#eTag').addEventListener('keydown', e => { if (e.key === 'Enter') addErr(); });
$('#toggleDone').addEventListener('click', () => {
  const s = ensure(openSession.wi, openSession.di);
  s.feito = !s.feito;
  $('#toggleDone').textContent = s.feito ? 'Reabrir sessão' : 'Marcar como concluída';
  saveFields(); touch(); render();
});
['#qHits', '#notes'].forEach(s => $(s).addEventListener('change', saveFields));
$('#save').addEventListener('click', save);
$('#openErrors').addEventListener('click', openErrPanel);
$('#openInfo').addEventListener('click', () => abrirInfo('banca'));
$('#infoClose').addEventListener('click', () => $('#infoPanel').close());
$('#infoPanel').addEventListener('click', e => { if (e.target === $('#infoPanel')) $('#infoPanel').close(); });
document.querySelectorAll('#infoTabs .chip')
  .forEach(c => c.addEventListener('click', () => abrirInfo(c.dataset.f)));
$('#errClose').addEventListener('click', () => $('#errPanel').close());
$('#errPanel').addEventListener('click', e => { if (e.target === $('#errPanel')) $('#errPanel').close(); });

document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea,select')) return;
  if (e.key === 'ArrowLeft') $('#prev').click();
  if (e.key === 'ArrowRight') $('#next').click();
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (!$('#save').hidden) save(); }
});

// so avisa onde a gravacao nao pode ser automatica (Chrome/Edge sem o servidor)
window.addEventListener('beforeunload', e => {
  if (MODO_ESCRITA === 'fs' && state.atualizadoEm > baseline) { e.preventDefault(); e.returnValue = ''; }
});

const io = new IntersectionObserver(en => en.forEach(x => {
  if (x.isIntersecting) { x.target.classList.add('visible'); io.unobserve(x.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

boot();
