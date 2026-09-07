---
id: X00
titulo: Título da aula
resumo: Uma frase dizendo o que você vai saber ao terminar. Concreta, verificável.
tempo: 45 min
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

FRONTMATTER: uma linha por campo. O parser do indexar.py não é YAML de
verdade — ele quebra a linha no primeiro ":" e não entende valor em várias
linhas, lista nem aspas multilinha.

ID REPETIDO QUEBRA O ÍNDICE. Dois arquivos com o mesmo id fazem o
indexar.py imprimir "AVISO: id repetido" e DESCARTAR um dos dois, escolhido
por ordem alfabética.

Reescreveu uma aula? SUBSTITUA o arquivo, sem criar cópia de backup. Esta
pasta é um repositório git e a versão anterior fica sempre a um comando de
distância:

    git log --oneline -- "aulas/redes/Modelo OSI - as sete camadas.md"
    git show HEAD:"aulas/redes/Modelo OSI - as sete camadas.md"

Cópias tipo "_Nome antigo.md" só acumulam lixo, uma por revisão. Se ainda
assim precisar guardar uma fora do git, o "_" na frente do nome funciona:
arquivos que começam com "_" são ignorados pelo indexador.

QUANDO É PRECISO REINDEXAR. O indexar.py só existe para montar o
dados/aulas.json, que liga id -> caminho do arquivo. Ou seja:
  - editou o CONTEÚDO de uma aula que já existe -> não precisa de nada,
    é só recarregar a página no navegador;
  - criou uma aula, renomeou o arquivo, mudou de pasta, ou mexeu no "id" ou
    no "titulo" do frontmatter -> precisa reindexar.
O servidor.py roda o indexar sozinho toda vez que sobe, então fechar a
janela e rodar o iniciar.bat de novo já resolve.


=====================================================================
PROFUNDIDADE EXIGIDA — leia antes de escrever qualquer aula
=====================================================================

Isto aqui é um CADERNO DE ESTUDO, não um resumo. Quem lê a aula parte do
zero no assunto e precisa sair sabendo resolver questão. Um resumo de
tópicos não serve: ele só é útil para quem já estudou.

---------------------------------------------------------------------
R1. FICHA DE CONCEITO — a regra que define a profundidade
---------------------------------------------------------------------
Para CADA item enumerado da aula — cada camada, cada protocolo, cada
comando, cada modelo, cada princípio — escreva os seis campos abaixo. Não
precisa rotular na página; a redação pode ser corrida. Mas os seis têm que
estar lá, e um revisor tem que conseguir apontá-los com o dedo.

   a) O PROBLEMA que ele resolve — o que quebra sem ele.
      Comece por aqui, sempre. Quem entendeu que o conceito era necessário
      decora dez vezes melhor do que quem leu a definição.

   b) COMO FUNCIONA POR DENTRO — o mecanismo, não o rótulo.
      Não basta "TCP é confiável". É preciso: numeração de bytes, ACK,
      retransmissão por timeout, janela deslizante. E o que o UDP entrega
      em troca de não fazer isso.

   c) UMA ANALOGIA — ver R2, que é onde ela ganha limite.

   d) UM EXEMPLO CONCRETO com dado real: um número, um endereço, um
      comando com a saída que ele produz, um caso do dia a dia.
      "Uma rede 192.168.1.0/24 tem 254 hosts úteis porque..." vale mais
      que "a máscara define a quantidade de hosts".

   e) AS PALAVRAS QUE A BANCA USA para se referir a isso no enunciado.
      Frequentemente o gabarito está decidido por uma expressão só:
      "ponta a ponta", "entre nós adjacentes", "orientado à conexão".
      Essas expressões são conteúdo de estudo, não observação de gabarito.

   f) O CONCEITO VIZINHO com que se confunde, e o que os separa.

---------------------------------------------------------------------
R2. ANALOGIA COM LIMITE DECLARADO
---------------------------------------------------------------------
Toda analogia vem acompanhada de duas coisas: o mecanismo técnico ao lado,
e uma linha dizendo ONDE A ANALOGIA QUEBRA.

Analogia sem limite fabrica erro de prova. "A camada 6 é o tradutor" faz o
candidato marcar Apresentação numa questão sobre tradução de IP para MAC.
Analogia é andaime: ajuda a subir e depois tem que sair da frente.

Formato sugerido:

   > [!analogia] Nome curto
   > A analogia.
   > **Onde quebra:** o ponto em que ela deixa de valer, e o que vale no lugar.

