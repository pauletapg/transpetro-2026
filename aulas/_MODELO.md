---
id: X00
titulo: Título da aula
resumo: Uma frase dizendo o que você vai saber fazer ao terminar. Concreta, verificável.
tempo: 90 min
---

<!--
COMO USAR
1. Copie este arquivo para a pasta da disciplina, com nome legível:
      aulas/redes/Topologias e meios fisicos.md
2. Ponha o id do tópico no frontmatter acima. É SÓ ISSO que liga o arquivo
   ao calendário — pasta e nome do arquivo são livres.
3. Escreva. A aula aparece na próxima vez que rodar o iniciar.bat.
4. Edite no Obsidian: esta pasta já é um vault.

Apague este comentário e as seções que não usar.


=====================================================================
PROFUNDIDADE EXIGIDA — leia antes de escrever qualquer aula
=====================================================================

Isto aqui é um CADERNO DE ESTUDO, não um resumo. Quem lê a aula parte do
zero no assunto e precisa sair sabendo resolver questão. Um resumo de
tópicos não serve: ele só é útil para quem já estudou.

REGRAS DE ESCRITA

1. EXPLIQUE CADA PONTO DA TEORIA, um por um.
   Não basta listar "TCP é confiável, UDP não é". Explique O QUE É
   confiabilidade, COMO o TCP consegue (numeração, ACK, retransmissão,
   janela) e O QUE o UDP entrega em troca (menos overhead, menos atraso).
   Se um termo aparece, ele é definido na primeira vez que aparece.

2. RESPONDA "POR QUÊ", NÃO SÓ "O QUÊ".
   Todo conceito existe porque resolve um problema. Comece pelo problema.
   O leitor decora dez vezes melhor o que ele entendeu ser necessário.

3. DÊ EXEMPLO PRÁTICO E CONCRETO sempre que ajudar a fixar.
   Números reais, comando real com saída real, um caso do dia a dia.
   "Uma rede 192.168.1.0/24 tem 254 hosts úteis porque..." vale mais que
   "a máscara define a quantidade de hosts". Analogia é bem-vinda quando
   o conceito é abstrato, mas SEMPRE acompanhada do mecanismo técnico —
   analogia sozinha não resolve questão.

4. TABELA COMPARATIVA sempre que houver dois ou mais conceitos que a
   banca gosta de trocar entre si. É o formato que mais rende em prova.

5. TAMANHO: o que o assunto exigir. Uma aula bem feita de um assunto de
   peso passa de 300 linhas. Não corte teoria para encurtar; corte
   enrolação. Se o assunto for pequeno de verdade, a aula é curta.

6. FECHE O CICLO: a teoria escrita tem que ser SUFICIENTE para resolver
   todas as questões da seção de questões, sem consultar mais nada. Se
   uma questão exige algo que a aula não explicou, falta seção na aula.

ESTRUTURA RECOMENDADA
   - callout [!banca] — o que a banca cobra + quantas vezes caiu
   - o problema que o conceito resolve
   - a teoria, seção por seção, com exemplos
   - tabela comparativa dos conceitos que se confundem
   - callouts [!pegadinha] — onde a banca derruba
   - questões de 2018/2023 + inéditas, com comentário completo
   - onde treinar no TecConcursos
   - callout [!checklist] — véspera
=====================================================================
-->

> [!banca]
> O que a CESGRANRIO cobra deste tópico. Consulte `perfil-da-banca-TRANSPETRO.md`.
> Diga o nível: conceitual, sintaxe exata ou comportamento em execução.
>
> Diga também **quantas vezes o assunto caiu em 2018 e 2023**, citando o número
> das questões. Se caiu zero vezes, diga isso — muda a prioridade da sessão.

## Conceito

Texto normal. **Negrito** para o termo que cai na prova, *destaque* para a definição
que precisa estar decorada, `código` para comando ou sintaxe, ==marcação== para o que
você quer reler primeiro.

- Item de lista
- Outro item
  - Subitem indentado

| Coluna | Coluna |
|---|---|
| valor | valor |

```bash
comando --exemplo
saída esperada
```

> [!nota]
> Observação lateral que ajuda a entender.

> [!decore]
> Mnemônico, ordem, sigla.

## Onde a banca derruba

