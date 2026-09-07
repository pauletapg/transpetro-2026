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

VERSAO RESUMIDA. Uma aula longa pode ter um segundo arquivo, a versao
resumida, que NAO leva 'id' (id repetido quebra o indice) e sim 'resumo_de'
apontando para o id da aula completa:

    ---
    resumo_de: R01
    titulo: Modelo OSI: as sete camadas (versao resumida)
    ---

Ela entra no aulas.json num mapa a parte, 'resumos', e a pagina da aula
mostra o botao "completa | resumida" quando as duas existem.

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
    arquivos, titulos, resumos, sem_id = {}, {}, {}, []

    for pasta, _, nomes in os.walk(AULAS):
        for nome in sorted(nomes):
            if not nome.endswith('.md') or nome.startswith('_'):
                continue
            caminho = os.path.join(pasta, nome)
            rel = os.path.relpath(caminho, RAIZ).replace('\\', '/')
            meta = frontmatter(caminho)
            ident = (meta.get('id') or '').strip().lower()
            pai = (meta.get('resumo_de') or '').strip().lower()

            # versao resumida: nao ocupa id proprio, entra no mapa 'resumos'
            if pai and not ident:
                if pai in resumos:
                    print('  AVISO: dois resumos para "%s": %s e %s' % (pai, resumos[pai], rel))
                    continue
                resumos[pai] = rel
                continue

            if not ident:
                sem_id.append(rel)
                continue
            if ident in arquivos:
                print('  AVISO: id "%s" repetido em %s e %s' % (ident, arquivos[ident], rel))
                continue

            arquivos[ident] = rel
            if meta.get('titulo'):
                titulos[ident] = meta['titulo']

    for pai in sorted(resumos):
        if pai not in arquivos:
            print('  AVISO: resumo de "%s" sem aula completa correspondente -> %s'
                  % (pai, resumos[pai]))

    dados = {
        'v': int(time.time()),
        'aulas': sorted(arquivos),
        'arquivos': arquivos,
        'titulos': titulos,
        'resumos': resumos,
    }
    os.makedirs(os.path.dirname(SAIDA), exist_ok=True)
    with io.open(SAIDA, 'w', encoding='utf-8', newline='\n') as f:
        f.write(json.dumps(dados, ensure_ascii=False, indent=2))

    print('  %d aula(s) indexada(s): %s' % (len(dados['aulas']), ', '.join(dados['aulas']) or '(nenhuma)'))
    if resumos:
        print('  %d com versao resumida: %s' % (len(resumos), ', '.join(sorted(resumos))))
    for rel in sem_id:
        print('  AVISO: sem "id" no frontmatter, ficou de fora -> %s' % rel)


if __name__ == '__main__':
    main()
