---
id: R02
titulo: Encapsulamento: PDU, cabeçalho e payload
resumo: Ao terminar, você diz de cabeça o nome da PDU de cada camada, aponta qual campo de cada cabeçalho decide para quem entregar o bloco na subida, e calcula quantos bytes um pedido HTTP de 120 bytes ocupa de verdade no cabo.
tempo: 45 min
---

> [!banca]
> **Itens 1.1e (Modelo OSI da ISO) e 1.1f (Arquitetura e protocolos TCP/IP) do edital 2026.**
> Cobrança **conceitual e de vocabulário**: dado um verbo ("segmenta", "fragmenta",
> "enquadra", "encapsula") ou um nome de unidade ("segmento", "datagrama", "pacote",
> "quadro"), dizer de que camada aquilo é.
>
> **Quantas vezes caiu:** ==zero vezes como assunto principal em 2018 e em 2023.==
> Nenhuma das 70 questões de 2018 nem das 70 de 2023 tem "encapsulamento" ou "PDU" como
> tema primário. Não conclua daí que é matéria fria — conclua o contrário: o
> encapsulamento é a **máquina por trás** de cinco questões que caíram (2018 Q41, Q42, Q43;
> 2023 Q48, Q53) e da metade das questões de redes da banca. Ele quase nunca é a pergunta;
> é quase sempre o que você precisa saber para responder a pergunta.
>
> **Onde ele aparece com nome próprio é no caderno CESGRANRIO recente.** Esta aula traz
> **8 questões reais** de 2023–2025 em que o encapsulamento decide o gabarito, incluindo a
> **BNDES 2024** (a camada que "segmenta e entrega à camada de rede, que transforma esses
> segmentos em pacotes" — é o enunciado mais limpo do assunto em todo o acervo) e a
> **CNU 2024**, cujo distrator A é literalmente um erro de encapsulamento plantado.
> Mais **2 da TRANSPETRO** relidas por esta ótica: **10 questões reais de banca, e
> nenhuma inédita** — com dez de prova na mesa, questão escrita por mim só diluiria o
> treino no molde verdadeiro da CESGRANRIO.
>
> **O molde:** enunciado definicional longo, alternativa de duas ou três palavras — os 56%
> da ênfase 4. Os distratores são **T4** (troca o nome da unidade entre camadas vizinhas) e
> **T2** (oferece a camada vizinha, que também mexe em blocos de dados). Sobre este assunto
> pesa ainda um risco raro: o enunciado descreve um mecanismo **certo** com o **nome da
> unidade errado**, e a alternativa fica quase indistinguível da certa.

> [!nota] Esta aula não cabe na segunda-feira. Como espalhá-la pela semana.
> Medido com `python ferramentas/tamanho.py`: a teoria abaixo tem **8.000 palavras, 91 min
> de leitura de estudo**, e as 14 questões, mais **56 min** — 152 min ao todo, contra uma
> fatia de **45 min** (segunda da semana 1: 90 min ÷ 2 tópicos). E a segunda ainda é dividida
> com R01, que sozinha ocupa 71 min dos 90. **Sobram 19 minutos para esta aula na
> segunda-feira, e não há como fingir o contrário.**
>
> Não encolhi a teoria, porque três quartos dela são pré-requisito declarado dos tópicos dos
> dias seguintes — R03 (pilha TCP/IP), R04 (TCP × UDP), R06 (equipamentos), R07 a R10 (IP e
> roteamento). Escrever de novo lá custa mais do que ler uma vez aqui. Então o excedente não
> some: ele vira a leitura de abertura dos outros dias da semana 1, sempre no dia em que ela
> serve de base para o tópico daquele dia.
>
> Pela **regra das 24 horas** do `_MODELO.md`, as questões de cada trecho não são resolvidas
> no dia em que ele é lido: elas abrem o dia seguinte, de cabeça, antes de qualquer leitura
> nova. Responder logo depois de ler mede memória de trabalho, não aprendizado.
>
> | Quando | O que ler | Questões (do dia anterior) | Custo |
> |---|---|---|---|
> | **Segunda**, nos 19 min que sobram de R01 | seções **1 e 3** (o vocabulário: PDU, SDU, PCI) — pule a 2, que repete o cenário de R01 | — | 14 min |
> | **Terça**, antes de R03/R04 | seções **2, 4, 5 e 6** (as cinco PDUs, a descida, a subida) | **Q03** | 4 + 29 min |
> | **Quarta**, antes de R06 | seções **7 e 8** (desencapsulamento e o salto) | Q05, Q06, Q07 | 12 + 10 min |
> | **Quinta**, antes de R07 | seção **9** (MTU, MSS, fragmentação) | Q01 | 4 + 9 min |
> | **Sexta**, antes de R09/R10 | nada novo desta aula | Q10 | 4 min |
> | **Sábado**, no bloco L02 de 60 min | seções **10 e 11**, as duas tabelas e as pegadinhas | Q02, Q04, Q08, Q09 | 22 + 16 min |
>
> O deslocamento de um dia arruma de quebra a sobrecarga da terça, que era a linha mais
> apertada: em vez de 41 min, ela pede 33. A única que ainda estoura é o sábado, com 46 dos
> 60 min do L02 — e ali a saída é começar pelas questões e deixar a seção 11 (túnel) para o
> domingo, se faltar tempo.
>
> Se precisar cortar, **corte questão, nunca as seções 3 e 4** — elas são o assunto, e as
> questões voltam no domingo de erros. O checklist do fim é de véspera de prova, não de agora.

---

## 1 · O problema que o encapsulamento resolve

R01 estabeleceu que as camadas são independentes: trocar par trançado por fibra mexe só na
camada 1. Falta responder **como** essa independência é conseguida na prática, já que os
dados de todas as sete camadas viajam pelo mesmo cabo, misturados, num fluxo único de
pulsos elétricos.

Suponha que não houvesse encapsulamento e que cada camada escrevesse o que precisa num
espaço comum, um cabeçalho único combinado entre todas. Três coisas quebram na hora:

1. **Toda mudança em uma camada vira mudança em todas.** Acrescentar um campo no IP
   deslocaria os campos do TCP. O IPv6, que tem cabeçalho de tamanho diferente do IPv4,
   seria impossível de introduzir sem reescrever o Ethernet.
2. **Nenhuma camada saberia o que é dela.** Chegando um bloco de 178 bytes, quem lê
   precisa saber onde termina a parte do Ethernet e começa a do IP. Sem uma fronteira
   declarada, é adivinhação.
3. **O roteador teria que entender tudo.** Hoje ele lê 20 bytes de IP e ignora o resto —
   inclusive protocolos de aplicação que nem existiam quando ele foi fabricado.

**O encapsulamento** é a solução: cada camada, ao receber um bloco da camada de cima,
**não o abre e não o altera**; ela trata esse bloco como carga opaca, gruda o **seu**
cabeçalho na frente e entrega o resultado para a camada de baixo. Do outro lado, cada
camada retira exatamente o cabeçalho que é seu, do tamanho que ela sabe que ele tem, e
passa o miolo para cima sem olhar.

É a mesma ideia que existe em qualquer sistema em camadas: cada nível conhece o formato do
próprio cabeçalho e mais nada. ==A camada N nunca interpreta o conteúdo da camada N+1.==
Essa frase de uma linha é o assunto inteiro.

> [!analogia] O malote com envelopes dentro de envelopes
> O contrato vai num envelope do jurídico; esse envelope entra num envelope do
> departamento; esse entra na sacola da transportadora. Cada envelope tem, escrito por
> fora, só o que aquele nível precisa saber para despachar. Ninguém abre o de dentro.
>
> **Onde quebra — e é o ponto de prova:** no correio, cada envelope é aberto **uma vez**,
> no destino final. Na rede, o envelope da camada 2 é **rasgado e refeito a cada trecho**
> da viagem, com endereços diferentes, enquanto o envelope da camada 3 atravessa a viagem
> inteira sem ser trocado. Um único envelope que vai de ponta a ponta descreve o pacote IP,
> não o quadro. Ver a seção 8.

## 2 · O exemplo que atravessa a aula inteira

É o mesmo de R01, de propósito: os dois tópicos dividem a mesma segunda-feira e o mesmo
cenário. Você digita `http://www.transpetro.com.br` num notebook da rede da TRANSPETRO.

| Elemento | Valor |
|---|---|
| Seu notebook | IP `10.20.30.40/24`, **MAC** `A4:BB:6D:11:22:33` |
| Roteador de saída (gateway) | IP `10.20.30.1`, MAC `00:1A:2B:3C:4D:5E` |
| Servidor web | IP `200.150.10.80`, porta `80` |
| Porta de origem sorteada pelo seu sistema | `51344` |
| O que o navegador entregou para descer | 120 bytes de texto HTTP |

Os 120 bytes são estes:

```
GET / HTTP/1.1
Host: www.transpetro.com.br
User-Agent: Mozilla/5.0
```

Guarde o número **120**. Ele vai virar 140, 160, 178 e 186 nas próximas seções, e cada
salto desses é um cabeçalho.

## 3 · O vocabulário oficial: PDU, SDU e PCI

A norma ISO/IEC 7498 — a mesma que define as sete camadas — dá nome a três coisas. A banca
usa a primeira o tempo todo, a segunda de vez em quando e a terceira quase nunca; mas as
três explicam uma à outra, e sem as três a primeira fica sendo só uma sigla decorada.

### PDU — unidade de dados de protocolo

**O problema.** Quando duas máquinas conversam, é preciso um nome para "o bloco inteiro
que a camada 3 de um lado manda para a camada 3 do outro lado". Sem esse nome, toda frase
sobre rede vira ambígua: "o dado" pode ser o texto do usuário ou o texto mais os quatro
cabeçalhos por cima dele.

**Como funciona.** **PDU** (*Protocol Data Unit*, unidade de dados de protocolo) é o bloco
completo que uma camada monta e entrega à camada de baixo: **o cabeçalho daquela camada
mais tudo o que veio de cima**. A PDU da camada N vira, na camada N−1, apenas carga — e
ganha mais um cabeçalho.

**Exemplo com dado real.** No nosso cenário, a PDU da camada 4 tem 140 bytes: 20 de
cabeçalho TCP mais os 120 do HTTP. Essa mesma PDU de 140 bytes é, para a camada 3, só
carga: a camada 3 põe 20 bytes na frente e chama o conjunto de 160 bytes de PDU **dela**.

**Como a banca chama:** *"unidade de dados de protocolo"*, *"PDU"*, *"a unidade de
informação trocada entre camadas pares"*, e — o mais comum de longe — simplesmente pelo
nome específico de cada camada: quadro, pacote, segmento.

**Não confunda com:** a **SDU**, logo abaixo. PDU é o bloco **com** cabeçalho; SDU é o
mesmo bloco visto de baixo, **sem** o cabeçalho de quem está olhando.

### SDU — unidade de dados de serviço, ou payload

**O problema.** Falta um nome para "aquilo que eu recebi da camada de cima e não posso
tocar". É a parte que atravessa a camada intacta, e é justamente o que distingue
encapsular de processar.

**Como funciona.** **SDU** (*Service Data Unit*, unidade de dados de serviço) é o dado que
a camada N recebe da camada N+1 através da interface entre elas, e que a camada N trata
como opaco. A relação exata, e vale decorar: ==a PDU da camada N+1 é a SDU da camada N.==
Em texto de prova e de manual, a SDU aparece quase sempre pelos sinônimos **payload** ou
**carga útil** — "útil" no sentido de "o que o usuário queria transportar", em oposição aos
bytes de controle.

**Exemplo com dado real.** O quadro Ethernet do nosso exemplo tem 178 bytes; 160 deles são
a SDU (o pacote IP inteiro) e 18 são de controle (14 de cabeçalho + 4 de fecho). Se você
mandar o mesmo pedido por uma rede Wi-Fi, a SDU continua sendo exatamente os mesmos 160
bytes — muda só o invólucro.

**Como a banca chama:** *"carga útil"*, *"payload"*, *"dados do usuário"*, *"campo de
dados"*, *"os dados propriamente ditos"*.

**Não confunda com:** a **PDU**. Numa questão que diga "o quadro Ethernet transporta um
**payload** de 46 a 1500 bytes", esses 46 a 1500 são a SDU; o quadro (a PDU) é isso mais
18 bytes.

### PCI — informação de controle de protocolo, ou o cabeçalho

**O problema.** O cabeçalho não é enfeite: ele é o único canal pelo qual a camada N de um
lado fala com a camada N do outro. Toda decisão que uma camada toma sai de um campo que a
camada par escreveu.

**Como funciona.** **PCI** (*Protocol Control Information*, informação de controle de
protocolo) é o conjunto de campos que a camada acrescenta por conta própria. Na prática, é
o **cabeçalho** (*header*) — e, num caso só, também o **fecho** (*trailer*), que vai depois
da carga. A conta que fecha tudo:

```
PDU(N)  =  PCI(N)  +  SDU(N)
PDU(N)  =  cabeçalho da camada N  +  PDU(N+1)
```

**Exemplo com dado real.** O cabeçalho IPv4 tem 20 bytes quando não há opções, e nesses 20
bytes cabem os dois endereços (4 + 4), o **TTL** (*Time To Live*, o contador de saltos que
o pacote ainda pode dar antes de ser descartado), o campo Protocolo e mais oito campos. É
toda a informação que um roteador do outro lado do mundo terá para decidir o que fazer.

**Como a banca chama:** *"cabeçalho"*, *"informação de controle"*, *"o protocolo adiciona
um cabeçalho"*, *"campos de controle"*.

**Não confunda com:** o **fecho**. ==Só a camada 2 acrescenta informação no FIM do bloco.==
Todas as outras acrescentam apenas na frente. É por isso que a alternativa que diz "cada
camada acrescenta um cabeçalho e um rodapé" está errada — ela vale para a 2 e só para ela.

> [!analogia] A caixa de mudança com a etiqueta colada
> A **SDU** é o que você põe dentro da caixa: os pratos, que a transportadora não abre. A
> **PCI** é a etiqueta colada por fora, com destino e "frágil". A **PDU** é a caixa fechada,
> etiqueta e pratos juntos — e é ela, inteira, que entra no caminhão e vira "conteúdo" para
> o nível seguinte.
>
> **Onde quebra:** você pode abrir a caixa e conferir os pratos; a camada de baixo **não
> pode**, nem tem como. Ela não sabe se lá dentro há um pacote IP, um pacote IPv6 ou uma
> mensagem ARP — ela só sabe o número que a etiqueta declara (seção 6). É essa cegueira
> deliberada que torna as camadas trocáveis, e é o contrário do que a caixa de mudança faz.

> [!decore]
> **PDU = PCI + SDU.** Ou, em português puro: **bloco inteiro = cabeçalho + carga**.
> E a regra que liga as camadas: **a PDU de cima vira a SDU de baixo**.

## 4 · As cinco PDUs, uma por uma

Este é o miolo do assunto e é onde a banca mais derruba, então é a seção mais longa da
aula de propósito. **Quatro das dez questões desta aula** — Q03, Q04, Q05 e Q06 —
são decididas por saber qual nome de unidade pertence a qual camada, e nada mais.

### Bit — camada 1, Física

**O problema.** No fim, o que existe é tensão num cabo. Alguém tem que tratar o dado como
sequência pura de 0 e 1, sem estrutura nenhuma.

**Como funciona.** A camada física não encapsula: ela **não acrescenta cabeçalho**. Ela
converte o quadro que recebeu em sinal e transmite. O que ela acrescenta, no Ethernet, é
sinalização de sincronismo que **não faz parte do quadro**: 7 bytes de **preâmbulo**
(a sequência `10101010` repetida, para os relógios dos dois lados se alinharem) e 1 byte de
**SFD** (*Start Frame Delimiter*, delimitador de início de quadro, `10101011`, cujo último
par de 1 avisa "acabou o preâmbulo, o quadro começa no próximo bit").

**Exemplo com dado real.** Os 178 bytes do nosso quadro viram 1.424 bits no cabo. Com
preâmbulo e SFD, o cabo carrega 186 bytes, ou 1.488 bits — e depois disso vem ainda um
intervalo obrigatório de silêncio equivalente a 12 bytes, o *interframe gap*.

**Como a banca chama:** *"fluxo de bits não estruturado"*, *"bit"*, *"sinal"*.

**Não confunda com:** o **byte**. A camada 1 não sabe o que é byte; agrupar bits em blocos
com começo e fim é serviço da camada 2.

### Quadro (*frame*) — camada 2, Enlace

**O problema.** A camada 1 entrega um fluxo contínuo. Sem uma marca de início e de fim, o
receptor não sabe onde uma mensagem acaba e outra começa — e um bit invertido pelo ruído
passaria despercebido.

**Como funciona.** A camada 2 faz o **enquadramento**: delimita o bloco e acrescenta
cabeçalho **e** fecho. No Ethernet II, o cabeçalho tem **14 bytes** — MAC de destino (6),
MAC de origem (6) e **EtherType** (2), um número que diz qual protocolo está lá dentro. O
fecho tem **4 bytes**: o **FCS** (*Frame Check Sequence*, sequência de verificação de
quadro), um **CRC-32** calculado sobre o quadro inteiro. Se o CRC não bater na chegada, o
quadro é **descartado em silêncio** — a camada 2 detecta erro, não conserta e não avisa a
origem.

O campo de dados do quadro Ethernet tem entre **46 e 1500 bytes**. O teto de 1500 é a
**MTU** (seção 9). O piso de 46 existe por causa da detecção de colisão do Ethernet
clássico: um quadro curto demais terminaria de ser transmitido antes de a colisão voltar.
Se a carga for menor que 46, a camada 2 acrescenta **preenchimento** (*padding*) de zeros
até chegar lá.

**Exemplo com dado real.** Um `ACK` puro do TCP — um segmento que serve só para confirmar
o recebimento de dados, sem levar dados novos — não carrega nenhum byte de aplicação: são
20 bytes de TCP + 20 de IP = 40 bytes de carga. Como 40 < 46, entram 6 bytes de
preenchimento, e o quadro sai com os **64 bytes** que são o mínimo do Ethernet. É um quadro
com **zero bytes de conteúdo útil** e 64 de invólucro — o caso extremo de sobrecarga.

**Um detalhe que vira questão:** para preencher os 6 bytes de MAC de destino, a estação
precisa **descobrir** esse MAC, e ela só conhece o IP. Quem faz essa tradução é o **ARP**
(*Address Resolution Protocol*), que pergunta em *broadcast* na rede local *"quem tem
10.20.30.1?"* e usa a resposta para fechar o cabeçalho.
==Sem ARP o quadro não fica pronto: falta um campo, e o encapsulamento da camada 2 trava.==
Não confunda o ARP com o **ICMP** (*Internet Control Message Protocol*), que reporta erro e
alcançabilidade e é o protocolo do `ping`, nem com o **IGMP** (*Internet Group Management
Protocol*), que administra grupos de *multicast* — os três são auxiliares da pilha, com
funções distintas.

**Como a banca chama:** *"quadro"*, *"frame"*, *"dividindo o fluxo de bits recebidos em
frames"*, *"enquadramento"*, *"delimitação"*.

**Não confunda com:** o **pacote**. O quadro é local e descartável: existe só entre dois
equipamentos vizinhos e é refeito a cada salto. Ver seção 8.

### Pacote (*packet*) — camada 3, Rede

**O problema.** O quadro só alcança o vizinho. Falta uma unidade que sobreviva à travessia
inteira, de origem a destino, atravessando redes de tecnologias diferentes.

**Como funciona.** A camada 3 acrescenta um cabeçalho de **20 bytes** (IPv4 sem opções; o
máximo é 60, com opções) contendo os dois endereços IP, o **TTL** e o campo **Protocolo**. O pacote é a única PDU que atravessa
a viagem inteira sem ser refeita — muda nela apenas o TTL, decrementado a cada roteador, e
o ***checksum*** do cabeçalho (soma de verificação: um número calculado sobre os campos, que
o receptor recalcula para ver se bateu), refeito por causa disso.

**Exemplo com dado real.** No nosso caso: origem `10.20.30.40`, destino `200.150.10.80`,
TTL 64, Protocolo 6, comprimento total 160. Esses valores são idênticos no primeiro cabo e
no décimo — só o TTL cai: 64, 63, 62.

**Como a banca chama:** *"pacote"*, *"datagrama IP"*, *"controla a operação da sub-rede"*,
*"roteados da origem até o destino"*.

**Não confunda com:** o **datagrama do UDP**. As duas coisas se chamam datagrama, e são de
camadas diferentes. Regra prática: ==se o enunciado disser "datagrama IP", é camada 3.==
Se disser "datagrama" perto de porta, aplicação ou transporte, é UDP, camada 4.

### Segmento — camada 4, Transporte, quando o protocolo é TCP

**O problema.** A aplicação entrega um fluxo de bytes que pode ter megabytes. A rede
transporta blocos de no máximo 1500 bytes. Alguém tem que cortar, numerar e permitir
remontar.

**Como funciona.** O TCP corta o fluxo em pedaços do tamanho que a rede aguenta — é a
**segmentação** — e põe em cada pedaço um cabeçalho de **20 bytes** (máximo 60, com
opções). O cabeçalho traz porta de origem, porta de destino, **número de sequência**
(quantos bytes já foram enviados antes deste), **número de reconhecimento** (o próximo byte
que se espera receber), o campo de **janela**, o *checksum* e os **bits de controle**, as
*flags* de um bit cada: `SYN` **abre** a conexão e sincroniza a numeração, `ACK` **confirma**
o que chegou, `FIN` **encerra** de forma ordenada, `RST` derruba à força, `PSH` pede entrega
imediata à aplicação e `URG` marca dado urgente.
==`SYN` é de abertura e `FIN` é de encerramento: os dois nunca aparecem no mesmo passo.==

**Exemplo com dado real.** No nosso pedido: porta de origem `51344`, porta de destino `80`,
`SYN=0`, `ACK=1`, `PSH=1`, 120 bytes de carga. Na abertura da conexão, três segmentos antes
deste levaram `SYN`, depois `SYN+ACK`, depois `ACK` — e nenhum dos três carregou um byte
sequer de dados.

**Como a banca chama:** *"segmento"*, *"segmenta os dados"*, *"divide o fluxo em
segmentos"*, *"orientado à conexão"*, *"fim a fim"*.

**Não confunda com:** **fragmento**, da camada 3. Segmentar é da 4 e é planejado;
fragmentar é da 3 e é remendo. Ver seção 9 e a pegadinha correspondente.

### Datagrama — camada 4, quando o protocolo é UDP

**O problema.** Nem toda aplicação quer numeração, confirmação e retransmissão. Uma
consulta de **DNS** (*Domain Name System*, o serviço que traduz nome em endereço IP) cabe
num bloco só e perde tempo com o *handshake*, o aperto de mão de três mensagens que o TCP
faz antes de transmitir; uma chamada de voz prefere perder um trecho a receber um trecho
atrasado.

**Como funciona.** O UDP põe **8 bytes** de cabeçalho e nada mais: porta de origem (2),
porta de destino (2), **comprimento** (2, cobrindo cabeçalho + dados) e **checksum** (2).
Não há número de sequência, não há ACK, não há janela — e é por isso que cada bloco é
independente dos outros. Independente é exatamente o que a palavra **datagrama** significa:
uma unidade autocontida, entregue sem relação com as anteriores.

**Exemplo com dado real.** Uma consulta DNS de 40 bytes vira um datagrama UDP de 48 bytes,
um pacote IP de 68 e um quadro de 86. Comparado ao TCP,
==o UDP economiza 12 bytes de cabeçalho por bloco e o custo inteiro do handshake.==

**Como a banca chama:** *"datagrama"*, *"não orientado a conexão"*, *"sem vinculação lógica
entre origem e destino"*, *"não provê fluxo confiável"*.

**Não confunda com:** o **segmento**. É o par que a banca mais troca no assunto todo. E não
confunda com o **datagrama IP**, que é camada 3.

> [!analogia] Cinco nomes para a mesma encomenda em cinco estágios
> A mesma mercadoria muda de nome conforme o estágio do despacho: no depósito é *lote*, na
> esteira é *volume*, no caminhão é *carga*, na nota fiscal é *item*. Ninguém trocou a
> mercadoria — trocou-se o setor que está olhando para ela, e cada setor tem o seu papel
> preso por fora.
>
> **Onde quebra:** no depósito os nomes são só rótulos, e o objeto é o mesmo em todos.
> Aqui **o objeto cresce a cada estágio**: o segmento tem 140 bytes, o pacote tem 160, o
> quadro tem 178. Não é a mesma coisa com nome diferente — é a mesma coisa **mais 20 bytes**
> a cada degrau. Quem trata os cinco nomes como sinônimos erra a Q03 e a Q06.

> [!decore]
> De baixo para cima: **bit → quadro → pacote → segmento (TCP) ou datagrama (UDP)**.
> Da camada 5 para cima não há PDU com nome próprio: chama-se **dados** ou **mensagem**.
> Tamanho dos cabeçalhos, em bytes: **14+4 · 20 · 20 (TCP) ou 8 (UDP)**.

## 5 · A descida, com os bytes na mão

Agora a conta inteira do nosso pedido, camada por camada:

```
camada 7   [ GET / HTTP/1.1 ... ]                       120 bytes   dados
camada 4   [ TCP 20 | 120 ]                             140 bytes   SEGMENTO
              porta origem 51344 · porta destino 80 · PSH,ACK
camada 3   [ IP 20 | 140 ]                              160 bytes   PACOTE
              10.20.30.40 -> 200.150.10.80 · TTL 64 · Protocolo 6
camada 2   [ ETH 14 | 160 | FCS 4 ]                     178 bytes   QUADRO
              A4:BB:6D:11:22:33 -> 00:1A:2B:3C:4D:5E · EtherType 0x0800
camada 1   preâmbulo 7 + SFD 1 + 178                    186 bytes   BITS (1488)
```

**A sobrecarga.** Foram 58 bytes de cabeçalho para transportar 120 de conteúdo: **32,6% do
quadro é invólucro**. Essa proporção é o que se chama **overhead**, ou sobrecarga, e ela é
péssima para blocos pequenos e ótima para blocos grandes — num quadro cheio, com 1460 bytes
de dados, os mesmos 58 bytes representam só 3,8%.

Confirmando no `tcpdump`, com `-e` para mostrar também o cabeçalho de camada 2:

```bash
sudo tcpdump -i eth0 -e -n -c 1 'tcp port 80'

14:22:07.113402 a4:bb:6d:11:22:33 > 00:1a:2b:3c:4d:5e, ethertype IPv4 (0x0800), length 174:
    10.20.30.40.51344 > 200.150.10.80.80: Flags [P.], seq 1:121, ack 1, win 502, length 120
```

Leia a linha de fora para dentro e você tem as quatro camadas: os dois MACs e o EtherType
(camada 2), os dois IPs (camada 3), as duas portas e as *flags* (camada 4), e `length 120`,
que é a carga de aplicação (camada 7).

> [!nota] Por que 174 e não 178
> Porque a placa de rede **já removeu o FCS** antes de entregar o quadro ao sistema
> operacional: ela verificou o CRC, o quadro passou, e os 4 bytes de fecho não têm mais
> serventia. 174 = 14 + 20 + 20 + 120. Um analisador de tráfego mostra 174; o cabo carregou
> 178; o meio físico ocupou 186. Os três números estão certos, cada um no seu ponto de
> medição, e a diferença entre eles é exatamente o assunto desta aula.

## 6 · A subida: como cada camada sabe para quem entregar

Esta é a parte que quase nenhum resumo explica, e é o mecanismo que faz o encapsulamento
funcionar de verdade. Descer é fácil: a camada sabe quem a chamou. **Subir é o problema.**
Quando o quadro chega, a camada 2 retira seus 14 bytes e sobra um bloco de 160 bytes. Como
ela sabe que aquilo é IPv4 e não IPv6, **ARP** (*Address Resolution Protocol*, o protocolo
que descobre o MAC correspondente a um IP — ver Q08) ou algo que nem existia quando o driver
foi escrito?

Pelo **campo de demultiplexação**: cada cabeçalho carrega um número que identifica o
protocolo da camada de cima. Não é dedução, não é heurística — é um número tirado de um
registro público mantido pela **IANA** (*Internet Assigned Numbers Authority*, o órgão que
distribui os números da internet).

| Camada que entrega | Campo no cabeçalho | Valor no nosso exemplo | Significa |
|---|---|---|---|
| 2 → 3 | **EtherType** (2 bytes) | `0x0800` | IPv4 (`0x0806` = ARP, `0x86DD` = IPv6) |
| 3 → 4 | **Protocolo** (1 byte) | `6` | TCP (`17` = UDP, `1` = **ICMP**, mensagens de erro e controle da camada 3, `50` = **ESP**, do IPsec — seção 11) |
| 4 → 7 | **Porta de destino** (2 bytes) | `80` | o processo do servidor web |

**Multiplexação** é o nome da operação na descida — várias conversas de cima compartilhando
uma camada de baixo. **Demultiplexação** é a subida: separar de volta. Um único cabo carrega
ao mesmo tempo seu navegador, seu cliente de e-mail e o `ping` do colega, e o que os mantém
separados são esses três campos.

O último degrau merece uma observação, porque decide questão: a porta identifica um
**protocolo de aplicação**, e todos eles são **camada 7**. As portas conhecidas mais
cobradas são `80` HTTP, `443` HTTPS, `21` e `20` **FTP** (*File Transfer Protocol*,
transferência de arquivos), `25` **SMTP** (*Simple Mail Transfer Protocol*, envio de
correio), `53` DNS, `22` SSH e `23` Telnet.
==FTP, SMTP, DNS e HTTP são protocolos de aplicação, não de transporte.==
Eles *usam* TCP ou UDP; nenhum deles **é** TCP ou UDP — e trocar isso é o distrator da Q02.

> [!analogia] O código de despacho no canto do envelope
> Cada envelope traz, num canto, um código de duas letras dizendo a que setor ele vai —
> não o que tem dentro, só para quem entregar. O porteiro não abre nada: lê o código e
> repassa.
>
> **Onde quebra:** o código do envelope é combinado dentro da empresa e pode ser mudado por
> quem quiser. Os valores de EtherType e de Protocolo são **números fixos de um registro
> mundial**: `0x0800` é IPv4 em todo equipamento do planeta desde 1982, e ninguém pode
> reaproveitá-lo. É essa rigidez que permite ao roteador entender um pacote produzido por
> um sistema que ele nunca viu.

## 7 · Até que camada cada equipamento desencapsula

R01 trouxe a tabela da "camada mais alta em que o equipamento opera". Esta é a mesma tabela
vista por outro ângulo, e este ângulo é o que explica **por quê**: cada equipamento
desencapsula até o cabeçalho de que ele precisa para decidir, e para no que vem depois.

| Equipamento | Desencapsula até | Lê qual campo | O que faz com o resto |
|---|---|---|---|
| Hub, repetidor | **nada** | nenhum | repete o sinal em todas as portas, bit a bit |
| **Switch**, bridge | cabeçalho de **camada 2** | MAC de destino | o pacote IP nem é olhado |
| **Roteador** | cabeçalho de **camada 3** | IP de destino | **descarta** o quadro e monta um novo |
| Firewall de estado | cabeçalho de **camada 4** | porta e *flags* | encaminha ou bloqueia |
| Firewall proxy, **WAF** (*Web Application Firewall*) | conteúdo de **camada 7** | o próprio HTTP | reescreve e reenvia como se fosse o cliente |
| **Servidor** | camada **7** | a mensagem inteira | responde |

Duas leituras que rendem questão:

- **Um switch não vê endereço IP.** Ele para no MAC. É por isso que ele não separa
  domínios de ***broadcast*** — a área em que uma mensagem endereçada "a todos" se
  propaga — sem ajuda de uma **VLAN** (*Virtual LAN*, rede local virtual, que separa portas
  do switch em redes lógicas distintas) ou de um roteador.
- **Quem reporta um erro é quem consegue enxergá-lo.** Uma mensagem de erro ICMP é montada
  pela camada 3 **da máquina que detectou o problema** — que pode ser um roteador, quando o
  erro é de rota ou de TTL, mas tem de ser o **próprio destino** quando o erro depende de um
  campo de camada 4, como "esta porta não está em uso". Roteador não olha porta.
- **Quanto mais fundo o equipamento desencapsula, mais lento e mais caro ele é.** Um switch
  decide olhando 6 bytes; um WAF precisa remontar a conexão TCP inteira, ordenar os
  segmentos e interpretar o texto HTTP. A profundidade de desencapsulamento é o eixo que
  organiza o mercado inteiro de equipamento de rede.

## 8 · O quadro é refeito a cada salto; o pacote não

Aqui está o mecanismo que R01 anunciou e que esta aula precisa fechar, porque quase toda
questão de "o que muda no caminho" sai daqui.

Quando o quadro chega ao roteador `10.20.30.1`:

1. A camada 2 do roteador confere o FCS, retira os 14 bytes de cabeçalho e **joga o quadro
   fora**. Ele cumpriu a função dele, que era atravessar um cabo.
2. A camada 3 lê o IP de destino `200.150.10.80`, consulta a tabela de rotas, decrementa o
   TTL de 64 para 63 e recalcula o *checksum* do cabeçalho.
3. A camada 2 monta um **quadro novo**, com o MAC do roteador como origem e o MAC do
   próximo salto como destino, e um FCS novo, calculado sobre o quadro novo.

O resultado, e vale como frase de decorar:

| O que muda a cada salto | O que não muda de ponta a ponta |
|---|---|
| MAC de origem e MAC de destino | IP de origem e IP de destino |
| O quadro inteiro (cabeçalho e FCS) | Portas de origem e de destino |
| TTL (−1) e *checksum* do cabeçalho IP | Os dados da aplicação |
| A tecnologia de enlace (Ethernet, PPP, Wi-Fi…) — ver seção 10 | O campo Protocolo |

==Endereço IP é de ponta a ponta; endereço MAC é de salto em salto.== Se uma alternativa
disser que o MAC de destino é o da máquina final, ela está errada sempre que houver um
roteador no caminho — e é o distrator preferido do assunto.

> [!analogia] A carga que troca de caminhão
> A encomenda vai de São Paulo ao Rio: caminhão até Campinas, avião até o Galeão, van até o
> endereço. O rótulo com o destinatário final não muda nunca; o que muda é o veículo e a
> etiqueta de cada trecho.
>
> **Onde quebra:** a encomenda é fisicamente a mesma coisa transportada de veículo em
> veículo. O quadro não é "recarregado": ele é **destruído e um novo é criado**, com bytes
> diferentes e um CRC recalculado do zero. Não existe quadro que percorra dois enlaces.

## 9 · MTU, MSS e fragmentação

**O problema.** Cada tecnologia de enlace tem um teto para o tamanho da carga que ela
transporta. O Ethernet aceita 1500 bytes; um túnel VPN aceita menos, porque ele mesmo
gasta bytes de cabeçalho. Se a camada 3 entregar um pacote maior do que o enlace aceita, o
quadro não pode ser montado.

**MTU** (*Maximum Transmission Unit*, unidade máxima de transmissão) é esse teto:
==o maior payload que cabe num quadro daquele enlace — 1500 bytes no Ethernet.== Repare
que a MTU **não inclui** os 18 bytes do próprio Ethernet: um quadro cheio tem 1518 bytes,
com 1500 de MTU dentro.

**MSS** (*Maximum Segment Size*, tamanho máximo de segmento) é o teto correspondente do
lado do TCP: quantos bytes **de aplicação** cabem em um segmento. Num enlace Ethernet:

```
MSS = MTU − cabeçalho IP − cabeçalho TCP
MSS = 1500 − 20 − 20 = 1460 bytes
```

Os dois lados anunciam a MSS deles no `SYN`, dentro do campo de opções do cabeçalho TCP, e
vale a menor das duas. É por isso que a segmentação (camada 4) é a solução **preferida**: o
TCP já corta no tamanho certo, e nada precisa ser remendado adiante.

**A fragmentação** é o remédio para quando isso falha — quando um pacote já formado
encontra pelo caminho um enlace de MTU menor. Aí a camada 3 do roteador **quebra o pacote
em fragmentos**, cada um com uma cópia do cabeçalho IP, e
==quem remonta é a camada 3 do destino final, nunca um roteador intermediário.==

Três campos do cabeçalho IPv4 existem só para isso:

- **Identificação** (16 bits) — o mesmo número em todos os fragmentos de um mesmo pacote,
  para o destino saber quais pedaços vão juntos.
- **Flags** (3 bits) — **DF** (*Don't Fragment*, "não fragmente: descarte e avise") e
  **MF** (*More Fragments*, "ainda vem mais"). O último fragmento tem MF = 0.
- **Deslocamento do fragmento** (13 bits) — em que posição do original este pedaço começa,
  medido em unidades de **8 bytes**.

**Exemplo com dado real.** Um pacote de 4.000 bytes (20 de cabeçalho + 3.980 de dados)
precisa atravessar um enlace de MTU 1500. Cabem 1.480 bytes de dados por fragmento
(1500 − 20), e esse valor tem de ser múltiplo de 8 — 1480 é:

| Fragmento | Dados | Deslocamento | MF | Tamanho no cabo |
|---|---:|---:|:-:|---:|
| 1 | 1.480 | 0 | 1 | 1.500 |
| 2 | 1.480 | 185 | 1 | 1.500 |
| 3 | 1.020 | 370 | 0 | 1.040 |

Os deslocamentos são 0, 1480÷8 = 185 e 2960÷8 = 370. Os 3.980 bytes originais viraram
4.040 no cabo: **60 bytes a mais**, que são os dois cabeçalhos IP duplicados. E o custo real
é maior que isso: perder **um** fragmento obriga a retransmitir o pacote **inteiro**.

No **IPv6** essa história muda, e a banca gosta da diferença:
==roteador IPv6 não fragmenta.== Se o pacote não couber, o roteador o descarta e devolve um
ICMPv6 *Packet Too Big*; a origem é que reduz. Por isso o cabeçalho IPv6 é fixo em
**40 bytes** e não tem os campos de fragmentação nem *checksum* — eles saíram para o
roteador ficar mais rápido. No IPv6 o TTL também troca de nome: chama-se **Limite de
saltos** (*Hop Limit*), e faz exatamente a mesma coisa.

> [!analogia] O vão da porta e o sofá
> A **MTU** é o vão da porta: o maior objeto que passa por ali. A **MSS** é o tamanho que
> você manda o marceneiro cortar, já descontando os pés e o plástico-bolha, para o sofá
> entrar sem esforço. **Fragmentar** é o que sobra quando o sofá já está montado e não passa:
> serrar no corredor e remontar lá dentro.
>
> **Onde quebra:** o sofá serrado é remontado por quem serrou. Na rede não:
> ==quem fragmenta é um roteador do meio, e quem remonta é sempre o destino final.==
> O roteador seguinte não junta nada, e cada fragmento viaja o resto do caminho sozinho. É por isso que perder um fragmento
> custa o pacote inteiro.

**Como a banca chama:** *"unidade máxima de transmissão"*, *"MTU"*, *"tamanho máximo de
segmento"*, *"MSS"*, *"fragmentação"*, *"deslocamento do fragmento"*, *"remontagem"*,
*"unidades menores que a MTU do enlace"*.

**Não confunda com:** a **segmentação**, da camada 4 — é a tabela comparativa logo adiante,
e é a troca de camada que a banca mais tenta neste trecho da matéria. E não confunda MTU com
MSS: a MTU mede a carga do **quadro** (1500), a MSS mede a carga de **aplicação** dentro do
segmento (1460). Os 40 bytes de diferença são os dois cabeçalhos.

## 10 · Onde o quadro começa e termina

Falta um detalhe da camada 2 que a banca já usou como distrator. Se o quadro é delimitado
por uma marca especial, o que acontece quando essa marca aparece **dentro** dos dados?

No **HDLC** (*High-level Data Link Control*, protocolo de enlace clássico e ainda cobrado)
e no **PPP** (*Point-to-Point Protocol*), o quadro é cercado pela sequência `01111110`,
chamada **flag**. Se os dados do usuário contiverem seis 1 seguidos, o receptor pensaria
que o quadro acabou ali. A solução é o **bit stuffing** (enchimento de bits): o transmissor
insere um `0` depois de cada cinco `1` consecutivos nos dados, e o receptor remove esse `0`
na chegada. Em protocolos orientados a byte, como o PPP sobre linha serial, usa-se **byte
stuffing**: um byte de escape (`0x7D`) antes do byte que coincidiria com a flag.

Ethernet não precisa disso: ele usa o preâmbulo e o SFD como marca de início, e o campo de
comprimento/EtherType para saber onde parar.

O HDLC também define **quem manda no enlace**, e isso já foi gabarito. São três tipos de
estação: a **primária**, que controla o enlace e emite *comandos*; a **secundária**, que
opera sob controle da primária e só emite *respostas*, sem responsabilidade sobre o enlace;
e a **combinada**, que faz as duas coisas. A configuração do enlace, por sua vez, é
**desbalanceada** (uma primária e uma ou mais secundárias) ou **balanceada** (duas
combinadas). Tipo de estação e tipo de configuração são eixos diferentes:
=="desbalanceada" é configuração, e a banca a oferece como se fosse tipo de estação.==

**Por que isso é ficha de conceito e não curiosidade:** os distratores da questão de HDLC
desta aula (Q09) são exatamente `Stuffing` e `Check Sequence` — dois mecanismos reais de
enquadramento oferecidos como se fossem tipos de estação. Quem sabe o que cada um é elimina
os dois em cinco segundos.

## 11 · O outro encapsulamento: túnel

A palavra "encapsular" tem, em prova de redes, um segundo uso — e ele é o item 1.1g do
edital, que caiu nas **duas** provas da TRANSPETRO.

**O problema.** Você quer ligar duas filiais pela internet como se fosse uma rede só, ou
proteger o tráfego entre elas. Os endereços internos não são roteáveis na internet, e o
conteúdo não pode trafegar em claro.

**Como funciona.** No **tunelamento**, um pacote completo — com o cabeçalho dele — vira
**carga** de outro pacote da **mesma camada**. Um pacote IP com endereços privados
`10.20.30.40 → 10.90.0.5` é posto inteiro dentro de outro pacote IP, com endereços públicos,
e viaja assim até a outra ponta, onde é desembrulhado e segue seu caminho original.

- **IPsec em modo túnel**, com **ESP** (*Encapsulating Security Payload*): cifra e
  encapsula o **pacote original inteiro**.
- **IPsec com AH** (*Authentication Header*, cabeçalho de autenticação): acrescenta um
  cabeçalho separado só com informação de autenticação — **não cifra**. Foi exatamente isso
  que caiu em 2023 (Q42 da prova).
- **GRE** (*Generic Routing Encapsulation*), **VXLAN** (*Virtual Extensible LAN*) e
  **PPPoE** (*PPP over Ethernet*): outros túneis, cada um com o seu cabeçalho extra.

**Exemplo com dado real.** Cada túnel come MTU. Um túnel IPsec ESP típico gasta de 50 a 60
bytes por pacote, o que derruba a MTU útil de 1500 para cerca de 1440 — e é a causa
número um de "a VPN conecta, mas página grande não abre".

**Como a banca chama:** *"tunelamento"*, *"encapsula o pacote original inteiro"*,
*"cabeçalho separado para transportar informações de autenticação"*, *"rede privada
construída sobre uma rede pública"*.

**Não confunda com:** o encapsulamento **entre camadas**, desta aula. E não confunda com o
**encapsulamento de orientação a objetos**, que é esconder atributos atrás de métodos e não
tem nenhuma relação — mas divide a palavra e o acervo de questões.

> [!analogia] O envelope selado dentro da mala diplomática
> No encapsulamento normal, cada camada põe um envelope de tipo diferente. No túnel, um
> envelope **do mesmo tipo** entra dentro de outro igual — carta dentro de carta.
>
> **Onde quebra:** na mala diplomática o conteúdo continua legível para quem tem a chave, e
> o envelope de dentro fica intacto. No IPsec ESP o pacote de dentro é **cifrado**, e o
> roteador do meio não consegue nem saber que existe um pacote ali — ele vê carga
> embaralhada e um número de protocolo (`50`) que diz apenas "isto é ESP".

## Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "unidade de dados de protocolo", "PDU" | o bloco inteiro: cabeçalho + carga | SDU, que é só a carga |
| "carga útil", "payload", "dados propriamente ditos" | **SDU** — o que veio de cima, intocado | PDU |
| "acrescenta um cabeçalho e entrega à camada inferior" | **encapsulamento** | tunelamento |
| "segmenta os dados", "divide o fluxo em segmentos" | **camada 4**, transporte | fragmentação, que é da 3 |
| "fragmenta", "divide em unidades menores que a MTU" | **camada 3**, rede | segmentação, que é da 4 |
| "divide o fluxo de bits em frames", "enquadramento" | **camada 2**, enlace | camada 1 |
| "transforma esses segmentos em pacotes" | **camada 3** recebendo a PDU da 4 | camada 2 |
| "datagrama", com porta ou transporte por perto | **UDP**, camada 4 | segmento, que é TCP |
| "datagrama IP" | o **pacote**, camada 3 | datagrama UDP |
| "unidade máxima de transmissão", "1500 bytes" | **MTU** | MSS, que é 1460 |
| "maior quantidade de dados de aplicação por segmento" | **MSS** | MTU |
| "sequência de verificação de quadro", "CRC no fim do quadro" | **FCS**, camada 2 | *checksum* do IP, que cobre só o cabeçalho |
| "traduzir o IPv4 no endereço físico da interface" | **ARP**, para preencher o MAC do quadro | DNS, que traduz nome em IP |
| "encapsula o pacote original inteiro" | **túnel** (IPsec ESP) | AH, que só autentica |
| "sobrecarga", "overhead" | os bytes de cabeçalho | carga útil |

## Tabela comparativa: as quatro PDUs que a banca troca

| | **Quadro** | **Pacote** | **Segmento** | **Datagrama (UDP)** |
|---|---|---|---|---|
| Camada | 2 · Enlace | 3 · Rede | 4 · Transporte | 4 · Transporte |
| Cabeçalho | **14 bytes** + 4 de fecho | **20 bytes** | **20 bytes** | **8 bytes** |
| Endereço que carrega | MAC (48 bits) | IP (32 bits) | porta (16 bits) | porta (16 bits) |
| Alcance | um salto | ponta a ponta | ponta a ponta | ponta a ponta |
| Sobrevive ao roteador? | **não**, é refeito | sim | sim | sim |
| Campo que aponta para cima | EtherType | Protocolo | porta de destino | porta de destino |
| Verbo da banca | enquadrar | **fragmentar** | **segmentar** | encapsular |

E o par que mais confunde, isolado:

| | **Segmentação** | **Fragmentação** |
|---|---|---|
| Camada | **4** (transporte) | **3** (rede) |
| Quem faz | a origem, sempre | qualquer roteador do caminho (só IPv4) |
| Por quê | o fluxo da aplicação é grande demais | o pacote é maior que a MTU do próximo enlace |
| Limite que respeita | **MSS** (1460) | **MTU** (1500) |
| Quem remonta | o TCP do destino, pelo nº de sequência | o IP do destino, por Identificação + deslocamento |
| Evitável? | não, é o funcionamento normal | sim, e deve ser: use a MSS correta |

## Onde a banca derruba

> [!pegadinha] "um cabeçalho chamado segmento"
> A alternativa A da questão do CNU 2024 (Q06 desta aula) diz que o UDP *"encapsula o dado
> na camada de transporte em um cabeçalho chamado segmento"*. São **dois** erros num
> pedaço de frase: segmento não é cabeçalho, é a PDU inteira; e a PDU do UDP não é segmento,
> é **datagrama**. A frase soa técnica e passa batida em leitura rápida. Regra: cabeçalho é
> a parte, PDU é o todo.

> [!pegadinha] Segmentar não é fragmentar
> As duas cortam blocos grandes em blocos menores, e por isso a banca as troca à vontade.
> **Segmentar é camada 4 e é normal; fragmentar é camada 3 e é excepcional.** Procure a
> palavra vizinha: se aparecer "MTU", "roteador" ou "deslocamento", é fragmentação; se
> aparecer "fluxo", "MSS" ou "número de sequência", é segmentação.

> [!pegadinha] "Cada camada acrescenta um cabeçalho e um rodapé"
> Falso, e é distrator recorrente. ==Só a camada 2 acrescenta algo no fim do bloco: o FCS.==
> Todas as demais acrescentam apenas na frente. Uma alternativa que generalize o rodapé
> para todas as camadas está errada por causa de uma palavra.

> [!pegadinha] Datagrama serve a dois donos
> "Datagrama IP" é camada 3; "datagrama" no transporte é UDP, camada 4. Quando o enunciado
> não qualificar, decida pelo contexto: se falar de porta ou de aplicação, é UDP; se falar
> de roteamento, endereço ou TTL, é IP.

> [!pegadinha] O MAC de destino não é o da máquina final
> Sempre que houver um roteador no caminho, o MAC de destino do primeiro quadro é o **do
> gateway**. O IP de destino é que é o final. Trocar os dois é o erro mais comum de quem
> aprendeu encapsulamento por desenho e não pelo mecanismo.

> [!pegadinha] Switch não desencapsula até a camada 3
> Ele lê o cabeçalho de camada 2 e para. O pacote IP passa por ele intocado, TTL incluído —
> e é por isso que um switch **não aparece** num `traceroute`, o comando que lista os saltos
> de um caminho justamente explorando o TTL. Só quem decrementa TTL é roteador.

> [!pegadinha] A palavra "encapsulamento" tem homônimo
> Em Programação, encapsulamento é um dos pilares da orientação a objetos, sem nenhuma
> relação com redes. No acervo do TecConcursos são 2.668 questões sob esse rótulo, contra
> as de redes, que estão espalhadas em "Modelo OSI" e "Arquitetura TCP/IP". Se você filtrar
> por "encapsulamento", vai cair no assunto errado.

## Questões

> [!nota] O que esperar desta seção
> **Nenhuma questão de TRANSPETRO 2018 ou 2023 tem o encapsulamento como assunto
> principal** — confirmei uma a uma nos dois índices. As duas primeiras são da TRANSPETRO e
> entram porque o encapsulamento é o que as resolve, mesmo sem ser o rótulo delas; a Q01
> você já viu em R01, e aqui ela é relida por outra ótica. Da Q03 à Q10 são oito questões
> **reais e recentes** do caderno CESGRANRIO, e é nelas que o assunto aparece com nome
> próprio. **São dez questões reais e nenhuma inédita:** passando de cinco questões da
> banca no assunto, questão escrita por mim entra como ruído — o molde verdadeiro já
> está representado o bastante.

### Q01 · TRANSPETRO 2018 · questão 41

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 41
> A mesma questão que abre R01, relida pela ótica desta aula: "camada mais alta em que o
> equipamento opera" é outro jeito de perguntar **até que cabeçalho ele desencapsula**.
> Resolve-se com a tabela da seção 7.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638681)

Uma grande empresa tem vários equipamentos de rede e servidores instalados em seu parque
computacional. Dentre esses equipamentos encontram-se:

(i) 1 roteador de saída para a internet; (ii) 3 Switches Ethernet compondo um backbone
interno de interligação da empresa; (iii) 10 Hubs (repetidores) usados para interconectar
estações terminais de usuários em várias redes locais; (iv) 1 servidor de correio
eletrônico; (v) 1 servidor de páginas WWW.

Do ponto de vista do modelo de referência OSI da ISO, os equipamentos descritos nos itens
(i) a (v), nessa ordem, têm funcionando, como camada mais alta de protocolo, os níveis

- [ ] 1, 2, 3, 6 e 7
- [ ] 3, 2, 1, 6 e 7
- [x] 3, 2, 1, 7 e 7
- [ ] 3, 2, 2, 6 e 7
- [ ] 4, 3, 2, 7 e 7

> [!gabarito]-
> **Gabarito: C.** Traduzindo cada item para "que cabeçalho ele abre": o roteador abre o
> cabeçalho IP (**3**), o switch para no cabeçalho Ethernet (**2**), o hub não abre nada e
> só repete bits (**1**), e os dois servidores leem a mensagem de aplicação até o fim
> (**7** e **7**).
>
> **A, B e D** oferecem **6** para o servidor de correio — a armadilha de achar que e-mail é
> "apresentação". SMTP é aplicação, camada 7, igual ao HTTP. **E** desloca tudo uma camada
> para cima. **D** põe hub em 2, confundindo repetidor com switch: hub não lê endereço
> nenhum, ele nem chega a montar um quadro.
>
> Tipo de distrator: **T4 (inversão de papel/ordem)** — as cinco alternativas são
> permutações dos mesmos números, e só uma sequência está certa.

### Q02 · TRANSPETRO 2018 · questão 45

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 45
> É a única questão da TRANSPETRO cujo gabarito depende de entender **o que a PDU do
> transporte faz e não faz**. O enunciado descreve, sem nomear, exatamente a propriedade
> que dá ao datagrama UDP o nome que ele tem: unidade independente, entregue ou perdida,
> sem retransmissão automática.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638689)

