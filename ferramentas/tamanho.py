# -*- coding: utf-8 -*-
"""Mede uma aula e diz se ela cabe na fatia do calendario.

    python ferramentas\\tamanho.py "aulas/redes/Modelo OSI - as sete camadas.md"
    python ferramentas\\tamanho.py --todas

Separa TEORIA (tudo antes de "## Questoes") de QUESTOES e aplica a
calibragem do _MODELO.md:

    leitura de estudo, assunto novo ......... 100 palavras/min
    tabela e bloco de codigo ................ contam dobrado
    questao nova (resolver + ler comentario) . 4 min
    questao ja vista, em revisao ............. 1,5 min

O 'tempo' do frontmatter e a fatia do calendario, nao o tempo de leitura:
e o 'min' do dia no plano.json dividido pelo numero de topicos daquele dia.
"""
import io, os, re, sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AULAS = os.path.join(RAIZ, 'aulas')

PAL_POR_MIN = 100.0     # leitura de estudo, assunto novo
MIN_POR_QUESTAO = 4.0   # resolver + ler o comentario, primeira vez

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass


def palavras(texto):
    """Conta palavras dando peso 2 a linha de tabela e de bloco de codigo.

    Tabela e codigo custam mais por palavra: o olho para, volta e compara.
    """
    total, em_codigo = 0, False
    for linha in texto.split('\n'):
        crua = linha.strip()
        if crua.startswith('```'):
            em_codigo = not em_codigo
            continue
        n = len(re.findall(r'\S+', linha))
        pesada = em_codigo or (crua.startswith('|') and crua.endswith('|'))
        total += n * 2 if pesada else n
    return total


def frontmatter(texto):
    meta = {}
    if not texto.startswith('---'):
        return meta
    for linha in texto.split('\n')[1:]:
        if linha.strip() == '---':
            break
        if ':' in linha:
            c, v = linha.split(':', 1)
            meta[c.strip().lower()] = v.strip()
    return meta


def analisa(caminho):
    texto = io.open(caminho, encoding='utf-8').read()
    meta = frontmatter(texto)

    corte = re.search(r'^##\s+Quest', texto, re.M)
    teoria = texto[:corte.start()] if corte else texto
    questoes_txt = texto[corte.start():] if corte else ''

    pal = palavras(teoria)
    min_teoria = pal / PAL_POR_MIN
    n_questoes = len(re.findall(r'^###\s+Q\d', questoes_txt, re.M))
    min_questoes = n_questoes * MIN_POR_QUESTAO

    fatia = 0
    m = re.search(r'(\d+)', meta.get('tempo', ''))
    if m:
        fatia = int(m.group(1))

    rel = os.path.relpath(caminho, RAIZ).replace('\\', '/')
    print('')
    print('  %s' % rel)
    print('  id %s  ·  fatia declarada: %s' % (meta.get('id', '?'), meta.get('tempo', '?')))
    print('  ' + '-' * 62)
    print('  teoria ....... %5d palavras  ->  %4.0f min de leitura' % (pal, min_teoria))
    print('  questoes ..... %5d na aula   ->  %4.0f min se resolver todas' % (n_questoes, min_questoes))
    print('  checklist ....                    ->     5 min')
    print('  ' + '-' * 62)
    print('  aula inteira, de uma vez ......... %4.0f min' % (min_teoria + min_questoes + 5))

    if not fatia:
        print('  (sem campo "tempo" no frontmatter — nao da para comparar)')
        return

    cabem = int(max(0, (fatia - min_teoria - 5)) / MIN_POR_QUESTAO)
    print('')
    print('  Na sessao de %d min: teoria (%.0f min) + %d questao(oes) + checklist.'
          % (fatia, min_teoria, cabem))
    if n_questoes > cabem:
        print('  As outras %d ficam para o bloco de sabado. Avise isso na aula,'
              % (n_questoes - cabem))
        print('  num callout [!nota] no topo.')

    alvo_min, alvo_max = fatia * 50, fatia * 62   # ~2.500 palavras para 45 min
    if pal < alvo_min:
        print('')
        print('  ATENCAO: teoria curta para a fatia (%d palavras; esperado %d-%d).'
              % (pal, alvo_min, alvo_max))
        print('  Provavelmente falta ficha de conceito (R1 do _MODELO.md) em algum item.')
    elif pal > alvo_max * 1.35:
        print('')
        print('  Teoria acima do orcamento (%d palavras; esperado %d-%d).'
              % (pal, alvo_min, alvo_max))
        print('  Tudo bem se for assunto de peso — so avise no topo da aula.')


def main():
    args = [a for a in sys.argv[1:]]
    if not args:
        print(__doc__)
        return
    if args[0] == '--todas':
        alvos = []
        for pasta, _, nomes in os.walk(AULAS):
            for nome in sorted(nomes):
                if nome.endswith('.md') and not nome.startswith('_'):
                    alvos.append(os.path.join(pasta, nome))
    else:
        alvos = []
        for a in args:
            p = a if os.path.isabs(a) else os.path.join(RAIZ, a)
            if not os.path.exists(p):
                print('  Nao achei: %s' % a)
                continue
            alvos.append(p)

    for p in alvos:
        analisa(p)
    print('')


if __name__ == '__main__':
    main()
