---
resumo_de: R01
titulo: Modelo OSI: as sete camadas (versão resumida)
resumo: A mesma aula dentro dos 45 min da fatia: as sete camadas com o mecanismo de cada uma, a tabela que traduz a palavra do enunciado em camada, e as pegadinhas que decidem gabarito.
tempo: 45 min
---

> [!nota] Esta é a versão resumida — a que cabe no dia
> Lida de uma vez, a completa pede **105 min**; esta pede **45**, que é exatamente a fatia de
> R01 no calendário: 32 min de teoria, 8 de conferência, 5 de checklist. Nada que decide
> gabarito ficou de fora. O vocabulário da banca, que na completa aparece camada por camada,
> aqui está reunido de uma vez na tabela do §4.
>
> **Ficou só na completa:** as analogias com o limite declarado, os exemplos longos que
> ancoram a memória, e **8 das 10 questões**.
>
> **Leia a completa na primeira vez** — é ela que faz o conceito grudar. Volte a esta no
> aquecimento, nas revisões e na véspera. Alterne no botão **completa | resumida** do topo.

> [!banca]
> **Item 1.1e do edital 2026.** Cobrança **conceitual e de associação**: dado um
> equipamento, um protocolo ou uma função, dizer em que camada ele está. Nunca pede
> implementação nem cálculo.
>
> **Caiu 3 vezes em 2018** (Q41, Q42, Q43) e **1 em 2023** na nossa ênfase (Q48) — o item de
> redes mais recorrente do histórico. Os distratores são quase sempre **T2** (outra camada,
> que existe) e **T3** (a definição *correta* da camada *errada*).

---

## 1 · O problema, e o vocabulário do modelo

Nos anos 1970 cada fabricante tinha sua arquitetura fechada e elas não se falavam. O
problema técnico por trás é o que interessa: **um programa único que fizesse tudo seria
impossível de manter** — trocar coaxial por fibra obrigaria a reescrever o programa de
correio eletrônico. Em 1984 a **ISO** publicou a **ISO/IEC 7498**, o **modelo de referência
OSI** (*Open Systems Interconnection*): sete camadas independentes, e a independência é a
propriedade que importa.

Três palavras que a banca usa: **serviço** é o que a camada N oferece à N+1, logo acima
dela; **protocolo** é o combinado entre a camada N de um lado e **a camada N do outro lado**
(as **camadas pares**, *peer layers*); **interface** é como a camada de cima chama a de
baixo dentro da mesma máquina.

> [!decore]
> De baixo para cima: *Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação*.
> **"Fernando Escreveu Rápido Três Sonetos Para Ana"**. A contagem oficial é **sempre de
> baixo para cima**: a 1ª é Física, a 3ª é Rede, a 7ª é Aplicação.

**O cenário desta aula.** Você digita `http://www.transpetro.com.br` num notebook da rede da
TRANSPETRO. Notebook: IP `10.20.30.40/24`, MAC `A4:BB:6D:11:22:33`. Gateway: `10.20.30.1`,
MAC `00:1A:2B:3C:4D:5E`. Servidor: `200.150.10.80`, porta `80`. Porta de origem: `51344`.

## 2 · As sete camadas

### Camada 1 · Física

**Resolve:** o cabo só conduz tensão — alguém tem que decidir que tensão é 1, que tensão é 0
e por quanto tempo cada uma fica no fio.

**Mecanismo:** define as características **mecânicas** (o conector RJ-45), **elétricas**
(níveis de tensão), **funcionais** (o que cada pino faz) e **de procedimento**, mais a
**codificação de linha** — no 10Base-T, o *Manchester*, em que o bit é uma *transição* no
meio do intervalo, para os relógios dos dois lados não se perderem. Vê um **fluxo de bits
não estruturado**: não sabe o que é byte nem onde um bloco começa.

**PDU** (*Protocol Data Unit*, a unidade de dado da camada): o **bit**. **Equipamentos:**
cabo, conector, repetidor, **hub**.

**Não confunda com** a 2: a física *transmite* bits, a 2 os *agrupa*.

### Camada 2 · Enlace de dados

**Resolve:** o meio é compartilhado (dois falando ao mesmo tempo se somam e nada chega) e
ruidoso; e a camada 1 entrega fluxo contínuo, sem dizer onde uma mensagem acaba.

**Mecanismo — quatro peças:**

1. **Enquadramento** — agrupa os bits em blocos delimitados, os **quadros** (*frames*).
2. **Endereçamento físico** — o **MAC** (*Media Access Control*), 48 bits gravados de
   fábrica. É endereço **plano**: sem hierarquia, não dá para deduzir dele onde a máquina
   está.