Uma aplicação foi desenvolvida por um programador que queria testar a taxa de perdas de sua
conexão com a Internet. Ele fez um programa que fica aleatoriamente transferindo pedaços de
um arquivo de um servidor remoto para o seu computador. Após um intervalo, caso o pedaço
identificado do arquivo não chegue, ele o considera perdido e o contabiliza na estatística
de "pedaços perdidos".

Para implementar essa aplicação, o programador precisou usar o serviço de um protocolo do
nível de transporte, que, pelas características dadas, foi o

- [x] UDP
- [ ] FTP
- [ ] TCP
- [ ] DNS
- [ ] HTTP

> [!gabarito]-
> **Gabarito: A.** Para **medir** perda, a perda precisa acontecer e aparecer. O TCP
> retransmite sozinho o que não for confirmado: com ele, o "pedaço" sempre acaba chegando e
> a estatística daria zero. O **UDP** entrega cada datagrama como unidade independente, sem
> ACK e sem retransmissão — a perda fica visível para a aplicação, que é o que o programa
> quer. É a razão de a PDU do UDP se chamar *datagrama* (seção 4).
>
> **C, TCP** é o distrator forte, e é onde cai quem lê "confiável = melhor" em vez de ler o
> que o programa precisa. Tipo **T2 (irmão taxonômico)**: TCP é o vizinho legítimo do UDP na
> camada 4, e o discriminante está escondido em "considera perdido".
>
> **B (FTP), D (DNS) e E (HTTP)** são protocolos de **aplicação**, camada 7, e o enunciado
> diz "nível de transporte". Também **T2**, com a camada errada. Repare que o DNS *usa* UDP
> — mas ele não é o protocolo de transporte, é cliente dele.