---------------------------------------------------------------------
R3. UM EXEMPLO-FIO-CONDUTOR POR AULA
---------------------------------------------------------------------
Escolha UM cenário concreto e atravesse a aula inteira com ele, retomando-o
em cada seção, em vez de inventar exemplo novo a cada parágrafo. Em redes,
um `curl` acompanhado da tecla até o fio. Em banco, uma tabela com cinco
linhas que reaparece em toda consulta. Em segurança, um incidente único.

O leitor guarda um cenário. Não guarda sete.

---------------------------------------------------------------------
R4. COTA DE ESPAÇO PROPORCIONAL AO RISCO, NÃO À IMPORTÂNCIA
---------------------------------------------------------------------
O conceito que mais aparece como DISTRATOR recebe MAIS espaço, não menos —
mesmo quando é o menos relevante na prática profissional.

Contraexemplo real, e o motivo desta regra existir: a v1 da aula R01 dava
dois parágrafos de duas linhas para as camadas de Sessão e de Apresentação,
e dizia três vezes, ela mesma, que essas são as camadas que mais aparecem
como alternativa errada. O que mais derruba era o que menos foi explicado.

---------------------------------------------------------------------
R5. TABELA "PALAVRA DO ENUNCIADO → CONCEITO"
---------------------------------------------------------------------
Obrigatória, na TEORIA — não escondida dentro dos comentários de gabarito.
Uma linha por expressão que a banca usa para fixar a resposta.

   | Se o enunciado disser | Ele está falando de | Não confunda com |
   |---|---|---|

É a seção de maior retorno por linha escrita de toda a aula, porque é a
única que treina diretamente o gesto que a prova cobra: ler o enunciado e
achar a palavra que decide.

---------------------------------------------------------------------
R6. TABELA COMPARATIVA
---------------------------------------------------------------------
Sempre que houver dois ou mais conceitos que a banca troca entre si. É o
formato que mais rende em prova.

---------------------------------------------------------------------
R7. TERMO DEFINIDO NA PRIMEIRA APARIÇÃO
---------------------------------------------------------------------
Sem exceção: sigla, protocolo, campo de cabeçalho, unidade, jargão. Se o
termo aparece, ele é definido ali, na primeira vez. "FCS" e "PDU" jogados
no meio de uma frase são buraco de aula.

---------------------------------------------------------------------
R8. RESPONDA "POR QUÊ", NÃO SÓ "O QUÊ"
---------------------------------------------------------------------
Todo conceito existe porque resolve um problema, e quase sempre porque a
solução anterior falhou de um jeito específico. Conte isso.

---------------------------------------------------------------------
R9. FECHE O CICLO
---------------------------------------------------------------------
A teoria escrita tem que ser SUFICIENTE para resolver todas as questões da
seção de questões, sem consultar mais nada. Se uma questão exige algo que a
aula não explicou, falta seção na aula — acrescente antes de terminar.

=====================================================================
TAMANHO E TEMPO — quanto escrever, e como saber que é o bastante
=====================================================================

O `tempo` do frontmatter é a FATIA DO CALENDÁRIO, não o tempo de leitura:

    tempo = "min" do dia no plano.json ÷ nº de tópicos daquele dia

Segunda da semana 1 tem 90 min e dois tópicos (R01 e R02) → 45 min cada.
Das 145 fatias do plano, 94 (65%) são de 45 min; 28 são de 60 min; o resto
são dias de tópico único, de 90 ou 120 min.

CALIBRAGEM DE LEITURA (medida sobre este projeto):
   - leitura de estudo real, assunto novo, parando para entender:
     ~100 palavras por minuto. Tabela e bloco de código contam dobrado.
   - questão nova: ~2 min para resolver + ~2 min para ler o comentário = 4 min.
   - questão já vista, em revisão: ~1,5 min.

ORÇAMENTO POR FATIA:

   | Fatia  | Aquecimento | Teoria | Palavras de teoria | Conferência |
   |--------|-------------|--------|--------------------|-------------|
   | 45 min | 10 min      | 25 min | 2.200 – 2.800      | 2 a 3 questões |
   | 60 min | 12 min      | 35 min | 3.000 – 3.800      | 3 questões |
   | 90 min | 15 min      | 50 min | 4.500 – 5.500      | 3 a 4 questões |
   | 120 min| 20 min      | 70 min | 6.500 – 7.500      | 4 questões |

   Reserve 5 min do fim de qualquer fatia para o checklist da aula.

