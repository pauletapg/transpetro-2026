/* Visualizador de aula: lê ?t=R01, busca aulas/r01.md e renderiza.
   O cabeçalho sai do frontmatter, com o que faltar preenchido pelo plano. */

const $ = q => document.querySelector(q);
const id = (new URLSearchParams(location.search).get('t') || '').trim().toLowerCase();

const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* onde este tópico vive no plano: semana, disciplina, cor, vizinhos */
function localizar(plano) {
  const todos = [];
  let achado = null;
  plano.semanas.forEach(sem => sem.dias.forEach(dia => dia.topicos.forEach(t => {
    const item = { t, sem, dia, disc: plano.disciplinas[dia.disc] || {} };
    todos.push(item);
    if (t.id.toLowerCase() === id) achado = item;
  })));
  return { achado, todos };
}

async function abrir() {
  if (!id) return vazio('Nenhuma aula indicada', 'Volte ao calendário e abra a sessão do dia.');

  const [plano, indice] = await Promise.all([
    fetch('dados/plano.json', { cache: 'no-store' }).then(r => r.json()).catch(() => null),
    fetch('dados/aulas.json', { cache: 'no-store' }).then(r => r.json()).catch(() => ({ aulas: [] }))
  ]);

  // o caminho do arquivo vem do indice: a aula pode estar em qualquer pasta,
  // com qualquer nome. O que liga e o campo "id" do frontmatter.
  const caminho = (indice.arquivos || {})[id];
  const texto = caminho
    ? await fetch(caminho.split('/').map(encodeURIComponent).join('/'))
        .then(r => r.ok ? r.text() : null).catch(() => null)
    : null;

  const { achado, todos } = plano ? localizar(plano) : { achado: null, todos: [] };
  const cor = achado?.disc.cor;
  if (cor) document.documentElement.style.setProperty('--accent', cor);

  vizinhos(todos, indice);

  if (texto === null) {
    return vazio(
      achado ? achado.t.t : id.toUpperCase(),
      `Esta aula ainda não foi escrita. Copie <code>aulas/_MODELO.md</code> para a pasta da ` +
      `disciplina, dê um nome legível e ponha <code>id: ${esc(id.toUpperCase())}</code> no frontmatter. ` +
      `Ela aparece aqui na próxima vez que você rodar o <code>iniciar.bat</code>.`);
  }

  const { meta, html } = MD.parse(texto);

  document.title = (meta.titulo || achado?.t.t || id.toUpperCase()) + ' · TRANSPETRO 2026';
  $('#titulo').textContent = meta.titulo || achado?.t.t || id.toUpperCase();
  $('#tag').textContent = meta.tag
    || (achado ? `Semana ${achado.sem.n} · ${achado.disc.nome || ''}` : 'Aula avulsa');
  $('#resumo').textContent = meta.resumo || '';
  $('#resumo').hidden = !meta.resumo;

  const pesos = [];
  pesos.push(`ID · ${(meta.id || id).toUpperCase()}`);
  if (meta.tempo) pesos.push(meta.tempo);
  else if (achado) pesos.push(`${achado.dia.min} min`);
  if (achado?.disc.peso) pesos.push(`bloco de ~${achado.disc.peso} pts`);
  if (meta.fonte) pesos.push(meta.fonte);
  $('#meta').innerHTML = pesos.map(p => `<span>${esc(p)}</span>`).join('');

  $('#cabecalho').hidden = false;
  $('#corpo').innerHTML = html;
  organizarQuestoes();
}

/* Agrupa cada questao em <section class="q"> e tira o gabarito de vista.
   Na tela: a resposta certa so acende depois de voce abrir o comentario.
   No PDF: os comentarios saem de perto da questao e viram um caderno de
   gabaritos no fim, para voce responder antes de conferir. */
function organizarQuestoes() {
  const corpo = $('#corpo');
  const questoes = [];

  [...corpo.querySelectorAll('h3')].forEach(h => {
    const m = h.textContent.match(/^\s*(Q\d+)/i);
    if (!m) return;

    const sec = document.createElement('section');
    sec.className = 'q';
    sec.dataset.q = m[1].toUpperCase();
    h.parentNode.insertBefore(sec, h);

    let n = h;
    while (n) {
      const prox = n.nextElementSibling;
      if (n !== h && /^H[1-3]$/.test(n.tagName)) break;
      sec.appendChild(n);
      n = prox;
    }
    questoes.push(sec);
  });
  if (!questoes.length) return;

  const caderno = document.createElement('section');
  caderno.className = 'gabaritos';
  caderno.innerHTML = '<h2>Gabarito comentado</h2>';

  questoes.forEach(sec => {
    const det = sec.querySelector('details');
    if (!det) return;

    // acende a alternativa certa so quando o comentario abre
    det.addEventListener('toggle', () => sec.classList.toggle('revelada', det.open));

    const certa = sec.querySelector('li.ok');
    const letra = certa
      ? String.fromCharCode(65 + [...certa.parentNode.children].indexOf(certa))
      : '';

    const item = document.createElement('div');
    item.className = 'gab-item';
    item.innerHTML = `<h3>${esc(sec.dataset.q)}${letra ? ' · resposta ' + letra : ''}</h3>`;
    [...det.children].forEach(c => {
      if (c.tagName !== 'SUMMARY') item.appendChild(c.cloneNode(true));
    });
    caderno.appendChild(item);
  });

  corpo.appendChild(caderno);
}

/* anterior/próxima entre as aulas que existem */
function vizinhos(todos, indice) {
  const existe = indice.aulas || [];
  const escritas = todos.filter(x => existe.includes(x.t.id.toLowerCase()));
  const i = escritas.findIndex(x => x.t.id.toLowerCase() === id);
  if (i === -1) return;
  const liga = (el, alvo) => {
    if (!alvo) return;
    el.href = `aula.html?t=${alvo.t.id.toLowerCase()}`;
    el.title = alvo.t.t;
    el.hidden = false;
  };
  liga($('#anterior'), escritas[i - 1]);
  liga($('#proxima'), escritas[i + 1]);
}

function vazio(titulo, texto) {
  $('#cabecalho').hidden = false;
  $('#tag').textContent = 'Aula pendente';
  $('#titulo').textContent = titulo;
  $('#resumo').hidden = true;
  $('#meta').innerHTML = '';
  $('#corpo').innerHTML = `<div class="box nota"><b>Ainda não existe</b><p>${texto}</p></div>`;
}

$('#imprimir').addEventListener('click', () => window.print());
document.addEventListener('keydown', e => {
  if (e.target.matches('input,textarea')) return;
  if (e.key === 'ArrowLeft' && !$('#anterior').hidden) $('#anterior').click();
  if (e.key === 'ArrowRight' && !$('#proxima').hidden) $('#proxima').click();
});

abrir();