### Q03 · CESGRANRIO · BNDES 2024

> [!fonte] Fonte: prova BNDES 2024, Análise de Sistemas – Suporte — do seu caderno CESGRANRIO
> **A questão mais importante desta aula.** O enunciado narra a cadeia de encapsulamento
> inteira em uma frase — "segmentá-los… à camada de rede, que transforma esses segmentos em
> pacotes" — e o gabarito depende só de saber de quem é cada verbo. Se você entender esta,
> entendeu a seção 4.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3117658)

O modelo Open Systems Interconnection (OSI) é um modelo de referência criado pela
International Organization for Standardization (ISO) que permite a comunicação entre
máquinas heterogêneas e define diretivas genéricas para a construção de redes de
computadores independente da tecnologia utilizada. Esse modelo é dividido em camadas
hierárquicas, e cada camada usa as funções da própria camada ou da camada anterior. Qual é
a camada responsável por receber os dados enviados pela camada de sessão e segmentá-los
para que sejam enviados à camada de rede, que, por sua vez, transforma esses segmentos em
pacotes?

- [ ] Camada de aplicação
- [ ] Camada de apresentação
- [ ] Camada de enlace
- [ ] Camada física
- [x] Camada de transporte

> [!gabarito]-
> **Gabarito: E.** Três marcas apontam para a mesma camada, e qualquer uma bastaria:
> *"recebe os dados enviados pela camada de sessão"* (quem está logo abaixo da 5 é a 4),
> *"segmentá-los"* (segmentar é verbo da camada 4, seção 9) e *"enviados à camada de rede"*
> (quem entrega para a 3 é a 4). O enunciado ainda confirma a cadeia de PDUs: os segmentos
> viram **pacotes** ao receberem o cabeçalho IP.
>
> **A e B** são as camadas **acima** da sessão, não abaixo — quem lê rápido e vê "camada de
> sessão" pode subir em vez de descer. **C e D** são as duas camadas abaixo da de rede, o
> outro lado da cadeia: enlace transforma pacote em **quadro**, física transforma quadro em
> **bits**. Nenhuma das duas segmenta coisa alguma.
>
> Tipo de distrator: **T4 (inversão de direção)** em A e B; **T2 (irmão taxonômico)** em C e
> D, que oferecem camadas reais da mesma cadeia, uma casa adiante. Vale decorar a sequência
> inteira que o enunciado desenha:
> ==dados → segmentos → pacotes → quadros → bits.==

