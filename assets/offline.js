/* Registra o service worker e, se a página tiver o botão #offline,
   deixa o usuário baixar tudo de uma vez para ler sem internet.

   Se o registro falhar — navegador antigo, página aberta em file://,
   visualizador embutido — o botão some em vez de ficar travado. */
(function () {
  const btn = document.getElementById('offline');
  const some = () => { if (btn) btn.hidden = true; };

  if (!('serviceWorker' in navigator) || !window.isSecureContext) return some();

  const registro = navigator.serviceWorker.register('sw.js');
  registro.catch(() => some());

  if (!btn) return;

  const LIDO = 'transpetro-2026-offline';
  const quando = () => { try { return localStorage.getItem(LIDO); } catch (e) { return null; } };
  const marca = () => {
    const q = quando();
    btn.textContent = q ? '⤓ Offline ✓' : '⤓ Offline';
    btn.title = q
      ? `Disponível sem internet. Última cópia: ${new Date(Number(q)).toLocaleDateString('pt-BR')}`
      : 'Baixar calendário e aulas para ler sem internet';
  };
  marca();

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'baixando…';

    const terminou = ok => {
      btn.disabled = false;
      if (!ok) { btn.textContent = '⤓ falhou'; setTimeout(marca, 2500); return; }
      try { localStorage.setItem(LIDO, String(Date.now())); } catch (e) {}
      btn.textContent = '⤓ pronto ✓';
      setTimeout(marca, 2500);
    };

    // ready pode nunca resolver se o registro falhou: corre contra um limite
    const reg = await Promise.race([
      navigator.serviceWorker.ready.catch(() => null),
      new Promise(r => setTimeout(() => r(null), 8000))
    ]);
    if (!reg || !reg.active) return terminou(false);

    let respondeu = false;
    const ouve = e => {
      if (e.data !== 'pronto') return;
      respondeu = true;
      navigator.serviceWorker.removeEventListener('message', ouve);
      terminou(true);
    };
    navigator.serviceWorker.addEventListener('message', ouve);
    reg.active.postMessage('atualizar');

    // rede lenta ou sem resposta: não deixa o botão preso
    setTimeout(() => {
      if (respondeu) return;
      navigator.serviceWorker.removeEventListener('message', ouve);
      terminou(true);
    }, 20000);
  });
})();
