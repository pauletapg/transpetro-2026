---
titulo: Ajuda
---

## O ciclo de um dia de estudo

1. **`iniciar.bat`** — indexa as aulas, sobe o servidor e abre o navegador.
2. **Aquecimento**: comece pelas questões que ficaram pendentes da aula de
   ontem, de cabeça, **antes de ler qualquer coisa nova**. Ver *A regra das
   24 horas*, logo abaixo.
3. Abra a sessão do dia, siga os tópicos, leia as aulas.
4. **Conferência**: duas ou três questões da aula de hoje, só para checar se a
   leitura pegou. O resto não é para hoje.
5. Registre os **acertos** e escreva as **observações**.
6. Cada questão errada vira um **erro** no painel — assunto, causa e tipo de
   distrator. Isso alimenta os domingos e a revisão da semana 12.
7. **↑ Publicar** — no topo da página.

## A regra das 24 horas

**Responder sobre um texto que você acabou de ler não mede aprendizado.** Mede
memória de trabalho: o conteúdo ainda está na cabeça porque você fechou a aula
há dois minutos. Você acerta quase tudo, sente que aprendeu, e na semana
seguinte descobre que não. É a armadilha mais comum de quem estuda sozinho, e
ela é traiçoeira justamente porque a sensação é boa.

Por isso a aula não é consumida num bloco só. Ela se espalha em quatro momentos:

| Quando | O quê |
|---|---|
| **Início da sessão** | as questões pendentes da aula anterior, sem reler nada antes |
| **Meio** | a teoria da aula de hoje |
| **Fim** | 2 ou 3 questões de hoje, como aferição de leitura |
| **Sábado** | o que sobrou, junto com a bateria do TecConcursos |

O mesmo tempo total, distribuído de outro jeito. A diferença é que toda
recuperação passa a ter pelo menos um dia de intervalo — e é o intervalo que
fixa, não a repetição.

> [!nota]
> Cada aula diz, no callout do topo, quais questões são do dia e quais ficam
> para depois. Quando a aula for maior que a fatia do calendário — acontece nos
> assuntos de peso — esse mesmo callout traz o plano de como espalhá-la pela
> semana.

## Sábado: os últimos 20 minutos sem filtro

As baterias de sábado são por assunto: Redes, Segurança, SQL. Isso treina
resolver, mas não treina a coisa mais difícil da prova — **descobrir de que
assunto a questão é**. Na prova real a 41 é OSI, a 44 é máscara de rede e a 48
é HTTP, sem aviso nenhum.

Por isso, a partir da semana 2, os últimos 20 minutos do bloco de sábado são um
**bloco misto**: questões de tudo que você já estudou até ali, sem filtro de
assunto. No TecConcursos, tire o filtro de assunto e deixe só a banca
**CESGRANRIO** e as matérias já vistas.

## Domingo: refazer fechado, não reler

O domingo é o bloco que mais se perde por falta de método. Cansado, a tentação
é reabrir a aula e passar o olho — que é o pior uso possível daquela hora.

O jeito certo é sempre o mesmo:

1. Refaça as questões que você errou na semana, **fechadas**, sem olhar o
   gabarito e sem abrir a aula.
2. Só nas que errar **de novo** você abre a aula, e lê apenas a seção
   correspondente.
3. Se errou de novo por falta de conteúdo, registre com o tipo de distrator
   **"falta conteúdo na aula"** — isso vira remendo depois, pelo `lacunas.py`.

A partir da semana 3 o domingo acumula também a revisão espaçada das semanas
anteriores, com o mesmo procedimento. O título de cada domingo no calendário já
diz quais semanas entram.

## O checklist é para escrever, não para ler

Repare numa coisa: **tudo neste plano é reconhecer.** Questão de múltipla
escolha te dá cinco opções e pede para apontar uma; ler a aula te dá o texto
pronto. Em nenhum momento você é obrigado a produzir a resposta do zero — e
produzir do zero é o que mais fixa.

O conserto custa cinco minutos e usa uma coisa que já existe: o **checklist**
do fim de cada aula.

Sempre que for revisar um assunto, **antes de abrir a aula**, pegue papel e
escreva o que você lembra do checklist dela. Só depois abra e compare. O que
faltou no papel é exatamente o que você acha que sabe e não sabe — e é a
informação mais útil que uma sessão de revisão pode te dar.

Vale sobretudo para as listas fechadas, que é onde a CESGRANRIO mais cobra:

- as sete camadas do OSI, na ordem, de baixo para cima;
- `bit → quadro → pacote → segmento`;
- AH autentica, ESP cifra;
- os oito tipos de distrator, T1 a T8.

Os fechamentos de bloco no calendário (semanas 2, 5 e 12) já pedem isso
explicitamente.

> [!nota] Gravar e Publicar são coisas diferentes
> **Gravar** escreve no arquivo do seu computador (`dados/progresso.json`).
> É automático: qualquer alteração é gravada sozinha em menos de um segundo.
>
> **↑ Publicar** manda esse arquivo para o GitHub. **É só isto que faz o
> celular ver a versão nova** — em cerca de um minuto.
>
> Se você grava mas nunca publica, o computador fica em dia e o celular
> continua mostrando a última versão publicada.

## Quem pode alterar o quê