### Q04 · CESGRANRIO · UNEMAT 2024 (Analista de Sistemas)

> [!fonte] Fonte: prova UNEMAT 2024, Analista de Sistemas — do seu caderno CESGRANRIO
> O verbo da camada 2 dito com todas as letras: *"dividindo o fluxo de bits recebidos em
> frames"*. É o enunciado que fixa o enquadramento, e ele vem colado a uma segunda marca
> — "entre dois sistemas de uma mesma rede" — que reforça o alcance de um salto.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2838603)

O Modelo de Referência OSI/ISO propõe uma pilha de protocolos em várias camadas, em que as
camadas mais baixas, mais próximas ao hardware, prestam serviços específicos para as
camadas mais altas, mais próximas ao usuário.

A camada OSI responsável por entregar um pacote entre dois sistemas de uma mesma rede,
dividindo o fluxo de bits recebidos em frames, é a

- [x] de enlace
- [ ] de rede
- [ ] de sessão
- [ ] de transporte
- [ ] física

> [!gabarito]-
> **Gabarito: A.** *"Dividindo o fluxo de bits recebidos em frames"* é a definição de
> **enquadramento**, e frame é a PDU da camada 2. A segunda marca confirma: *"entre dois
> sistemas de uma mesma rede"* é o alcance de um salto, que é o da camada 2 (seção 8).
>
> **B, de rede,** é o distrator mais forte, porque o enunciado usa a palavra "pacote" — e
> pacote é PDU da 3. Mas leia a frase inteira: a camada descrita **recebe** o pacote e o
> transforma em frames; quem faz isso é a de baixo. É o mesmo raciocínio da Q03, invertido.
> **E, física,** pega quem se agarra em "fluxo de bits": a camada 1 *transmite* o fluxo, a
> camada 2 é que o *divide*. **C e D** estão acima e não têm relação com bits nem com frames.
>
> Tipos de distrator: **T2 (irmão taxonômico)** em B e E, as duas vizinhas imediatas, cada
> uma emprestando uma palavra do enunciado; **T3** de fundo em C e D, camadas reais sem
> nenhuma das funções descritas.

