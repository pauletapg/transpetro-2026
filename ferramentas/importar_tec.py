# -*- coding: utf-8 -*-
"""Le os HTMLs salvos do TecConcursos e monta dados/assuntos-tec.json.

Cada pagina de materia do TecConcursos traz a arvore inteira de assuntos
embutida num script como `var jsonMateria = {...}`. Nao ha DOM para
raspar: e so achar o objeto, equilibrar as chaves e usar json.loads.

    python ferramentas\\importar_tec.py

Entra:  ferramentas/tec/*.html   (salvos com Ctrl+S no navegador)
Sai:    dados/assuntos-tec.json  (arvore achatada, com o caminho completo)

Rode de novo sempre que baixar HTMLs novos ou atualizados.
"""
import io, json, os, sys, time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENTRADA = os.path.join(RAIZ, 'ferramentas', 'tec')
SAIDA = os.path.join(RAIZ, 'dados', 'assuntos-tec.json')
MARCA = 'var jsonMateria = '


def extrai_json(texto):
    """Devolve o objeto jsonMateria, equilibrando as chaves a partir da marca."""
    i = texto.find(MARCA)
    if i < 0:
        return None
    i += len(MARCA)
    if texto[i] != '{':
        return None

    profundidade, dentro_str, escapa = 0, False, False
    for fim in range(i, len(texto)):
        c = texto[fim]
        if dentro_str:
            if escapa:
                escapa = False
            elif c == '\\':
                escapa = True
            elif c == '"':
                dentro_str = False
            continue
        if c == '"':
            dentro_str = True
        elif c == '{':
            profundidade += 1
        elif c == '}':
            profundidade -= 1
            if profundidade == 0:
                try:
                    return json.loads(texto[i:fim + 1])
                except ValueError as e:
                    print('  json invalido: %s' % e)
                    return None
    return None


def achata(assuntos, materia, trilha=None, saida=None):
    """Percorre filhos recursivamente e devolve uma lista plana com o caminho."""
    trilha = trilha or []
    saida = saida if saida is not None else []
    for a in assuntos or []:
        nome = (a.get('nome') or '').strip()
        atual = trilha + [nome]
        saida.append({
            'materia': materia,
            'nome': nome,
            'caminho': ' > '.join(atual),
            'nivel': len(atual),
            'hierarquia': a.get('hierarquia') or '',
            'url': a.get('url') or '',
            'questoes': a.get('totalQuestoes') or 0,
            'comentadas': a.get('totalComentadas') or 0,
        })
        achata(a.get('filhos'), materia, atual, saida)
    return saida


def main():
    if not os.path.isdir(ENTRADA):
        print('  Pasta nao encontrada: %s' % ENTRADA)
        print('  Salve as paginas de materia do TecConcursos ali (Ctrl+S).')
        return 1

    arquivos = sorted(f for f in os.listdir(ENTRADA) if f.lower().endswith('.html'))
    if not arquivos:
        print('  Nenhum .html em %s' % ENTRADA)
        return 1

    materias, problemas = [], []
    for nome_arq in arquivos:
        caminho = os.path.join(ENTRADA, nome_arq)
        try:
            texto = io.open(caminho, encoding='utf-8', errors='replace').read()
        except Exception as e:
            problemas.append('%s (nao consegui ler: %s)' % (nome_arq, e))
            continue

        obj = extrai_json(texto)
        if not obj or not obj.get('nome'):
            problemas.append('%s (nao achei o jsonMateria)' % nome_arq)
            continue

        plana = achata(obj.get('assuntos'), obj['nome'])
        materias.append({
            'nome': obj['nome'],
            'url': obj.get('url') or '',
            'questoes': obj.get('totalQuestoes') or 0,
            'assuntos': plana,
        })
        print('  %-46s %5d assuntos, %7d questoes' %
              (obj['nome'], len(plana), obj.get('totalQuestoes') or 0))

    if not materias:
        print('  Nada importado.')
        return 1

    materias.sort(key=lambda m: m['nome'])
    dados = {
        'geradoEm': time.strftime('%Y-%m-%d'),
        'materias': materias,
        'totalAssuntos': sum(len(m['assuntos']) for m in materias),
    }
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with io.open(SAIDA, 'w', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(dados, ensure_ascii=False, indent=1))

    print('')
    print('  %d materias, %d assuntos -> dados/assuntos-tec.json' %
          (len(materias), dados['totalAssuntos']))
    for p in problemas:
        print('  AVISO: %s' % p)
    return 0


if __name__ == '__main__':
    sys.exit(main())