| Onde | Pode gravar? |
|---|---|
| Computador, com o `iniciar.bat` rodando | **Sim**, em qualquer navegador |
| Computador, sem o servidor, no Chrome ou Edge | Sim, pela File System Access API |
| Computador, sem o servidor, no Brave ou Firefox | Não — só leitura |
| Celular, pelo GitHub Pages | Não — só leitura, de propósito |

O celular é leitura por decisão de projeto: se você anotasse lá, o computador
sobrescreveria na próxima gravação e você perderia o registro.

> [!nota]
> Se aparecer *"Modo leitura"* no computador, o servidor não está rodando. Feche
> a aba e comece pelo `iniciar.bat`. O Brave bloqueia a gravação direta em
> arquivo, então **no Brave o servidor é obrigatório** — mas com ele funciona
> normalmente.

## Criar uma aula

As aulas não se escrevem sozinhas — cada uma é pedida numa conversa com o
Claude Code. O texto pronto do pedido está em **`PROMPT-AULA.md`**, na raiz do
projeto: copie o primeiro bloco, troque o id do tópico e cole.

Três coisas que fazem diferença nesse pedido:

1. **Abra o Claude Code na pasta de cima** (`CESGRANRIO TRANSPETRO`), não na
   `estudos-transpetro`. Os cadernos, as provas e os índices `.csv` estão lá.
   Na pasta errada, a aula sai sem as questões reais das provas.
2. **O calendário base é o `dados/plano.json`** — 12 semanas, 84 sessões, de
   07/09 até a prova em 29/11. É de lá que saem o título do tópico, a semana,
   a disciplina e a duração da sessão.
3. **Questões com alternativas em imagem** entram na aula com um bloco
   destacado dizendo qual questão é e em que PDF está, para você recortar e
   salvar em `aulas/img/`. São 2 nas provas e 28 no caderno de TI,
   concentradas em Banco de Dados e Programação.

### Se preferir escrever à mão

1. Copie `aulas/_MODELO.md` para a pasta da disciplina.
2. Dê um nome legível: `aulas/redes/Modelo OSI - as sete camadas.md`.
3. No frontmatter, ponha o **`id` do tópico** — é só isso que liga o arquivo
   ao calendário. Pasta e nome do arquivo são livres.

```yaml
---
id: R05
titulo: Topologias e meios físicos
---
```

A aula aparece na próxima vez que você rodar o `iniciar.bat`.

## As questões nas aulas

Toda questão diz de onde veio: **prova e ano**, ou **"Inédita"** quando foi
escrita com base no perfil da banca. As aulas trazem, sempre que existirem, as
questões de **2018 e 2023** relacionadas ao assunto, com o enunciado inteiro — e
a teoria da aula é suficiente para resolvê-las.

O gabarito **não fica à vista**: responda primeiro, clique em *Comentário*
depois. No PDF, os comentários saem de perto das questões e viram um **caderno
de gabaritos** no fim do documento.

Quando a questão original tem as alternativas em figura, a aula mostra um bloco
tracejado em amarelo com a referência do PDF. É pendência sua: recorte, salve em
`aulas/img/` e troque o bloco pela imagem.

## Quando a aula não dá conta da questão

Vai acontecer: você resolve questões no TecConcursos e cai numa que a aula não
explicava. **Isso é sinal de aula incompleta, não de erro seu** — e a aula deve
ser corrigida, porque ela é o material que vai sobrar para a véspera.

Registre na hora, dentro da sessão do dia, de um dos dois jeitos:

- como **erro**, escolhendo o tipo de distrator **"falta conteúdo na aula"**;
- ou nas **observações**, numa linha começando com `FALTA:`.

Depois, quando quiser atualizar as aulas, rode:

```
python ferramentas/lacunas.py
```

Ele junta tudo que você marcou, agrupado por sessão, já dizendo qual arquivo de
aula editar. Cole a saída numa conversa nova junto com as questões que te
derrubaram — o bloco pronto para isso está em `PROMPT-AULA.md`.

> [!nota]
> Registre no momento em que acontece. Depois de duas horas de questões você
> não lembra qual conceito faltava.

## Ler offline no celular

Abra o site e toque em **⤓ Offline**. Ele baixa calendário e aulas; a partir daí
abre sem internet. Toque de novo depois de publicar aulas novas.

Adicione à tela de início e ele abre como aplicativo.

## Salvar em PDF

Dentro de qualquer aula, botão **⎙ PDF** → *Salvar como PDF*.

## Atalhos

| Tecla | No calendário | Na aula |
|---|---|---|
| `←` `→` | semana anterior / próxima | aula anterior / próxima |
| `Ctrl+S` | gravar | — |
| `Esc` | fechar o diálogo | — |

## Se algo der errado

**"Não consegui ler os dados"** — você abriu o `index.html` com dois cliques.
Navegador nenhum lê arquivos assim, por segurança. Use o `iniciar.bat`.

**Escrevi a aula e ela não apareceu** — falta o `id` no frontmatter, ou o índice
não foi regerado. Rode o `iniciar.bat` de novo.

**Gravei mas o celular não atualizou** — falta o `publicar.bat`. Gravar escreve no
disco; publicar manda para o GitHub.

**Perdi o progresso** — não perdeu. Cada alteração vai para o armazenamento do
navegador na hora, e a página recupera de lá se for mais recente que o arquivo.
Clique em **Gravar**.