### Q05 · CESGRANRIO · UNEMAT 2024 (Técnico em Informática)

> [!fonte] Fonte: prova UNEMAT 2024, Técnico em Informática — do seu caderno CESGRANRIO
> A pergunta mais curta possível sobre a pilha, e a que mais rende: saber de que camada é
> cada protocolo é saber de que camada é cada **cabeçalho**. Dois segundos de questão, se a
> tabela da seção 4 estiver na cabeça.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2837989)

No contexto de redes de computadores, o modelo OSI é utilizado para representar as
diferentes camadas sucessivas responsáveis pelo tráfego de mensagens entre computadores.
Dentre os diversos protocolos de comunicação disponíveis, o mais famoso é o TCP/IP,
amplamente usado na internet.

A quais camadas do modelo OSI correspondem os protocolos TCP e IP, respectivamente?

- [ ] rede e física
- [ ] enlace e rede
- [x] transporte e rede
- [ ] transporte e enlace
- [ ] aplicação e transporte

> [!gabarito]-
> **Gabarito: C.** TCP = camada **4**, transporte, cabeçalho de 20 bytes com as portas.
> IP = camada **3**, rede, cabeçalho de 20 bytes com os endereços. É a ordem em que os dois
> cabeçalhos são acrescentados na descida: primeiro o TCP, depois o IP por cima.
>
> As quatro erradas são **deslocamentos de um degrau** na pilha, para cima ou para baixo:
> **A** e **B** descem os dois protocolos, **D** desce só o IP, **E** sobe os dois. Repare
> que a banca não precisa inventar nada — todas as camadas oferecidas existem, e todas são
> vizinhas das certas.
>
> Tipo de distrator: **T4 (inversão de ordem)**, com **T2** por baixo. O `perfil-da-banca`
> registra este exato molde ("os protocolos X e Y são, respectivamente") como um dos
> preferidos da CESGRANRIO em redes.