QUANTAS QUESTÕES A AULA TRAZ — e por que quase todas ficam para depois:

   A aula traz TODAS as questões de TRANSPETRO 2018 e 2023 do assunto, mais
   as de CESGRANRIO do caderno, mais inéditas para tapar buraco: alvo de
   **10 a 14 questões**. Só duas ou três são resolvidas no dia em que a aula
   é lida. As outras são o material de recuperação das sessões seguintes.

   A REGRA DAS 24 HORAS. Responder sobre um texto que você acabou de ler mede
   memória de trabalho, não memória durável: você acerta quase tudo, sente que
   aprendeu e perde na semana seguinte. Por isso a aula se distribui em quatro
   momentos, e não em um:

   1. AQUECIMENTO, no começo da sessão — as questões que ficaram pendentes da
      aula anterior, de cabeça, antes de ler qualquer coisa nova. É o momento
      mais valioso do dia e o mais fácil de pular.
   2. TEORIA da aula de hoje.
   3. CONFERÊNCIA — duas ou três questões da aula, escolhidas entre as de
      TRANSPETRO, só para checar se a leitura pegou. Não é treino, é aferição.
   4. O RESTO vira aquecimento de amanhã, e depois vai para o bloco de sábado
      junto com a bateria do TecConcursos (~20 questões em 60 min), com os
      últimos 20 min sem filtro de assunto.

   No domingo, só as que você errou — refeitas fechadas, sem gabarito, abrindo
   a aula apenas nas que errar de novo.

   Consequência para quem escreve a aula: a ORDEM das questões importa. As
   primeiras têm que ser as que fecham o conceito central, porque são as
   únicas que serão resolvidas no dia da leitura.

CONFERÊNCIA DE TAMANHO, antes de fechar a aula:

    python ferramentas/tamanho.py "aulas/<disciplina>/<arquivo>.md"

Se não existir, conte na mão: a teoria de uma aula de 45 min tem ~2.500
palavras e ~300 linhas. Menos que 1.500 palavras de teoria é resumo, não
caderno — falta ficha de conceito em algum item.

NÃO CORTE TEORIA PARA CABER NO TEMPO. Corte enrolação. Se o assunto exigir
mais do que a fatia comporta, escreva tudo e avise no topo da aula, num
callout [!nota], o que fica para o bloco de sábado.

ESTRUTURA RECOMENDADA
   - callout [!banca] — o que a banca cobra + quantas vezes caiu
   - o problema que o conceito resolve
   - o exemplo-fio-condutor, apresentado uma vez
   - a teoria, seção por seção, ficha de conceito por item
   - tabela "palavra do enunciado → conceito"
   - tabela comparativa dos conceitos que se confundem
   - callouts [!pegadinha] — onde a banca derruba
   - questões de 2018/2023 + caderno CESGRANRIO + inéditas, comentadas
   - figuras pendentes, se houver
   - onde treinar no TecConcursos
   - callout [!checklist] — véspera

CHECAGEM FINAL — rode antes de dizer que a aula acabou:
   1. A teoria resolve todas as questões sozinha?
   2. Algum termo técnico foi usado sem definição na primeira aparição?
   3. Todo item enumerado tem os seis campos da ficha (R1)?
   4. Toda analogia tem o limite declarado (R2)?
   5. O conceito que mais aparece como distrator é o mais explicado (R4)?
   6. A contagem de palavras da teoria bate com a fatia do calendário?
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

<!-- CUIDADO: o ==realce== NÃO atravessa quebra de linha (assets/md.js, regex
     [^=\n]). Se o trecho realçado passar de uma linha, ele sai como "==texto=="
     literal na tela. Mantenha cada ==...== numa linha só. -->


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

> [!analogia] Nome curto da analogia
> A analogia.
> **Onde quebra:** o ponto exato em que ela deixa de valer.

> [!decore]
> Mnemônico, ordem, sigla.

## Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "expressão que a banca usa" | o conceito | o vizinho |

## Onde a banca derruba

> [!pegadinha] Nome curto da armadilha
> A alternativa "quase certa" e por que ela está errada.

## Questões

<!--
REGRA DAS QUESTÕES — vale para toda aula:

1. TODA questão diz de onde veio, no título. Três formatos, só:
      ### Q01 · TRANSPETRO 2018 · questão 41
      ### Q05 · CESGRANRIO · BNDES 2024
      ### Q09 · Inédita
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

