# Prompt para pedir uma aula

Copie um dos blocos abaixo numa conversa nova, **abrindo o Claude Code na pasta
`CESGRANRIO TRANSPETRO`** (a pasta de cima, não a `estudos-transpetro` — os
cadernos, as provas e os perfis de banca ficam lá).

- **Bloco 1** — criar uma aula nova, ou refazer uma existente do zero.
  Troque `<ID>` pelo id do tópico no `plano.json` (R05, S03, B02…).
- **Bloco 2** — remendar uma aula que já está boa, depois de resolver questões
  e achar buraco. Não reescreve o que estava certo.

Na dúvida entre os dois: se o problema é *falta de um assunto*, é o Bloco 2. Se
o problema é *a aula inteira estar rasa*, é o Bloco 1.

---

## Bloco 1 — criar ou refazer uma aula

```
Crie/refaça a aula do tópico <ID> do meu calendário de estudos da TRANSPETRO 2026.

CONTEXTO — leia antes de escrever:
- estudos-transpetro/aulas/_MODELO.md — formato e regras. Siga à risca, em
  especial o bloco "PROFUNDIDADE EXIGIDA" e a tabela de TAMANHO E TEMPO.
- estudos-transpetro/aulas/redes/Modelo OSI - as sete camadas.md — a aula de
  referência, no padrão novo. Use como calibre de profundidade, de tom e de
  formato de comentário de questão. É a régua: se a sua aula estiver visivelmente
  mais rasa que ela, falta seção.
- perfil-da-banca-TRANSPETRO.md (leia inteiro, é curto)
- perfil-da-banca-CESGRANRIO-TI.md — §3 tem a taxonomia de distratores T1 a T8
- prioridades.md — peso do bloco
- mapa-edital-2026.md — item do edital correspondente
- estudos-transpetro/dados/plano.json — CALENDÁRIO BASE. Dele saem o título
  exato, a semana, a disciplina e o tempo. Não invente tópico fora dele; se o id
  não existir, me avise em vez de improvisar.
  tempo do frontmatter = "min" do dia ÷ nº de tópicos daquele dia
  (ex.: segunda tem R01 e R02 em 90 min → tempo: 45 min).

ANTES DE ESCREVER, rode e use o resultado:
  python estudos-transpetro/ferramentas/assuntos.py <palavra-chave>

PROFUNDIDADE — é caderno de estudo, parto do zero. Regras:

1. FICHA DE CONCEITO. Para cada item enumerado da aula (cada camada, cada
   protocolo, cada comando, cada modelo), escreva os seis campos abaixo. Não
   precisa rotular na página, mas todos têm que estar lá:
     a) o problema que ele resolve — o que quebra sem ele;
     b) como funciona por dentro, com o mecanismo, não só o rótulo;
     c) uma analogia;
     d) um exemplo concreto com dado real: número, endereço, comando com saída;
     e) as palavras que a banca usa para se referir a isso no enunciado;
     f) o conceito vizinho com que se confunde, e o que os separa.

2. ANALOGIA COM LIMITE, no callout > [!analogia]. Toda analogia vem grudada ao
   mecanismo técnico e a uma linha "onde a analogia quebra". Analogia sem limite
   fabrica erro de prova.

3. EXEMPLO-FIO-CONDUTOR. Escolha UM cenário concreto e atravesse a aula inteira
   com ele, retomando-o em cada seção, em vez de inventar exemplo novo a cada
   parágrafo. Use dados reais (IPs, portas, MACs, saídas de comando).

4. COTA PROPORCIONAL AO RISCO. O conceito que mais aparece como distrator recebe
   MAIS espaço, não menos — mesmo que seja o menos importante na prática.

5. TABELA "PALAVRA DO ENUNCIADO → CONCEITO", na teoria, não só nos gabaritos.
   Uma linha por expressão que a banca usa para fixar a resposta.

6. TABELA COMPARATIVA sempre que houver conceitos que a banca troca entre si.

7. TERMO DEFINIDO NA PRIMEIRA APARIÇÃO. Sem exceção: sigla, protocolo, campo de
   cabeçalho, tudo.

8. TAMANHO: o que o assunto exigir. Não corte teoria para encurtar; corte
   enrolação. Meça com:
     python estudos-transpetro/ferramentas/tamanho.py "<caminho do .md>"
   Ele diz quantos minutos de leitura a teoria tem e compara com a fatia do
   calendário. Se a teoria passar da fatia, NÃO encolha: avise no topo da aula,
   num callout [!nota], como distribuir o excedente no dia.

QUESTÕES — obrigatório. São TRÊS fontes, nesta ordem:

  a) PROVAS TRANSPETRO 2018 e 2023. Localize no índice de 2018 (coluna `assunto`
     do "Prova + gabarito 2018 ... Indice.csv") e busque no .md de 2023.

  b) CADERNO CESGRANRIO 2023-2026 — "Caderno CESGRANRIO 2023-2026 TI indice.csv"
     e o .md correspondente. MESMA BANCA, outros órgãos e anos mais recentes.
     Não pule esta fonte: é a mais subaproveitada do projeto, e nela costumam
     aparecer questões da própria TRANSPETRO de outros cargos, além de BNDES,
     BANESE, CEF e BASA dos últimos dois anos. Traga TODAS as do assunto.

  c) INÉDITAS, escritas por você, só para cobrir o que (a) e (b) deixaram de
     fora — normalmente o conceito que só aparece como distrator.

  A ORDEM DAS QUESTÕES IMPORTA, pela regra das 24 horas do _MODELO.md: no dia
  em que a aula é lida eu resolvo só DUAS OU TRÊS, como conferência de leitura.
  As demais viram aquecimento das sessões seguintes e material do sábado. Então
  ponha na frente as que fecham o conceito central da aula, não as mais fáceis.
  E diga, no [!nota] do topo, quais são as de hoje e quais ficam para depois.

  Em todas as três:
  - ENUNCIADO INTEIRO, as cinco alternativas e a fonte. Nada de "veja a questão
    41 de 2018".
  - Busque também por SINÔNIMOS e pelo vocabulário do enunciado, não só pelo
    nome do assunto — parte das questões está indexada sob outro rótulo.
  - Se não houver nenhuma em (a) e (b), diga isso explicitamente na aula.
  - Toda questão abre com bloco > [!fonte] começando pela palavra "Fonte:".
  - Questão escrita por você é marcada "Inédita", sempre.
  - LINK: só use URL que tenha vindo do assuntos.py, dos índices .csv ou de
    dados/assuntos-tec.json. Nunca monte um slug a mão. Sem URL, cite a fonte
    sem link.
  - O comentário do gabarito NOMEIA O TIPO DE DISTRATOR de cada errada, usando
    a taxonomia T1 a T8 do perfil-da-banca-CESGRANRIO-TI.md §3. É o que treina
    o olho para a próxima.

ALTERNATIVAS EM IMAGEM (alt_em_imagem = S; o assuntos.py marca com
[ALTERNATIVAS EM IMAGEM]) — não pule. Traga o enunciado, que existe em texto, e
no lugar das alternativas um bloco > [!imagem] dizendo qual questão é, em que
PDF e em que página aproximada, o caminho de destino `../img/AAAA-qNN.png`
(a aula fica em aulas/<disciplina>/, a pasta de imagens é aulas/img/) e o
gabarito, com o comentário do que dá para comentar sem ver a figura. Liste todas
as figuras pendentes juntas no fim da aula. Se não houver nenhuma, diga isso.

CUIDADO COM O RENDERIZADOR: o realce ==assim== não atravessa quebra de linha.
Mantenha cada ==...== numa linha só, ou ele sai como "==" literal na tela.

ANTES DE DIZER QUE ACABOU, rode esta checagem e me relate o resultado:
 (a) A teoria resolve todas as questões sozinha? Se alguma exige algo não
     explicado, falta seção — acrescente antes de terminar.
 (b) Algum termo técnico foi usado sem definição na primeira aparição? Liste e
     corrija.
 (c) Todo conceito enumerado tem os seis campos da ficha?
 (d) Toda analogia tem o limite declarado?
 (e) O conceito que mais aparece como distrator é o mais explicado da aula?
 (f) Quanto deu o tamanho.py, e a aula avisa no topo se passou da fatia?
 (g) Todos os ids de questão que você citou existem mesmo nos índices? Confira
     um a um, não confie na memória.

ONDE SALVAR:
- estudos-transpetro/aulas/<disciplina>/<Título legível>.md
- frontmatter com id, titulo, resumo, tempo — uma linha por campo (o parser não
  é YAML de verdade). O id é o que liga ao calendário.
- Se for reescrita de uma aula que já existe, SUBSTITUA o arquivo, sem criar
  cópia de backup: esta pasta é um repositório git e a versão anterior fica
  recuperável com `git show HEAD:"<caminho>"`. Dois arquivos com o mesmo id
  fazem o indexar.py descartar um deles em silêncio.
- ao terminar: python estudos-transpetro/ferramentas/indexar.py
  e confira na saída que não apareceu "AVISO: id ... repetido".
- abra no navegador (python estudos-transpetro/ferramentas/servidor.py →
  http://127.0.0.1:8765) e confirme que renderizou antes de dizer que acabou:
  callouts, tabelas, alternativas e gabaritos colapsáveis.

NÃO publique no GitHub sem eu pedir.
```