### Q06 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: prova CNU 2024, Bloco 2 — Tecnologia, Dados e Informação — do seu caderno CESGRANRIO
> **A questão que justifica esta aula existir.** O distrator A é um erro de encapsulamento
> plantado com precisão — chama a PDU de cabeçalho e ainda troca o nome dela. Se você não
> souber a diferença entre PDU e PCI (seção 3), essa alternativa parece impecável.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3038226)

Um dos desafios enfrentados por projetistas de redes de computadores é decidir entre os
protocolos Transmission Control Protocol (TCP) e User Datagram Protocol (UDP) para
diferentes aplicações e cenários de rede. A escolha envolve considerar cuidadosamente a
natureza das transmissões de dados necessárias para cada aplicação. A seleção entre TCP e
UDP exige uma análise minuciosa das exigências específicas da aplicação e das
características da rede, garantindo uma escolha alinhada com os requisitos de desempenho e
confiabilidade da infraestrutura de rede.

No processo decisório, o projetista deve considerar que o protocolo UDP

- [ ] encapsula, no modelo Internet, o dado na camada de transporte em um cabeçalho chamado segmento.
- [ ] garante, na transmissão, a entrega e a sequência de dados, com o suporte da camada de sessão.
- [ ] implementa a conexão lógica ligando as aplicações no modo full-duplex, com reconhecimento ACK e NAK.
- [ ] localiza-se, por ser mais simples, na camada de rede, enquanto o TCP, na camada de transporte.
- [x] revela-se um serviço não orientado a conexão, sem que haja uma vinculação lógica entre origem e destino.

