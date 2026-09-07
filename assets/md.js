/* Renderizador Markdown sem dependência externa.
   Cobre o que uma aula precisa e o que o Obsidian escreve:
   títulos, listas, listas de tarefa, tabelas, código, citações,
   callouts (> [!tipo]) e HTML solto no meio do texto. */
(function (global) {

  const CALLOUT = {
    banca: 'banca', tip: 'banca', success: 'banca', sucesso: 'banca',
    trap: 'trap', pegadinha: 'trap', warning: 'trap', danger: 'trap', bug: 'trap', erro: 'trap',
    nota: 'nota', note: 'nota', info: 'nota', quote: 'nota',
    decore: 'decor', decor: 'decor', example: 'decor', abstract: 'decor', resumo: 'decor',
    analogia: 'analogia', analogy: 'analogia', metafora: 'analogia',
    gabarito: 'gab', question: 'gab', pergunta: 'gab',
    checklist: 'check', vespera: 'check', todo: 'check',
    fonte: 'fonte', origem: 'fonte', source: 'fonte',
    imagem: 'imagem', figura: 'imagem'
  };
  const TITULO = {
    banca: 'O que a banca cobra', trap: 'Pegadinha', nota: 'Nota',
    decor: 'Decore assim', gab: 'Comentário', check: 'Checklist de véspera',
    fonte: 'Fonte', imagem: 'Falta a imagem', analogia: 'Analogia'
  };

  const SENT = String.fromCharCode(0xE000);   // uso privado: nunca ocorre em texto real
  const RESTORE = new RegExp(SENT + '([0-9]+)' + SENT, 'g');

  const escAttr = s => String(s).replace(/"/g, '&quot;');
  const escCode = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /* ---------- nível de linha ---------- */
  function inline(t) {
    const guard = [];
    const hide = h => SENT + (guard.push(h) - 1) + SENT;

    t = t.replace(/`([^`]+)`/g, (_, c) => hide(`<code>${escCode(c)}</code>`));
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, s) => hide(`<img src="${escAttr(s)}" alt="${escAttr(a)}">`));
    t = t.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, alvo, txt) =>
      hide(`<a href="aula.html?t=${escAttr(alvo.trim().toLowerCase())}">${txt || alvo}</a>`));
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, x, s) => hide(`<a href="${escAttr(s)}">${x}</a>`));

    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*\w])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    t = t.replace(/==([^=\n]+)==/g, '<mark>$1</mark>');
    t = t.replace(/~~([^~\n]+)~~/g, '<del>$1</del>');

    return t.replace(RESTORE, (_, i) => guard[i]);
  }

  const indent = l => l.match(/^\s*/)[0].replace(/\t/g, '  ').length;
  const isUL = l => /^\s*[-*+]\s+/.test(l);
  const isOL = l => /^\s*\d+[.)]\s+/.test(l);
  const corpo = l => l.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '');

  /* ---------- listas, com um nível de aninhamento ---------- */
  function lista(linhas, i, out) {
    const base = indent(linhas[i]);
    const ordenada = isOL(linhas[i]);
    let html = ordenada ? '<ol>' : '<ul>';

    while (i < linhas.length) {
      const l = linhas[i];
      if (!l.trim()) { if (!linhas[i + 1] || !(isUL(linhas[i + 1]) || isOL(linhas[i + 1]))) break; i++; continue; }
      if (!(isUL(l) || isOL(l)) || indent(l) < base) break;

      if (indent(l) > base) {                      // sub-lista
        const sub = [];
        i = lista(linhas, i, sub);
        html = html.replace(/<\/li>$/, sub.join('') + '</li>');
        continue;
      }

      let txt = corpo(l), cls = '';
      const tarefa = txt.match(/^\[([ xX])\]\s*(.*)$/);
      if (tarefa) { cls = tarefa[1].toLowerCase() === 'x' ? ' class="ok"' : ''; txt = tarefa[2]; }
      html += `<li${cls}>${inline(txt)}</li>`;
      i++;
    }
    out.push(html + (ordenada ? '</ol>' : '</ul>'));
    return i;
  }

  /* ---------- tabelas ---------- */
  function tabela(linhas, i, out) {
    const celulas = l => l.replace(/^\s*\|?|\|?\s*$/g, '').split('|').map(c => c.trim());
    const cab = celulas(linhas[i]);
    let html = `<div class="tbl"><table><thead><tr>${cab.map(c => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>`;
    i += 2;
    while (i < linhas.length && linhas[i].includes('|') && linhas[i].trim()) {
      html += `<tr>${celulas(linhas[i]).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`;
      i++;
    }
    out.push(html + '</tbody></table></div>');
    return i;
  }

  /* ---------- citação e callout ---------- */
  function citacao(linhas, i, out) {
    const dentro = [];
    while (i < linhas.length && /^\s*>/.test(linhas[i])) {
      dentro.push(linhas[i].replace(/^\s*>\s?/, ''));
      i++;
    }
    const cab = (dentro[0] || '').match(/^\[!(\w+)\]([+-]?)\s*(.*)$/);
    if (!cab) { out.push(`<blockquote>${blocos(dentro)}</blockquote>`); return i; }

    const tipo = CALLOUT[cab[1].toLowerCase()] || 'nota';
    const titulo = cab[3].trim() || TITULO[tipo] || cab[1];
    const conteudo = blocos(dentro.slice(1));

    if (tipo === 'gab' || cab[2] === '-')
      out.push(`<details${cab[2] === '+' ? ' open' : ''}><summary>${inline(titulo)}</summary>${conteudo}</details>`);
    else if (tipo === 'check')
      out.push(`<div class="check"><b>${inline(titulo)}</b>${conteudo}</div>`);
    else
      out.push(`<div class="box ${tipo}"><b>${inline(titulo)}</b>${conteudo}</div>`);
    return i;
  }

  /* ---------- blocos ---------- */
  function blocos(linhas) {
    const out = [];
    let i = 0, paragrafo = [];

    const fecha = () => {
      if (paragrafo.length) { out.push(`<p>${inline(paragrafo.join('\n'))}</p>`); paragrafo = []; }
    };

    while (i < linhas.length) {
      const l = linhas[i];

      if (/^\s*```/.test(l)) {                                   // código cercado
        fecha();
        const lang = l.replace(/^\s*```/, '').trim();
        const buf = [];
        i++;
        while (i < linhas.length && !/^\s*```/.test(linhas[i])) buf.push(linhas[i++]);
        i++;
        out.push(`<pre><code${lang ? ` class="lang-${escAttr(lang)}"` : ''}>${escCode(buf.join('\n'))}</code></pre>`);
        continue;
      }
      if (!l.trim()) { fecha(); i++; continue; }
      if (/^\s*(?:---+|\*\*\*+|___+)\s*$/.test(l)) { fecha(); out.push('<hr>'); i++; continue; }

      const h = l.match(/^(#{1,6})\s+(.*)$/);
      if (h) { fecha(); out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

      if (/^\s*>/.test(l)) { fecha(); i = citacao(linhas, i, out); continue; }
      if (isUL(l) || isOL(l)) { fecha(); i = lista(linhas, i, out); continue; }

      if (l.includes('|') && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(linhas[i + 1] || '')) {
        fecha(); i = tabela(linhas, i, out); continue;
      }
      if (/^\s*<(\w+|\/)/.test(l)) { fecha(); out.push(l); i++; continue; }   // HTML solto

      paragrafo.push(l);
      i++;
    }
    fecha();
    return out.join('\n');
  }

  /* ---------- frontmatter do Obsidian ---------- */
  function separa(texto) {
    const m = texto.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return { meta: {}, corpo: texto.replace(/\r\n/g, '\n') };
    const meta = {};
    m[1].split('\n').forEach(l => {
      const p = l.indexOf(':');
      if (p > 0) meta[l.slice(0, p).trim()] = l.slice(p + 1).trim().replace(/^["']|["']$/g, '');
    });
    return { meta, corpo: m[2] };
  }

  global.MD = {
    render: t => blocos(t.replace(/\r\n/g, '\n').split('\n')),
    parse: t => { const { meta, corpo } = separa(t); return { meta, html: blocos(corpo.split('\n')) }; }
  };
})(window);
