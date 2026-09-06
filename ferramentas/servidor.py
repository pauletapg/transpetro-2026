# -*- coding: utf-8 -*-
"""Servidor local do calendario de estudos.

Faz tres coisas alem de servir os arquivos:
  1. reindexa as aulas ao iniciar;
  2. GET  /api/ping      -> diz a pagina que da para gravar;
  3. POST /api/progresso -> grava dados/progresso.json.

E o (3) que resolve o problema do Brave: em vez de depender da File System
Access API (que Chrome e Edge tem e Brave bloqueia), a propria pagina manda
o JSON para ca e o Python escreve no disco. Funciona em qualquer navegador.

So aceita conexao de 127.0.0.1: nada disso fica exposto na rede.
"""
import io, json, os, sys, threading, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROGRESSO = os.path.join(RAIZ, 'dados', 'progresso.json')
PORTA = int(os.environ.get('PORTA', '8765'))
LIMITE = 8 * 1024 * 1024        # 8 MB: progresso.json nunca chega perto disso


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=RAIZ, **kw)

    def log_message(self, fmt, *args):
        if '/api/' in (self.path or ''):
            sys.stderr.write('  %s %s\n' % (self.command, self.path))

    def _json(self, codigo, corpo):
        dados = json.dumps(corpo).encode('utf-8')
        self.send_response(codigo)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(dados)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(dados)

    def end_headers(self):
        # o service worker precisa de no-cache no proprio sw.js
        if (self.path or '').endswith('sw.js'):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def do_GET(self):
        if self.path.startswith('/api/ping'):
            return self._json(200, {'ok': True, 'grava': True})
        return super().do_GET()

    def do_POST(self):
        if not self.path.startswith('/api/progresso'):
            return self._json(404, {'erro': 'rota desconhecida'})
        try:
            n = int(self.headers.get('Content-Length') or 0)
            if n <= 0 or n > LIMITE:
                return self._json(413, {'erro': 'tamanho invalido'})

            corpo = self.rfile.read(n).decode('utf-8')
            dados = json.loads(corpo)          # valida antes de tocar no disco
            if not isinstance(dados, dict) or 'sessoes' not in dados:
                return self._json(400, {'erro': 'formato inesperado'})

            # grava em arquivo temporario e troca: nunca deixa o json pela metade
            tmp = PROGRESSO + '.tmp'
            with io.open(tmp, 'w', encoding='utf-8', newline='\n') as f:
                f.write(json.dumps(dados, ensure_ascii=False, indent=2))
            os.replace(tmp, PROGRESSO)

            return self._json(200, {'ok': True, 'sessoes': len(dados['sessoes'])})
        except Exception as e:
            return self._json(500, {'erro': str(e)})


def main():
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import indexar
        indexar.main()
    except Exception as e:
        print('  (aviso: nao consegui indexar as aulas: %s)' % e)

    servidor = ThreadingHTTPServer(('127.0.0.1', PORTA), Handler)
    url = 'http://localhost:%d/' % PORTA
    print('')
    print('  Calendario TRANSPETRO 2026 rodando em %s' % url)
    print('  Gravacao direta ligada: funciona em Brave, Firefox, Chrome, Edge.')
    print('  Feche esta janela para parar.')
    print('')
    if not os.environ.get('SEM_NAVEGADOR'):
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        servidor.serve_forever()
    except KeyboardInterrupt:
        print('\n  Encerrado.')


if __name__ == '__main__':
    main()