> [!gabarito]-
> **Gabarito: E.** É a definição canônica do UDP: sem conexão, sem estado compartilhado
> entre as pontas, cada datagrama independente dos demais.
>
> **A** é a alternativa desta aula, e erra **duas vezes na mesma frase**: primeiro, o
> resultado do encapsulamento não é "um cabeçalho", é a **PDU** — o cabeçalho é só a parte
> que a camada acrescenta (seção 3); segundo, a PDU do UDP é **datagrama**, não segmento
> (seção 4). Tipo **T4**, troca do nome da unidade entre os dois protocolos da mesma camada.
>
> **B** atribui ao UDP a garantia de entrega e ordenação, que é do TCP, e ainda inventa um
> "suporte da camada de sessão" que não existe na pilha da internet — **T3** com um enxerto
> de **T1**. **C** descreve conexão lógica com `ACK` e `NAK`: é o retrato do TCP, e o `NAK`
> nem sequer é mecanismo do TCP, que usa ACK cumulativo. **D** rebaixa o UDP para a camada
> de rede, o clássico **T2** de camada vizinha; UDP e TCP estão **os dois** na camada 4, e é
> por isso que ambos carregam portas.

### Q07 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: prova CNU 2024, Bloco 2 — Tecnologia, Dados e Informação — do seu caderno CESGRANRIO
> Cobra o conteúdo de um campo específico do cabeçalho TCP: os bits de controle. É o
> exemplo mais direto de "o cabeçalho é o canal pelo qual as camadas pares conversam"
> (seção 3) — o handshake inteiro acontece dentro de 6 bits.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3038232)

Para estabelecer uma conexão, o Transmission Control Protocol (TCP) usa um handshake de
três vias. Esse handshake é necessário e suficiente para o sincronismo correto entre as
duas extremidades da conexão. Em cada um dos segmentos transmitidos durante o handshake, o
campo de bits de código do cabeçalho TCP é devidamente preenchido.

No primeiro segmento, o(s)

- [ ] bit SYN é marcado; no segundo, o bit ACK é marcado; e, no terceiro, o bit FIN é marcado.
- [x] bit SYN é marcado; no segundo, os bits SYN e ACK são marcados; e, no terceiro, o bit ACK é marcado.
- [ ] bit SYN é marcado; no segundo, os bits SYN e ACK são marcados; e, no terceiro, os bits ACK e FIN são marcados.
- [ ] bits SYN e ACK são marcados; no segundo, os bits SYN e ACK também são marcados; e, no terceiro, o bit FIN é marcado.
- [ ] bits SYN e ACK são marcados; no segundo, os bits SYN e ACK também são marcados; e, no terceiro, os bits SYN, ACK e FIN são marcados.

> [!gabarito]-
> **Gabarito: B.** A sequência é `SYN` → `SYN+ACK` → `ACK` (seção 4). O primeiro segmento
> pede sincronismo; o segundo pede sincronismo **e** confirma o primeiro, por isso leva os
> dois bits; o terceiro só confirma. Os três são segmentos de **zero byte de dados** — e
> mesmo assim ocupam 64 bytes no cabo cada um, por causa do preenchimento do Ethernet.
>
> **A** troca o segundo passo por `ACK` sozinho: sem o `SYN` de volta, o servidor nunca
> sincroniza o número de sequência dele, e a conexão não abre. **C, D e E** enfiam o `FIN`
> no handshake de abertura — `FIN` é o bit de **encerramento**, e ele nunca aparece na
> abertura. **D** e **E** ainda marcam `ACK` no primeiro segmento, quando não há nada a
> confirmar ainda.
>
> Tipo de distrator: **T4 (inversão de ordem)** — as cinco são combinações das mesmas três
> flags nas mesmas três etapas. O `perfil-da-banca-CESGRANRIO-TI.md` §3 cita esta questão
> como exemplo do tipo.
> ==Se o FIN aparecer numa alternativa sobre abertura de conexão, ela está errada.==

### Q08 · CESGRANRIO · AgeRIO 2023

> [!fonte] Fonte: prova AgeRIO 2023, Tecnologia da Informação — do seu caderno CESGRANRIO
> A única questão do caderno que pergunta o que acontece **no instante em que o quadro é
> montado**: para preencher o campo de MAC de destino, é preciso descobrir esse MAC. Sem
> ARP, o encapsulamento da camada 2 trava.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2462907)