3. **Detecção de erro** — o **FCS** (*Frame Check Sequence*), 4 bytes de **CRC-32** no
   **fim** do quadro. O receptor recalcula e, se não bater,
   ==descarta o quadro: enlace detecta, não conserta==, e nem avisa a origem — quem percebe
   a falta é a camada 4.
4. **Controle de acesso ao meio** — no Ethernet clássico, o **CSMA/CD**.

Duas subcamadas, que aparecem como alternativa: **LLC** (IEEE 802.2, interface com a camada
3) e **MAC** (IEEE 802.3, acesso ao meio).

**PDU:** o **quadro**. **Equipamentos:** **switch**, bridge, placa de rede. **Protocolos:**
Ethernet, PPP, HDLC, **ARP**. **Alcance: um salto** — só enxerga **dois nós adjacentes**.

**No cenário:** o quadro sai com MAC de destino `00:1A:2B:3C:4D:5E`, **o do roteador, não o
do servidor**. Para descobrir esse MAC, o notebook pergunta em broadcast *"quem tem
10.20.30.1?"* — isso é **ARP** (*Address Resolution Protocol*), que traduz IP em MAC e por
isso *parece* camada 3, mas ==em prova a resposta esperada para o ARP é camada 2==.

**Não confunda com** a 4: as duas fazem controle de erro e de fluxo, a 2 **entre vizinhos**
e a 4 **de ponta a ponta**. Foi o que decidiu a Q48 de 2023.

### Camada 3 · Rede

**Resolve:** o MAC não escala. Sendo plano, entregar por MAC exigiria de cada roteador uma
tabela com todas as placas do planeta. Falta um endereço que diga **onde** a máquina está,
não só **quem** ela é.

**Mecanismo:** o **IP** é **hierárquico** — `10.20.30.40/24` separa a parte de rede
(`10.20.30`) da de host (`.40`), e o roteador guarda uma linha para a rede inteira em vez de
uma por máquina. Com isso ela faz **roteamento**: escolhe o **próximo salto** pela rota mais
específica que casa com o destino (*longest prefix match*). O **TTL** (*Time To Live*) cai de
1 a cada roteador e o pacote morre em zero, o que impede que ele circule para sempre num
laço. Também **fragmenta** quando o pacote é maior do que o próximo enlace aceita.

**PDU:** o **pacote**. **Equipamento:** **roteador**. **Protocolos:** IP, **ICMP** (controle
e erro, é o que o `ping` usa), OSPF, RIP, BGP. **Alcance:** é a **primeira camada que enxerga
o destino final**, mas decide salto a salto e não guarda estado entre pacotes.

**No cenário:** o pacote sai com origem `10.20.30.40` e destino `200.150.10.80`.
==Esses dois endereços não mudam na viagem inteira; o par de MACs muda a cada trecho.==

**Não confunda com** a 4: a 3 entrega ao *computador*, a 4 entrega ao *programa* dentro
dele.

### Camada 4 · Transporte

**Resolve:** dois buracos que a 3 deixa. O IP entrega ao computador, mas ele roda navegador,
e-mail e Teams ao mesmo tempo — para qual deles vai este pacote? E o IP é *melhor esforço*:
perde, duplica, entrega fora de ordem e não avisa ninguém.

**Mecanismo:** a **porta**, número de **16 bits** (0 a 65.535) que identifica o processo
(IP + porta é o **socket**; 80 HTTP, 443 HTTPS, 22 SSH, 25 SMTP, 53 DNS); a **segmentação**,
que
corta o fluxo de cima em pedaços do tamanho que a rede aguenta; e, **só no TCP**, a
**confiabilidade** (cada byte numerado, o receptor confirma com **ACK**, o não confirmado é
retransmitido, e a numeração serve para reordenar e descartar duplicata), o **controle de
fluxo** por **janela deslizante** (o receptor anuncia quantos bytes ainda cabem no buffer
dele) e o **handshake de três vias**: `SYN` → `SYN+ACK` → `ACK`.

| | **TCP** | **UDP** |
|---|---|---|
| Conexão | orientado à conexão (handshake) | sem conexão |
| Confiabilidade | confirma, retransmite, reordena | não confirma nada |
| Controle de fluxo | sim (janela deslizante) | não |
| Cabeçalho | 20 bytes | **8 bytes** |
| PDU | **segmento** | **datagrama** |
| Usa quem | HTTP, SMTP, FTP, SSH | DNS, DHCP, VoIP, streaming |

