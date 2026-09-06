# -*- coding: utf-8 -*-
"""Varre aulas/**/*.md e escreve dados/aulas.json.

As aulas ficam em pastas por disciplina e com nomes legiveis:

    aulas/redes/Modelo OSI - as sete camadas.md

O que liga o arquivo ao calendario nao e o nome nem a pasta: e o campo
'id' do frontmatter. Organize as pastas como quiser.

    ---
    id: R01
    titulo: Modelo OSI: as sete camadas e o que cada uma resolve
    ---

Roda sozinho no iniciar.bat e no publicar.bat.
"""
import io, json, os, time

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AULAS = os.path.join(RAIZ, 'aulas')
SAIDA = os.path.join(RAIZ, 'dados', 'aulas.json')


def frontmatter(caminho):
    """Devolve o dicionario do frontmatter, ou {} se nao houver."""
    meta = {}
    try:
        with io.open(caminho, encoding='utf-8') as f:
            if f.readline().strip() != '---':
                return meta
            for linha in f:
                if linha.strip() == '---':
                    break
                if ':' in linha:
                    chave, valor = linha.split(':', 1)
                    meta[chave.strip().lower()] = valor.strip().strip('"\'')
    except Exception:
        pass
    return meta


def main():
    arquivos, titulos, sem_id = {}, {}, []

    for pasta, _, nomes in os.walk(AULAS):
        for nome in sorted(nomes):
            if not nome.endswith('.md') or nome.startswith('_'):
                continue
            caminho = os.path.join(pasta, nome)
            rel = os.path.relpath(caminho, RAIZ).replace('\\', '/')
            meta = frontmatter(caminho)
            ident = (meta.get('id') or '').strip().lower()

            if not ident:
                sem_id.append(rel)
                continue
            if ident in arquivos:
                print('  AVISO: id "%s" repetido em %s e %s' % (ident, arquivos[ident], rel))
                continue

            arquivos[ident] = rel
            if meta.get('titulo'):
                titulos[ident] = meta['titulo']

    dados = {
        'v': int(time.time()),
        'aulas': sorted(arquivos),
        'arquivos': arquivos,
        'titulos': titulos,
    }
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with io.open(SAIDA, 'w', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(dados, ensure_ascii=False, indent=2))

    print('  %d aula(s) indexada(s): %s' % (len(dados['aulas']), ', '.join(dados['aulas']) or '(nenhuma)'))
    for rel in sem_id:
        print('  AVISO: sem "id" no frontmatter, ficou de fora -> %s' % rel)


if __name__ == '__main__':
    main()