---

## Bloco 2 — atualizar uma aula existente

Use depois de resolver questões no TecConcursos e encontrar buraco na aula.
Rode antes `python estudos-transpetro/ferramentas/lacunas.py` e cole a saída.

```
Atualize a aula <caminho do arquivo .md> do meu calendário TRANSPETRO 2026.
Isto é um REMENDO, não uma reescrita: o que já está lá está bom.

Resolvendo questões no TecConcursos encontrei conteúdo que a aula não cobria:

<cole aqui a saída do lacunas.py, ou descreva>

<cole aqui as questões que não consegui resolver com a aula, com enunciado
e alternativas>

CONTEXTO:
- estudos-transpetro/aulas/_MODELO.md — bloco "PROFUNDIDADE EXIGIDA".
- a própria aula que você vai editar: leia inteira antes de mexer, para o
  trecho novo sair no mesmo tom e no mesmo nível dos que já existem.
- perfil-da-banca-CESGRANRIO-TI.md §3 — taxonomia de distratores T1 a T8.

O QUE FAZER:
- Acrescente as seções de teoria que faltam, com a FICHA DE CONCEITO completa:
  o problema que resolve, o mecanismo por dentro, uma analogia com "onde ela
  quebra", um exemplo concreto com dado real, as palavras que a banca usa, e o
  conceito vizinho que se confunde com ele.
- Encaixe no lugar certo da ordem lógica, não como apêndice no fim.
- Reaproveite o exemplo-fio-condutor que a aula já usa. Não invente um segundo
  cenário só para a seção nova.
- Se a aula tem a tabela "palavra do enunciado → conceito", acrescente as linhas
  novas nela.
- Se a questão revelou uma armadilha nova, acrescente um > [!pegadinha].
- Acrescente as questões novas na seção de Questões, no formato do _MODELO.md,
  com bloco [!fonte] dizendo de onde vieram e comentário que nomeia o tipo de
  distrator (T1 a T8).
- Atualize o [!checklist] do fim se o que entrou merece estar lá.
- NÃO reescreva o que já estava bom, e não mexa no frontmatter a não ser que o
  título tenha mudado de verdade.

AO TERMINAR:
- python estudos-transpetro/ferramentas/tamanho.py "<caminho do .md>"
  Se a aula passou da fatia do calendário, atualize (ou crie) o callout [!nota]
  do topo dizendo como distribuir o excedente.
- Só rode o indexar.py se o id, o título ou o nome do arquivo mudaram; para
  edição de conteúdo ele não é necessário.
- Recarregue a aula no navegador e confirme que apareceu a versão nova.
- Me mostre no fim um resumo do que mudou, seção por seção.

NÃO publique no GitHub sem eu pedir.
```