**No cenário:** o segmento sai com porta de origem `51344` e destino `80`. Na volta, é a
51344 que diz ao sistema que aquilo é do navegador, e não do cliente de e-mail.

==Se aparecer "ponta a ponta" ou "extremidades" num enunciado de OSI, é transporte.==

### Camada 5 · Sessão

> [!nota]
> Menor uso prático, **maior risco em prova**: é a camada mais oferecida como alternativa
> errada, e a CESGRANRIO já a cobrou direto, com o vocabulário exato (BANESE 2025).

**Resolve:** o TCP entrega bytes, mas não resolve *conversa*. Se um arquivo de 2 GB cai aos
1,9 GB, para o TCP aquela conexão simplesmente acabou e você recomeça do byte zero.

**Mecanismo — três funções canônicas, e são estas três palavras que a banca usa:**

1. **Controle de diálogo** — decide de quem é a vez de transmitir: *simplex*, *half-duplex*
   (revezam) ou *full-duplex* (os dois ao mesmo tempo).
2. **Gerenciamento de token** — em operações que os dois lados não podem executar ao mesmo
   tempo, circula um **token**, um bastão de fala; a 5 cria, entrega, recolhe e **recria se
   ele se perder**.
3. **Sincronização** — insere **pontos de sincronização** (*checkpoints*) numerados no
   fluxo, e a transmissão que cai recomeça **do último checkpoint**: com um a cada 100 MB,
   aquele arquivo de 2 GB volta 100 MB, e não 1,9 GB.

**PDU:** dados (5, 6 e 7 não têm PDU com nome próprio). **Protocolos citados em prova:**
NetBIOS, **RPC**, PPTP, as sessões do NFS.

**Não confunda com** a 4: ==conexão TCP não é sessão== — a conexão é um canal de bytes, a
sessão é o diálogo, que sobrevive à queda do canal e é retomado do checkpoint.

### Camada 6 · Apresentação

**Resolve:** duas máquinas representam **o mesmo dado** de formas diferentes, e o byte chega
intacto e ainda assim é lido errado. O inteiro `1` em 32 bits é `00 00 00 01` em máquina
*big-endian* e `01 00 00 00` em *little-endian*, e o outro lado lê `16.777.216`; a letra `A`
é `0x41` em **ASCII** e `0xC1` em **EBCDIC**, dos mainframes IBM.

**Mecanismo:** separa **sintaxe abstrata** (a estrutura lógica do dado) de **sintaxe de
transferência** (a forma com que ele viaja), e cada lado converte da sua representação local
para a combinada — o exemplo canônico da ISO é o **ASN.1** com as regras **BER**, que o SNMP
usa até hoje. Além da conversão, as duas funções que mais caem: **compressão** (JPEG, GIF,
MPEG) e **criptografia** — ==no modelo OSI, cifrar é camada 6==.

**Não confunda com** a 7 (distrator natural) nem com a 5 (a alternativa mais oferecida).

### Camada 7 · Aplicação

**Resolve:** não adianta a mensagem chegar íntegra se o servidor não sabe que `GET` significa
"me mande este arquivo". Os dois programas precisam de vocabulário comum.

**Mecanismo:** é onde moram os **protocolos de aplicação**, que definem comandos e respostas
— **HTTP** (`GET`, `200 OK`, `404`), **SMTP** (`HELO`, `MAIL FROM`, `DATA`), **FTP**,
**DNS**, **SNMP**, **DHCP**, **Telnet**, **SSH**.
==Atenção: o programa não é a camada 7; o protocolo que ele fala é.== O navegador é um
programa, o HTTP é a camada 7.

**Não confunda com** a 6, e guarde o caso que já caiu: **servidor de e-mail e servidor web
estão os dois na camada 7** — a tentação é pôr o de e-mail na 6, porque "apresentação" soa
como formatar mensagem, mas SMTP é aplicação.

## 3 · Encapsulamento, com os números do cenário

Descendo, cada camada acrescenta **o seu cabeçalho** ao que veio de cima e trata tudo como
carga; subindo, cada uma retira o seu e entrega o resto. O conteúdo é o mesmo — muda quanto
cabeçalho está grudado nele, e daí o nome da unidade mudar a cada nível.

```
camada 7   [ GET / HTTP/1.1 ... ]                          120 bytes   "dados"
camada 4   [ TCP 20B | dados ]                             140 bytes   SEGMENTO
              porta origem 51344, porta destino 80
camada 3   [ IP 20B | TCP | dados ]                        160 bytes   PACOTE
              origem 10.20.30.40, destino 200.150.10.80, TTL 64
camada 2   [ ETH 14B | IP | TCP | dados | FCS 4B ]         178 bytes   QUADRO
              MAC destino 00:1A:2B:3C:4D:5E  (o do roteador)
camada 1   1010001101011100...                           1.424 bits    BITS
```