Cada host recebe pelo menos um endereço lógico de 32 bits (endereço IPv4) para operar na
rede TCP/IP. No momento da transmissão física dos dados, é necessário fazer a tradução do
endereço IPv4 no respectivo endereço físico da interface de rede.

Para descobrir o endereço físico da interface de rede do host destino, o host de origem
pode usar o

- [ ] UDP
- [x] ARP
- [ ] ICMP
- [ ] IGMP
- [ ] TCP

> [!gabarito]-
> **Gabarito: B.** **ARP** (*Address Resolution Protocol*, protocolo de resolução de
> endereços) traduz IP em MAC. Ele é chamado exatamente no momento descrito: a camada 3 já
> montou o pacote e entrega à camada 2, que precisa preencher 6 bytes de MAC de destino e
> não os tem. O ARP pergunta em broadcast *"quem tem 10.20.30.1?"* e a resposta preenche o
> campo (seção 8 — no nosso exemplo, o MAC obtido é o do **gateway**, não o do servidor).
>
> **C, ICMP** é o distrator mais forte: também é protocolo auxiliar da camada 3, também
> serve para "descobrir coisas na rede" — mas descobre alcançabilidade e erro, não endereço
> físico. **D, IGMP** administra grupos de multicast. **A, UDP** e **E, TCP** são camada 4:
> não sabem o que é MAC, e no momento descrito o segmento deles já está lá dentro, embrulhado.
>
> Tipo de distrator: **T2 (irmão taxonômico)** em todas as quatro — cinco siglas reais da
> pilha TCP/IP, com o discriminante em "endereço físico". É o molde de "cinco siglas
> concorrentes", que na TRANSPETRO aparece em 13,1% das questões contra 5,5% nos demais
> órgãos.

### Q09 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: prova CNU 2024, Bloco 2 — Tecnologia, Dados e Informação — do seu caderno CESGRANRIO
> Entra nesta aula pelos **distratores**, não pelo gabarito: `Stuffing` e `Check Sequence`
> são dois mecanismos de enquadramento oferecidos como se fossem tipos de estação. Quem
> leu a seção 10 elimina os dois de imediato.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3038228)

Um programador de softwares de rede está trabalhando num aplicativo que manipula um
protocolo que opera na camada de enlace, o High-Level Data Link Control (HDLC). No HDLC,
existe um tipo de estação que opera sob o controle de outra estação, respondendo a
requisições, e que não tem capacidade ou responsabilidade direta para controlar o link de
dados.

Esse tipo de estação é a

- [ ] Stuffing
- [ ] Primária
- [x] Secundária
- [ ] Desbalanceada
- [ ] Check Sequence

> [!gabarito]-
> **Gabarito: C.** O HDLC define três tipos de estação: **primária** (controla o enlace e
> emite comandos), **secundária** (opera sob controle da primária e emite respostas) e
> **combinada** (faz as duas coisas). O enunciado descreve a secundária palavra por palavra:
> *"opera sob o controle de outra"*, *"respondendo a requisições"*, *"não tem
> responsabilidade de controlar o link"*.
>
> **B, Primária,** é o par exato: mesmo vocabulário, papel invertido — **T4**. **D,
> Desbalanceada,** empresta um termo real do HDLC, mas que classifica a **configuração** do
> enlace (balanceada × desbalanceada), não a estação — **T2**.
>
> **A e E são os que importam para esta aula.** *Stuffing* é o **enchimento de bits**, o
> mecanismo que impede que os dados imitem a flag `01111110` de delimitação do quadro
> (seção 10). *Check Sequence* é a **FCS**, o CRC-32 no fim do quadro (seção 4). São dois
> conceitos verdadeiros do HDLC, arrancados da função deles e vendidos como tipo de
> estação — **T3**, definição real do conceito errado, na variante mais desonesta: o termo
> existe, é do mesmo protocolo, e só não é isso.

### Q10 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: prova IPEA 2024, Infraestrutura de Tecnologia da Informação — do seu caderno CESGRANRIO
> A questão mais difícil da aula, e a que só se responde pensando em **profundidade de
> desencapsulamento**: para descobrir que a porta não está alocada, o datagrama teve de ser
> aberto até a camada 4 — o que só acontece no destino final.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2780844)

Na arquitetura TCP/IP, a camada de rede pode informar sobre erros de transmissão de dados.
Considere que um datagrama foi enviado para um destino no qual a porta do serviço não se
encontra alocada. Nesse caso, uma mensagem ICMP (Internet Control Message Protocol) do tipo
3 (Destination Unreachable) e código 3 (Port Unreachable) será preparada e enviada para a
origem do datagrama.

Esse preparo e envio para a origem do datagrama é feito pela camada de rede do

- [ ] gateway de entrada da rede do destinatário do datagrama
- [ ] gateway de saída da rede do remetente do datagrama
- [ ] gateway da borda da rede do provedor do destinatário do datagrama
- [ ] gateway da borda da rede do provedor do remetente do datagrama
- [x] próprio destinatário do datagrama

> [!gabarito]-
> **Gabarito: E.** Raciocine pela profundidade de desencapsulamento (seção 7). "Porta não
> alocada" é uma informação de **camada 4**: só sabe disso quem abriu o cabeçalho de
> transporte e consultou a lista de portas em uso na própria máquina.
> ==Roteador e gateway param na camada 3 e não olham porta nenhuma.==
> Logo, o único equipamento do caminho capaz de detectar esse erro é o **host de destino**. Ele detecta na camada 4 e responde pela
> camada 3 — daí a mensagem ser ICMP, que é camada 3.
>
> **A, B, C e D** oferecem quatro gateways diferentes, todos plausíveis se você raciocinar
> "ICMP é camada de rede, logo quem emite é um roteador". A frase *"a camada de rede pode
> informar sobre erros"*, no enunciado, existe para reforçar essa leitura. Mas ICMP ser
> camada 3 diz de que **camada** a mensagem é, não de que **máquina** ela sai.
>
> Tipo de distrator: **T2 (irmão taxonômico)** nas quatro — todos são equipamentos reais e
> do caminho certo, e o discriminante está na palavra "porta". Compare com a Q08: nas duas,
> o gabarito sai de perguntar *até que cabeçalho aquele elemento consegue enxergar*.

## Figuras pendentes

**Nenhuma.** Todas as questões desta aula têm `alt_em_imagem = N` nos índices de 2018 e no
caderno CESGRANRIO — conferi uma a uma. As alternativas saíram inteiras em texto e não há
nada para recortar de PDF.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Modelos de Referência de Redes` › **`Modelo OSI`** |
| Hierarquia | `03.01` |
| Questões no acervo | 2.106 (667 comentadas) |
| No seu caderno CESGRANRIO | 7 |

Marque também a banca **CESGRANRIO**. É o mesmo filtro de R01, e de propósito: no acervo do
site o encapsulamento não tem assunto próprio — ele mora dentro de "Modelo OSI" e de
"Arquitetura TCP/IP".
==Nunca filtre por "encapsulamento": esse rótulo, no TecConcursos, é o de orientação a objetos.==

**Complementos, para o resto da semana**

| Assunto | Hierarquia | Questões | Por quê |
|---|---|---:|---|
| `Modelos de Referência de Redes` › **`Arquitetura TCP/IP`** | `03.02` | 1.560 | Onde ficam as questões de PDU cobradas pelo vocabulário da internet, e não do OSI |
| `Principais Protocolos de Redes` › **`TCP e UDP`** | `07.03` | 1.495 | Segmento × datagrama, portas e cabeçalho de 20 × 8 bytes |
| `Principais Protocolos de Redes` › `Protocolo IP` › **`Conceitos e Especificações do IP`** | `07.02.01` | 1.066 | Campos do cabeçalho IPv4, TTL, MTU e fragmentação |
| `Modelos de Referência de Redes` › **`Endereço MAC e Subcamadas`** | `03.03` | 140 | O cabeçalho de camada 2 e as duas subcamadas dela: LLC (controle lógico do enlace) e MAC (controle de acesso ao meio) |
| `Comunicação e Transmissão de Dados` › **`Algoritmos de Codificação e de Detecção de Erros (Redes)`** | `04.03` | 163 | O FCS, o CRC e o enquadramento da seção 10 |
| `Principais Protocolos de Redes` › **`ARP e RARP`** | `07.10` | 275 | O passo que preenche o MAC de destino do quadro (Q08) |

> [!nota]
> Os nomes acima vêm da árvore real em `dados/assuntos-tec.json`. Navegue por eles no site:
> **Questões → Filtrar por matéria → TI - Redes de Computadores** e abra a hierarquia
> indicada. Para achar o assunto de qualquer outra aula:
> `python ferramentas/assuntos.py <palavra-chave>`

> [!checklist]
> - **PDU = cabeçalho (PCI) + carga (SDU).** A PDU de cima é a SDU de baixo.
> - Nomes, de baixo para cima: **bit → quadro → pacote → segmento (TCP) ou datagrama (UDP)**.
> - Cabeçalhos, em bytes: Ethernet **14 + 4 de FCS**, IP **20**, TCP **20**, UDP **8**.
> - **Só a camada 2 põe algo no fim** do bloco. As outras só na frente.
> - Quem aponta para cima na subida: **EtherType → Protocolo → porta de destino**.
> - **Segmentar é da 4** (limite MSS = 1460); **fragmentar é da 3** (limite MTU = 1500).
> - Fragmento: cabeçalho IP replicado, deslocamento em blocos de **8 bytes**, remonta o destino.
> - A cada salto muda o **MAC** e o **TTL**; **IP e porta** não mudam nunca.
