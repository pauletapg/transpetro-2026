# -*- coding: utf-8 -*-
"""Lista o que faltou nas aulas, para pedir a atualizacao delas.

Resolvendo questoes no TecConcursos voce vai achar coisa que a aula nao
explicava. Registre isso na hora, dentro da sessao do dia:

  - como ERRO, com o tipo de distrator "falta conteudo na aula"; ou
  - nas OBSERVACOES, em uma linha comecando com "FALTA:".

Depois rode:

    python ferramentas/lacunas.py

Ele varre o dados/progresso.json e monta um relatorio pronto para colar
numa conversa pedindo a atualizacao das aulas. Nao altera nada.
"""
import io, json, os, sys

try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROGRESSO = os.path.join(RAIZ, 'dados', 'progresso.json')
PLANO = os.path.join(RAIZ, 'dados', 'plano.json')
AULAS = os.path.join(RAIZ, 'dados', 'aulas.json')


def carrega(caminho, padrao):
    try:
        return json.load(io.open(caminho, encoding='utf-8'))
    except Exception:
        return padrao


def main():
    prog = carrega(PROGRESSO, {'sessoes': {}})
    plano = carrega(PLANO, None)
    indice = carrega(AULAS, {})
    arquivos = indice.get('arquivos', {})

    if not plano:
        print('  Nao achei dados/plano.json.')
        return 1

    achados = []
    for chave, sessao in sorted(prog.get('sessoes', {}).items()):
        try:
            wi, di = (int(x) for x in chave.split(':'))
            semana = plano['semanas'][wi]
            dia = semana['dias'][di]
        except (ValueError, IndexError, KeyError):
            continue

        itens = []
        for e in sessao.get('erros', []):
            if 'falt' in (e.get('tag') or '').lower():
                itens.append(('erro', '%s — %s' % (e.get('q') or 's/ numero',
                                                   e.get('porque') or e.get('assunto') or '')))
        for linha in (sessao.get('notas') or '').splitlines():
            t = linha.strip()
            if t.lower().startswith(('falta:', 'falta ', 'aula:')):
                itens.append(('nota', t))

        if itens:
            achados.append((semana, dia, itens))

    if not achados:
        print('')
        print('  Nenhuma lacuna registrada.')
        print('')
        print('  Como registrar, enquanto resolve questoes:')
        print('    - erro com o tipo de distrator "falta conteudo na aula"; ou')
        print('    - uma linha nas observacoes comecando com "FALTA:".')
        print('')
        return 0

    print('')
    print('=' * 68)
    print('  LACUNAS NAS AULAS — cole isto numa conversa pedindo a atualizacao')
    print('=' * 68)

    for semana, dia, itens in achados:
        print('')
        print('  Semana %d · %s · %s' % (semana['n'], dia['d'], semana['titulo']))
        for t in dia['topicos']:
            ident = t['id'].lower()
            arq = arquivos.get(ident)
            print('    %s  %s' % (t['id'], t['t']))
            print('        %s' % (arq if arq else '(aula ainda nao escrita)'))
        print('    Falta cobrir:')
        for origem, texto in itens:
            print('      - [%s] %s' % (origem, texto))

    print('')
    print('  %d sessao(oes) com lacuna.' % len(achados))
    print('')
    return 0


if __name__ == '__main__':
    sys.exit(main())
