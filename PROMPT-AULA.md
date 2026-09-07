# Prompt para pedir uma aula nova

Copie o bloco abaixo numa conversa nova, **abrindo o Claude Code na pasta
`CESGRANRIO TRANSPETRO`** (a pasta de cima, não a `estudos-transpetro` — os
cadernos e provas ficam lá). Troque só a linha do topo.

Se for pedir a atualização de uma aula que já existe em vez de uma nova, use o
segundo bloco, no fim deste arquivo.

---

## Bloco para colar

```
Crie a aula do tópico R05 do meu calendário de estudos da TRANSPETRO 2026.

CONTEXTO — leia antes de escrever:
- estudos-transpetro/aulas/_MODELO.md — o formato e as regras de profundidade.
  Siga à risca, inclusive o bloco "PROFUNDIDADE EXIGIDA".
- estudos-transpetro/aulas/redes/Modelo OSI - as sete camadas.md — a aula de
  referência, já no padrão. Use como calibre de profundidade e de tom.
- perfil-da-banca-TRANSPETRO.md — como a banca cobra. Curto, leia inteiro.
- perfil-da-banca-CESGRANRIO-TI.md — taxonomia de distratores.
- prioridades.md — peso do bloco e quanto tempo ele merece.
- mapa-edital-2026.md — o item do edital ao qual o tópico corresponde.
- estudos-transpetro/dados/plano.json — ESTE É O CALENDÁRIO BASE. 12 semanas,
  84 sessões, de 07/09/2026 até a prova em 29/11/2026. Dele saem o título
  exato do tópico, a semana a que pertence, a disciplina, a cor e a duração
  da sessão (90 min seg–sex, 120 min sáb–dom). Não invente tópico que não
  esteja lá; se eu pedir um id que não existe, me avise em vez de improvisar.

ANTES DE ESCREVER, rode e use o resultado:
  python estudos-transpetro/ferramentas/assuntos.py <palavra-chave-do-tópico>
Isso devolve o nome real do assunto no TecConcursos, a hierarquia, quantas
questões existem e QUAIS questões de 2018 e 2023 caem nele. Não invente nome
de assunto e não digite slug de link à mão.

QUESTÕES DAS PROVAS — obrigatório:
- Localize no índice de 2018 (coluna `assunto` do
  "Prova + gabarito 2018 ... Indice.csv") e busque o termo no .md de 2023
  todas as questões do assunto.
- Traga cada uma com o ENUNCIADO INTEIRO, as cinco alternativas e a fonte.
- Se não houver nenhuma nas duas provas, diga isso explicitamente na aula e
  compense com questões inéditas bem construídas.
- Toda questão abre com bloco > [!fonte], começando pela palavra "Fonte:".
- Questão escrita por você é marcada como "Inédita", sempre.

QUESTÕES COM ALTERNATIVAS EM IMAGEM — não pule:
Parte das questões tem as alternativas como figura, e o .md extraído não traz
o texto delas. No índice elas aparecem com `alt_em_imagem = S`. O
`assuntos.py` já as marca com [ALTERNATIVAS EM IMAGEM].

NÃO as ignore. Inclua a questão assim:
  - o enunciado, que existe em texto;
  - no lugar das alternativas, um bloco > [!imagem] dizendo exatamente qual
    questão é, em que PDF e em que página aproximada eu encontro, para eu
    recortar e colar depois;
  - o gabarito e o comentário do que dá para comentar sem ver a figura.

Exemplo do bloco:

    > [!imagem] Alternativas da questão 25 da prova de 2018
    > As cinco alternativas são diagramas MER e não saíram na extração.
    > Recorte de "Prova + gabarito 2018 ... .pdf", questão 25, e salve em
    > `aulas/img/2018-q25.png`. Depois troque este bloco por:
    > `![Alternativas da questão 25](img/2018-q25.png)`
    > Gabarito: D.

No fim da aula, liste todas as figuras pendentes num só lugar, para eu
resolver de uma vez.

A TEORIA TEM QUE BASTAR: depois de escrever as questões, releia a teoria e
confirme que ela resolve todas sozinha. Se alguma exige algo que a aula não
explicou, falta seção na aula — acrescente antes de terminar.

PROFUNDIDADE: é caderno de estudo, não resumo. Parto do zero neste assunto.
Explique cada ponto, comece pelo problema que o conceito resolve, use exemplo
concreto com números ou comandos reais, e faça tabela comparativa sempre que
houver conceitos que a banca troca entre si.

ONDE SALVAR:
- estudos-transpetro/aulas/<disciplina>/<Título legível>.md
- frontmatter com id, titulo, resumo e tempo. O id é o que liga ao calendário.
- ao terminar: python estudos-transpetro/ferramentas/indexar.py
- abra a aula no navegador e confira que renderizou antes de dizer que acabou.

NÃO publique no GitHub sem eu pedir.
```

---

## Por que cada parte está aí

**Abrir na pasta de cima.** Os cadernos, as provas, os índices `.csv` e os
perfis de banca ficam em `CESGRANRIO TRANSPETRO`, não dentro de
`estudos-transpetro`. Abrindo na pasta errada, a aula sai sem as questões
reais — que é o que ela tem de mais valioso.

**Citar a aula de referência.** Descrever profundidade em palavras não
funciona; apontar um exemplo pronto funciona.

**Mandar rodar o `assuntos.py`.** Sem isso o nome do assunto do TecConcursos
sai inventado e o filtro não existe no site.

**Exigir enunciado inteiro.** Aula com "veja a questão 41 de 2018" obriga você
a abrir outro arquivo no meio do estudo. O enunciado tem que estar ali.

**Não pular as questões com imagem.** São 2 nas provas (2018 Q25, MER, e Q32,
Árvores) e 28 no caderno de TI, concentradas em Banco de Dados e
Desenvolvimento — ou seja, nas semanas 6, 7 e 8. Ignorá-las tiraria da aula
justamente as questões de modelagem e de código, que são as mais difíceis.

**"A teoria tem que bastar".** É a única regra que força a revisão final. Sem
ela a aula fica com teoria bonita e questões que ela não resolve.

**"Não publique sem eu pedir".** Publicar é ação que sai da sua máquina.

---

## Bloco para ATUALIZAR uma aula existente

Use depois de resolver questões no TecConcursos e encontrar buraco na aula.
Rode antes `python estudos-transpetro/ferramentas/lacunas.py` e cole a saída.

```
Atualize a aula <caminho do arquivo .md> do meu calendário TRANSPETRO 2026.

Resolvendo questões no TecConcursos encontrei conteúdo que a aula não cobria:

<cole aqui a saída do lacunas.py, ou descreva>

<cole aqui as questões que não consegui resolver com a aula, com enunciado
e alternativas>

O QUE FAZER:
- Acrescente as seções de teoria que faltam, no mesmo nível de profundidade
  do resto da aula: comece pelo problema, explique o mecanismo, dê exemplo
  concreto, e tabela comparativa se houver conceitos que se confundem.
- Encaixe no lugar certo da ordem lógica, não como apêndice no fim.
- Se a questão revelou uma armadilha nova, acrescente um > [!pegadinha].
- Acrescente as questões novas na seção de Questões, no formato do
  _MODELO.md, com bloco [!fonte] dizendo de onde vieram.
- Atualize o [!checklist] do fim se o que entrou merece estar lá.
- Não reescreva o que já estava bom. Mostre no fim um resumo do que mudou.
- Ao terminar: python estudos-transpetro/ferramentas/indexar.py

NÃO publique no GitHub sem eu pedir.
```