---

## Por que cada parte está aí

**Abrir na pasta de cima.** Os cadernos, as provas, os índices `.csv` e os
perfis de banca ficam em `CESGRANRIO TRANSPETRO`, não dentro de
`estudos-transpetro`. Abrindo na pasta errada, a aula sai sem as questões
reais — que é o que ela tem de mais valioso.

**Citar a aula de referência.** Descrever profundidade em palavras não
funciona; apontar um exemplo pronto funciona. A R01 é a régua atual.

**A ficha de conceito de seis campos.** É o que transforma "explique melhor"
em algo verificável. Sem ela o modelo sempre acha que já explicou o bastante,
e a aula sai com um parágrafo por item — resumo, não caderno.

**Analogia com limite.** Analogia solta em material de concurso fabrica erro:
"a camada 6 é o tradutor" faz marcar Apresentação numa questão sobre tradução
de IP para MAC. A linha "onde a analogia quebra" é o que impede isso.

**Cota proporcional ao risco.** A primeira versão da R01 dava duas linhas para
Sessão e Apresentação e dizia, ela mesma, três vezes, que essas são as camadas
que mais aparecem como alternativa errada. O que mais derruba era o que menos
tinha sido explicado.

**As três fontes de questão.** Só as duas provas dão 4 questões de OSI. Somando
o caderno CESGRANRIO dá 10 — inclusive duas da TRANSPETRO 2023 de outro cargo,
uma do BNDES 2024 e uma do BANESE 2025. Era a fonte mais subaproveitada do
projeto.

**Nomear o tipo de distrator.** Você não vai reencontrar a mesma questão na
prova; vai reencontrar o mesmo *truque*. T1 a T8 é o vocabulário para isso.

**Mandar rodar o `assuntos.py`, e conferir cada id.** Sem isso o nome do assunto
do TecConcursos sai inventado, o filtro não existe no site, e já entrou link
quebrado numa aula por slug digitado a mão.

**Exigir enunciado inteiro.** Aula com "veja a questão 41 de 2018" obriga você
a abrir outro arquivo no meio do estudo.

**Não pular as questões com imagem.** São 2 nas provas (2018 Q25, MER, e Q32,
Árvores) e 28 no caderno de TI, concentradas em Banco de Dados e
Desenvolvimento — ou seja, nas semanas 6, 7 e 8. Ignorá-las tiraria da aula
justamente as questões de modelagem e de código, que são as mais difíceis.

**O `tamanho.py` em vez de contar linhas.** "Passa de 300 linhas" era um alvo
ruim: tabela e bloco de código enchem linha sem encher conteúdo. O script mede
palavras com peso e devolve minutos de leitura, comparados com a fatia real do
tópico no `plano.json`.

**Substituir o arquivo em vez de arquivar com `_`.** A pasta é um repositório
git: a versão anterior está sempre a um `git show HEAD:"<caminho>"` de
distância. Cópias `_antiga.md` só acumulam lixo, uma por revisão.

**A checagem final.** É a única parte que força a revisão. Sem ela a aula fica
com teoria bonita e questões que ela não resolve.

**"Não publique sem eu pedir".** Publicar é ação que sai da sua máquina.
