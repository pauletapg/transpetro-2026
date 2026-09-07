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
    print('  questoes ..... %5d na aula   ->  %4.0f min para resolver todas' % (n_questoes, min_questoes))
    print('  checklist ....                    ->     5 min')
    print('  ' + '-' * 62)
    print('  a aula inteira, se lida de uma vez  %4.0f min' % (min_teoria + min_questoes + 5))
    print('  (mas ela nao e feita de uma vez — veja a distribuicao abaixo)')

    if not fatia:
        print('  (sem campo "tempo" no frontmatter — nao da para comparar)')
        return

    # A REGRA DAS 24 HORAS (_MODELO.md): a sessao NAO resolve as questoes da
    # aula que acabou de ser lida. Ela abre com as pendentes da aula anterior
    # (aquecimento), le a teoria, confere com 2 ou 3, e empurra o resto.
    n_conf = 2 if fatia <= 45 else (3 if fatia <= 90 else 4)
    min_conf = n_conf * MIN_POR_QUESTAO
    aquecimento = 10 if fatia <= 45 else (15 if fatia <= 90 else 20)
    usado = aquecimento + min_teoria + min_conf + 5

    print('')
    print('  A sessao de %d min, pela regra das 24 horas:' % fatia)
    print('    aquecimento com as questoes da aula anterior ... %4d min' % aquecimento)
    print('    teoria desta aula ............................. %4.0f min' % min_teoria)
    print('    conferencia: %d questao(oes) daqui ............. %4.0f min' % (n_conf, min_conf))
    print('    checklist ..................................... %4d min' % 5)
    print('    %s' % ('-' * 52))
    print('    total ......................................... %4.0f min  (fatia: %d)'
          % (usado, fatia))

    sobram = max(0, n_questoes - n_conf)
    if sobram:
        print('')
        print('  As outras %d questoes desta aula sao o aquecimento das proximas' % sobram)
        print('  sessoes e o material do bloco de sabado. Nao sao para hoje.')

    if usado > fatia:
        print('')
        print('  ATENCAO: estoura a fatia em %.0f min. Nao encolha a teoria —' % (usado - fatia))
        print('  avise no topo da aula, num callout [!nota], como distribuir o dia.')

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