> [!decore]
> A PDU de baixo para cima: **bit → quadro → pacote → segmento**. Já valeu questão inteira.
> Da 5 para cima, chama-se só "dados".

Três detalhes que rendem alternativa: **só a camada 2 põe informação no fim** do bloco, o
FCS; **o quadro é refeito a cada salto**, com MACs diferentes, enquanto o pacote IP segue
igual, só com o TTL decrementado; e **UDP também é chamado datagrama** — se a alternativa
disser "datagrama" para a camada 4, ela está falando de UDP.

## 4 · Palavra do enunciado → camada

A tabela que resolve a maioria das questões. O enunciado da CESGRANRIO descreve a camada
corretamente e **nunca a nomeia** — o que decide o gabarito é uma expressão só.

| Se o enunciado disser | É a camada | Não confunda com |
|---|---|---|
| "fluxo de bits não estruturado", "meio físico", "mecânicas, elétricas, funcionais e de procedimento" | **1 · Física** | enlace |
| "divide o fluxo de bits em frames", "endereço físico", "entre nós adjacentes", "acesso ao meio" | **2 · Enlace** | física, rede |
| "controla a operação da sub-rede", "roteados da origem até o destino", "endereçamento lógico" | **3 · Rede** | enlace, transporte |
| "fim a fim", "ponta a ponta", "entre as extremidades", "orientado à conexão", "segmenta os dados" | **4 · Transporte** | enlace (mesmas funções, outro escopo) |
| "controle de diálogo", "gerenciamento de token", "controle de sincronização", "retomada" | **5 · Sessão** | transporte |
| "sintaxe e semântica", "diferentes representações de dados", "compressão", "criptografia" | **6 · Apresentação** | sessão, aplicação |
| nome de protocolo (HTTP, SMTP, FTP, DNS), "aplicativos de alto nível" | **7 · Aplicação** | apresentação |

## 5 · Equipamento, e o mapeamento com o TCP/IP

O equipamento opera até a camada em que **toma decisão**: ele mexe nos bits de todas as de
baixo, mas a camada dele é a do critério que usa para decidir. "Switch layer 3" existe — é
switch com roteamento embutido, e o enunciado que usa esse termo descreve a exceção de
propósito; switch sem qualificação é **camada 2**.

| Equipamento | Camada mais alta | Decide com base em |
|---|---|---|
| Cabo, conector, repetidor, **hub** | **1** | nada — só repete o sinal em todas as portas |
| **Switch**, bridge | **2** | endereço MAC |
| **Roteador** | **3** | endereço IP |
| Firewall de estado | **4** | porta e estado da conexão |
| **Servidor** (correio, web, arquivos) | **7** | a aplicação em si |

O OSI é **modelo de referência**: didático, nunca implementado literalmente. O que roda é a
pilha **TCP/IP**, de quatro camadas, e a banca mistura os dois de propósito — "nível de
internet" foi alternativa errada em 2018 por ser nome **correto no modelo errado**.

| OSI | TCP/IP | Protocolos |
|---|---|---|
| 7 Aplicação · 6 Apresentação · 5 Sessão | **Aplicação** | HTTP, SMTP, DNS, FTP |
| 4 Transporte | **Transporte** | TCP, UDP |
| 3 Rede | **Internet** | IP, ICMP |
| 2 Enlace · 1 Física | **Acesso à rede** (ou enlace/host-rede) | Ethernet, PPP |

## Onde a banca derruba

> [!pegadinha] Enlace também faz controle de erro e de fluxo
> A pegadinha número um do assunto, e decidiu a Q48 de 2023. As camadas 2 e 4 fazem as
> **mesmas funções** com **escopos diferentes**. Quando as duas estiverem na lista, procure
> a palavra de escopo: *"extremidades"*, *"fim a fim"* → transporte; *"adjacentes"*,
> *"mesmo segmento"* → enlace.

> [!pegadinha] Criptografia é 6, servidor de e-mail é 7
> Cifrar, no OSI, é **camada 6**, e a errada oferece Sessão ou Aplicação — na prática o TLS
> roda mesmo entre TCP e aplicação, e livros modernos o põem na 7, mas **em prova de modelo
> OSI isso não vale**. Já o servidor de correio fala SMTP, protocolo de aplicação: **camada
> 7**, igual ao servidor web. Foi o ponto inteiro da Q41 de 2018.

