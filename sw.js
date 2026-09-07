/* Offline. Depois da primeira visita, calendário e aulas abrem sem internet.
   Caminhos relativos de propósito: o GitHub Pages serve de /nome-do-repo/. */

/* Suba este numero sempre que mudar a estrategia de cache aqui: o activate
   apaga todo cache com nome diferente, e e assim que quem ja tem uma copia
   velha guardada recebe a nova. */
const CACHE = 'transpetro-2026-3';
const SHELL = [
  './',
  './index.html',
  './aula.html',
  './assets/app.css',
  './assets/app.js',
  './assets/aula.css',
  './assets/aula.js',
  './assets/md.js',
  './dados/plano.json',
  './dados/aulas.json',
  './dados/progresso.json'
];

/* guarda o shell e todas as aulas do índice — completas e resumidas */
async function encher() {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })));
  try {
    const idx = await (await fetch('./dados/aulas.json', { cache: 'reload' })).json();
    const caminhos = Object.values(idx.arquivos || {})
      .concat(Object.values(idx.resumos || {}));
    await Promise.all(caminhos.map(c =>
      cache.add(new Request('./' + c.split('/').map(encodeURIComponent).join('/'),
        { cache: 'reload' })).catch(() => {})));
  } catch (e) { /* sem índice ainda: o shell já basta */ }
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(encher());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes.filter(n => n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  const caminho = new URL(req.url).pathname;
  const ehDado = /\/dados\/.*\.json$/.test(caminho);

  /* O CODIGO DO APP vai pela rede primeiro. Sem isto o cache pode servir um
     index.html de uma versao junto com um app.js de outra, e a pagina quebra
     num erro de elemento inexistente. O cache continua sendo a reserva
     quando nao ha internet — o offline nao perde nada. */
  /* O .md DA AULA entra aqui junto com o codigo. Ele e o arquivo que mais
     muda no projeto inteiro — voce reescreve uma aula e salva por cima, com
     o mesmo nome. Se ficar na estrategia "cache primeiro" la de baixo, a
     pagina abre a versao anterior da aula e a nova so aparece na visita
     seguinte, sem nenhum aviso. Foi exatamente o que aconteceu com a R01. */
  const ehCodigo = req.mode === 'navigate' ||
                   /\.(html|js|css|md)$/.test(caminho);

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);

    // dados e código mudam a cada publicação: rede primeiro, cache se estiver offline
    if (ehDado || ehCodigo) {
      try {
        const fresca = await fetch(req);
        if (fresca.ok) cache.put(req, fresca.clone());
        return fresca;
      } catch (e) {
        const guardada = await cache.match(req, { ignoreSearch: true });
        if (guardada) return guardada;
        // navegação offline sem esta página no cache: entrega o calendário
        return req.mode === 'navigate'
          ? (await cache.match('./index.html')) || Response.error()
          : Response.error();
      }
    }

    // resto: responde do cache na hora e atualiza por baixo
    const guardada = await cache.match(req, { ignoreSearch: true });
    const rede = fetch(req).then(r => { if (r.ok) cache.put(req, r.clone()); return r; }).catch(() => null);
    if (guardada) return guardada;

    const r = await rede;
    if (r) return r;
    // navegação sem cache e sem rede: entrega o calendário
    return req.mode === 'navigate' ? (await cache.match('./index.html')) || Response.error() : Response.error();
  })());
});

/* o botão "Baixar tudo" da página manda esta mensagem */
self.addEventListener('message', e => {
  if (e.data === 'atualizar') {
    e.waitUntil(encher().then(() =>
      e.source && e.source.postMessage('pronto')));
  }
});