> [!pegadinha] Nome curto da armadilha
> A alternativa "quase certa" e por que ela está errada.

## Questões

<!--
REGRA DAS QUESTÕES — vale para toda aula:

1. TODA questão diz de onde veio, no título. Dois formatos, só:
      ### Q01 · TRANSPETRO 2018 · questão 41
      ### Q05 · Inédita
   "Inédita" é obrigatório quando a questão foi escrita com base no perfil da
   banca em vez de copiada de uma prova. Nunca deixe implícito.

2. TODA questão abre com um bloco [!fonte], antes do enunciado. Ele começa
   sempre pela palavra "Fonte:" e diz, em uma ou duas linhas, POR QUE aquela
   questão está na aula — o que ela testa, ou o que a torna representativa.
   Questão de prova leva também o link do TecConcursos.

      > [!fonte] Fonte: prova TRANSPETRO 2018, questão 41
      > O enunciado clássico da banca para este assunto: dá uma lista de
      > equipamentos e pede a camada de cada um, na ordem.
      > [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638681)

      > [!fonte] Fonte: questão inédita, não caiu em prova
      > Escrita com base no padrão identificado nas questões acima. Cobre a
      > camada 6, que aparece como distrator e nunca foi cobrada direto.

3. Toda aula lista as questões de 2018 e 2023 relacionadas ao assunto, com o
   ENUNCIADO INTEIRO. Para achá-las, use a coluna `assunto` de
   "Prova + gabarito 2018 ... Indice.csv" e busque o termo no .md de 2023.

4. A teoria da aula tem que ser suficiente para resolver essas questões. Se uma
   questão exige algo que a aula não explicou, falta seção na aula.

5. A alternativa correta é marcada com [x]. Ela NÃO aparece destacada na tela
   até você abrir o comentário, e no PDF vai para o caderno de gabaritos do fim.
-->

### Q01 · TRANSPETRO 2018 · questão NN

> [!fonte] Fonte: prova TRANSPETRO 2018, questão NN
> Uma ou duas linhas dizendo o que esta questão testa.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/NNNNNN)

Enunciado inteiro, copiado da prova.

- [ ] alternativa errada
- [x] alternativa correta
- [ ] alternativa errada
- [ ] alternativa errada
- [ ] alternativa errada

> [!gabarito]-
> **Gabarito: B.** Por que a certa está certa.
>
> Por que cada errada está errada, uma a uma. Nomeie o tipo de distrator —
> é o que treina o olho para a próxima.

### Q02 · Inédita

> [!fonte] Fonte: questão inédita, não caiu em prova
> Escrita com base no padrão identificado nas questões acima. Diga o que ela
> cobre que as de prova não cobriram.

Enunciado.

- [ ] errada
- [x] correta
- [ ] errada

> [!gabarito]-
> **Gabarito: B.** Comentário.

## Onde treinar no TecConcursos

<!--
Sugira o filtro EXATO. Nunca invente nome de assunto: a árvore real das 14
matérias está em dados/assuntos-tec.json (1041 assuntos, importada dos HTMLs
do TecConcursos salvos em ferramentas/tec/). Consulte com:

  python ferramentas/assuntos.py <palavra-chave>
  python ferramentas/assuntos.py firewall --materia seguranca
  python ferramentas/assuntos.py --materias

A ferramenta devolve, para cada assunto: o caminho completo na árvore, o
código de hierarquia, quantas questões existem no acervo, o link direto e
QUAIS questões de 2018 e 2023 caem ali. Cole isso nesta seção.

Formato: filtro principal primeiro, com número de questões e link; depois
2 ou 3 complementos para o resto da semana.
-->

Matéria **TI - Xxxxx**. O filtro principal desta aula:

- **Caminho › Completo › Na Árvore** — hierarquia `00.00`, **N questões** no acervo.
  [Abrir o assunto](https://www.tecconcursos.com.br/questoes/materias/...)

Marque também a banca **CESGRANRIO**. Se sobrarem menos de 20 questões, tire o
filtro de banca e resolva as demais como treino de raciocínio.

Complementos, para o resto da semana:

- **Outro › Assunto** — `00.00`, N questões. Por que ele complementa esta aula.

> [!checklist]
> - Cinco linhas, no máximo.
> - O que reler em dois minutos na véspera.
