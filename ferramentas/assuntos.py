# -*- coding: utf-8 -*-
"""Procura o assunto certo do TecConcursos para uma aula.

Busca em duas bases e cruza as duas:

  1. dados/assuntos-tec.json  — a arvore COMPLETA das materias (1000+ assuntos),
     gerada por importar_tec.py a partir dos HTMLs em ferramentas/tec/.
     E daqui que sai o nome exato do filtro.

  2. os indices .csv do projeto — para dizer QUAIS questoes de 2018 e 2023
     caem naquele assunto. E o que a aula precisa citar.

    python ferramentas\\assuntos.py osi
    python ferramentas\\assuntos.py "assinatura digital"
    python ferramentas\\assuntos.py firewall --materia seguranca
    python ferramentas\\assuntos.py --materias        (lista as materias)

Saida pensada para colar na secao "Onde treinar no TecConcursos" da aula.
"""
import csv, glob, io, json, os, re, sys, unicodedata
from collections import defaultdict

# o console do Windows costuma vir em cp1252 e quebra nos acentos
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

PROJETO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARVORE = os.path.join(PROJETO, 'dados', 'assuntos-tec.json')
BUSCA_CSV = [PROJETO, os.path.dirname(PROJETO)]


def normaliza(t):
    t = unicodedata.normalize('NFD', t or '')
    return ''.join(c for c in t if unicodedata.category(c) != 'Mn').lower()


def carrega_arvore():
    if not os.path.exists(ARVORE):
        print('  Falta dados/assuntos-tec.json.')
        print('  Rode antes:  python ferramentas\\importar_tec.py')
        return None
    return json.load(io.open(ARVORE, encoding='utf-8'))


def questoes_de_prova():
    """Mapeia nome-do-assunto-normalizado -> lista de questoes das provas."""
    mapa = defaultdict(list)
    arquivos = []
    for base in BUSCA_CSV:
        arquivos += glob.glob(os.path.join(base, '*ndice*.csv'))

    for caminho in sorted(set(arquivos)):
        nome = os.path.basename(caminho)
        eh_prova = nome.lower().startswith('prova')
        try:
            for row in csv.DictReader(io.open(caminho, encoding='utf-8-sig'), delimiter=';'):
                assunto = (row.get('assunto') or '').strip()
                if not assunto:
                    continue
                # "TI - Redes de Computadores - Modelo OSI" -> folha "Modelo OSI"
                folha = assunto.split(' - ')[-1]
                origem = 'prova %s Q%s (gab %s)' % (
                    row.get('ano') or ('2018' if '2018' in nome else '2023'),
                    row.get('n', '?'), row.get('gabarito', '?')) if eh_prova else 'caderno'
                mapa[normaliza(folha)].append(origem)
        except Exception as e:
            print('  (nao consegui ler %s: %s)' % (nome, e))
    return mapa


def imprime(linhas):
    """Escreve sem quebrar em terminal que nao aguenta UTF-8."""
    texto = '\n'.join(linhas)
    try:
        print(texto)
    except UnicodeEncodeError:
        sys.stdout.buffer.write(texto.encode('utf-8', 'replace') + b'\n')


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    filtro_mat = None
    if '--materia' in sys.argv:
        i = sys.argv.index('--materia')
        if i + 1 < len(sys.argv):
            filtro_mat = normaliza(sys.argv[i + 1])

    dados = carrega_arvore()
    if not dados:
        return 1

    if '--materias' in sys.argv:
        imprime([''] + ['  %-50s %5d assuntos  %7d questoes' %
                        (m['nome'], len(m['assuntos']), m['questoes'])
                        for m in dados['materias']] + [''])
        return 0

    if not args:
        imprime([__doc__])
        return 0

    alvo = normaliza(' '.join(args))
    provas = questoes_de_prova()

    # "osi" nao pode casar dentro de "proposicoes": palavra inteira vale mais
    palavra = re.compile(r'(?<![a-z0-9])%s(?![a-z0-9])' % re.escape(alvo))

    def pontua(a):
        nome, caminho = normaliza(a['nome']), normaliza(a['caminho'])
        if nome == alvo:              return 4
        if palavra.search(nome):      return 3
        if palavra.search(caminho):   return 2
        if alvo in nome:              return 1
        return 0

    achados = []
    for m in dados['materias']:
        if filtro_mat and filtro_mat not in normaliza(m['nome']):
            continue
        for a in m['assuntos']:
            p = pontua(a)
            if p:
                achados.append((p, a))

    # so mostra casamentos fracos se nao houver nenhum forte
    melhor = max((p for p, _ in achados), default=0)
    if melhor >= 2:
        achados = [(p, a) for p, a in achados if p >= 2]
    achados = [a for _, a in sorted(achados, key=lambda pa: (-pa[0], -pa[1]['questoes']))]

    if not achados:
        imprime(['', '  Nada encontrado para "%s".' % ' '.join(args),
                 '  Tente um termo mais curto, ou veja as materias com --materias', ''])
        return 0

    linhas = ['', '  %d assunto(s) para "%s":' % (len(achados), ' '.join(args)), '']

    for a in achados[:25]:
        linhas.append('  %s' % a['materia'])
        linhas.append('    %s' % a['caminho'])
        linhas.append('    %d questoes no TecConcursos  ·  hierarquia %s' % (a['questoes'], a['hierarquia']))
        linhas.append('    https://www.tecconcursos.com.br/materias/%s' % a['url'])
        naprova = [q for q in provas.get(normaliza(a['nome']), []) if q != 'caderno']
        nocaderno = provas.get(normaliza(a['nome']), []).count('caderno')
        if naprova:
            linhas.append('    NAS PROVAS: %s' % ', '.join(naprova))
        if nocaderno:
            linhas.append('    no seu caderno CESGRANRIO: %d questao(oes)' % nocaderno)
        linhas.append('')

    if len(achados) > 25:
        linhas.append('  (+%d assuntos; refine a busca)' % (len(achados) - 25))
    linhas += ['  Cole o caminho acima na secao "Onde treinar no TecConcursos" da aula.', '']
    imprime(linhas)
    return 0


if __name__ == '__main__':
    sys.exit(main())