> [!pegadinha] Nome trocado numa lista correta, e a contagem invertida
> A banca escreve as sete camadas na ordem certa e troca **uma só** — "nível lógico", "nível
> de internet" no lugar de aplicação —, quase sempre no último item, quando você já decidiu
> que a alternativa estava certa. E cobra a posição em vez do nome: a contagem é **de baixo
> para cima**, a terceira é Rede, acima de Transporte vem Sessão. Questão inteira da
> TRANSPETRO 2023 foi só isso.

## Questões

> [!nota] Só as duas de conferência estão aqui
> Pela regra das 24 horas, no dia da leitura você resolve **duas ou três** questões, só para
> aferir se a leitura pegou. São estas duas, copiadas sem uma vírgula de diferença da versão
> completa. **As outras oito** — TRANSPETRO 2018 Q43, TRANSPETRO 2023 Q48, duas da TRANSPETRO
> 2023 do cargo Informática, BANESE 2025, BNDES 2024 e duas da UNEMAT 2024 — ficam na
> **versão completa**, com o gabarito comentado nomeando o tipo de distrator. Elas são o
> aquecimento das sessões seguintes e o material do bloco de sábado, não são para hoje.

### Q01 · TRANSPETRO 2018 · questão 41

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 41
> O enunciado clássico da banca para este assunto: dá uma lista de equipamentos e pede a
> camada de cada um, na ordem. Resolve-se com a tabela da seção 6.
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
> **Gabarito: C.** Aplicando a tabela da seção 6 na ordem do enunciado: roteador = **3**,
> switch = **2**, hub = **1**, servidor de correio = **7**, servidor WWW = **7**.
>
> Todo o peso está nos dois últimos. **A, B e D** oferecem **6** para o servidor de correio
> — a armadilha de achar que e-mail é "apresentação". SMTP é aplicação, camada 7, igual ao
> HTTP. **E** desloca tudo uma camada para cima (4, 3, 2) e pega quem contou a partir do 2;
> **D** põe hub em 2, confundindo repetidor com switch.
>
> Tipo de distrator: **T4 (inversão de papel/ordem)** — as cinco alternativas são
> permutações dos mesmos números, e só uma sequência está certa.

### Q02 · TRANSPETRO 2018 · questão 42

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 42
> Mesma prova, outro ângulo: em vez de equipamento, um defeito. Testa se você separa
> **onde o problema está** de **quem o detecta**.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638701)

Ao tentar diagnosticar a causa do desempenho ruim de um equipamento da rede, o analista de
suporte acaba descobrindo que um dos conectores de um cabo categoria 5 estava com mau
contato, o que ocasionava um problema intermitente.

Do ponto de vista do modelo de referência OSI da ISO, essa descoberta está associada a um
problema do seguinte nível:

- [ ] rede
- [x] físico
- [ ] transporte
- [ ] apresentação
- [ ] enlace de dados

> [!gabarito]-
> **Gabarito: B.** Conector, cabo e mau contato são características **mecânicas** do meio:
> **camada 1**. Regra prática: se o defeito é em algo que você pega com a mão, é física.
>
> O distrator forte é **E, enlace de dados**. Enlace é onde o erro é *detectado* — o FCS
> acusa o quadro corrompido e o descarta —, mas a *causa* está na física. A banca separa
> causa de sintoma, e a pergunta é sobre onde o problema está.
>
> Tipo de distrator: **T2 (irmão taxonômico)** — enlace é a camada vizinha e realmente tem
> relação com o fenômeno; o discriminante escondido é a palavra "conector".

## Figuras pendentes

**Nenhuma.** Todas as questões deste assunto têm alternativas em texto nos índices de 2018,
2023 e no caderno CESGRANRIO.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores** · Assunto: `Modelos de Referência de Redes` ›
**`Modelo OSI`** (hierarquia `03.01`, 2.106 questões no acervo). Marque também a banca
**CESGRANRIO**. A tabela completa de complementos está na versão completa da aula.

> [!checklist]
> - As sete na ordem, de baixo para cima: **F-E-R-T-S-A-A**.
> - PDU: **bit → quadro → pacote → segmento**; de 5 para cima, "dados".
> - Equipamento: hub 1, switch 2, roteador 3, firewall de estado 4, servidor 7.
> - **"Adjacentes" → enlace. "Ponta a ponta" → transporte.**
> - Camada 5: **diálogo, token, sincronização**.
> - Camada 6: **compressão e criptografia**; ASCII × EBCDIC; big × little-endian.
> - **Criptografia é 6. Servidor de e-mail é 7. ARP é 2.**
> - TCP/IP tem 4 camadas e **não tem sessão nem apresentação**.