3. ONDE ACHAR AS QUESTÕES — três fontes, nesta ordem:
      a) provas TRANSPETRO 2018 e 2023 (coluna `assunto` dos índices .csv);
      b) "Caderno CESGRANRIO 2023-2026 TI indice.csv" — mesma banca, outros
         órgãos e anos mais recentes. É a fonte mais subaproveitada do projeto;
      c) inéditas, escritas por você, para tapar o que ficou descoberto.
   Busque também por SINÔNIMOS e pelo vocabulário do enunciado, não só pelo
   nome do assunto: parte das questões está indexada sob outro rótulo.

4. LINK: só use URL de questão que tenha vindo do assuntos.py, do índice .csv
   ou de dados/assuntos-tec.json. NUNCA monte um slug a mão — foi assim que um
   link quebrado entrou na aula R01. Sem URL na base, cite a fonte sem link.

5. A alternativa correta é marcada com [x]. Ela NÃO aparece destacada na tela
   até você abrir o comentário, e no PDF vai para o caderno de gabaritos do fim.

6. O comentário nomeia o TIPO DE DISTRATOR de cada errada, usando a taxonomia
   de `perfil-da-banca-CESGRANRIO-TI.md` §3 (T1 neologismo, T2 irmão
   taxonômico, T3 definição verdadeira do conceito errado, T4 inversão de
   papel/ordem, T5 absolutização, T6 justificativa falsa, T7 variação mínima,
   T8 vizinho numérico). É o que treina o olho para a próxima.

7. QUESTÕES COM ALTERNATIVAS EM IMAGEM (alt_em_imagem = S no índice): não
   pule. Traga o enunciado, que existe em texto, e no lugar das alternativas
   ponha um bloco [!imagem] dizendo qual questão é e em que PDF está, para
   recortar depois. ATENÇÃO AO CAMINHO: a aula fica em aulas/<disciplina>/ e
   a pasta de imagens é aulas/img/, então o caminho relativo tem "../".

      > [!imagem] Alternativas da questão 25 da prova de 2018
      > São diagramas MER e não saíram na extração. Recorte do PDF da prova
      > de 2018, questão 25, e salve em `aulas/img/2018-q25.png`. Depois
      > troque este bloco por `![Alternativas](../img/2018-q25.png)`.
      > Gabarito: D.

   No fim da aula, liste todas as figuras pendentes juntas. Se não houver
   nenhuma, diga isso explicitamente — evita procurar de novo depois.
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
> Por que cada errada está errada, uma a uma, com o tipo de distrator.

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

## Figuras pendentes

<!-- Liste aqui todos os blocos [!imagem] da aula, para resolver de uma vez.
     Se não houver nenhum, escreva "Nenhuma." e pronto. -->

## Onde treinar no TecConcursos

<!--
O QUE IMPORTA AQUI E O NOME DO ASSUNTO, nao o link. O estudo e feito
navegando no site pelo filtro de materia > assunto.

NUNCA digite o slug de um link a mao. Se for pôr link, copie do campo "url"
de dados/assuntos-tec.json, nunca invente a partir do nome.

Consulte a arvore real com:
  python ferramentas/assuntos.py <palavra-chave>
  python ferramentas/assuntos.py firewall --materia seguranca
  python ferramentas/assuntos.py --materias

Formato: tabela do filtro principal, depois tabela dos complementos.
-->

Matéria: **TI - Xxxxx**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Pai na Árvore` › **`Nome Exato do Assunto`** |
| Hierarquia | `00.00` |
| Questões no acervo | N |
| No seu caderno CESGRANRIO | N |

Marque também a banca **CESGRANRIO**. Se sobrarem menos de 20 questões, tire o
filtro de banca e resolva as demais como treino de leitura.

**Complementos, para o resto da semana**

| Assunto                       | Hierarquia | Questões | Por quê                               |
| ----------------------------- | ---------- | -------: | ------------------------------------- |
| `Pai` › **`Assunto vizinho`** | `00.00`    |        N | Uma linha dizendo por que complementa |

> [!checklist]
> - Oito linhas, no máximo.
> - O que reler em dois minutos na véspera.

<!--
O CHECKLIST É PARA SER ESCRITO DE MEMÓRIA, não lido.

Na revisão, antes de reabrir a aula, escreva no papel o que você lembra do
checklist e só então compare. Evocar do zero fixa muito mais do que
reconhecer numa lista pronta — e é a única atividade do plano inteiro que
exige PRODUZIR em vez de escolher entre cinco alternativas.

Por isso o checklist tem que ser feito de itens EVOCÁVEIS: listas fechadas,
ordens, pares que se opõem. "As sete camadas na ordem", "AH autentica, ESP
cifra", "bit -> quadro -> pacote -> segmento". Nada de frase solta que só
faz sentido lendo.
-->

