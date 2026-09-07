---
resumo_de: R03
titulo: Pilha TCP/IP e o mapeamento com o OSI (versão resumida)
resumo: A mesma aula dentro da fatia: as quatro camadas do TCP/IP por todos os nomes que a banca usa, o mapeamento com o OSI e os três campos que costuram a pilha na subida.
tempo: 45 min
---

> [!nota] Esta é a versão resumida — a que cabe no dia
> Lida de uma vez, a completa pede **117 min**; esta fecha em **45**. Nada que decide
> gabarito ficou de fora: as quatro camadas, a tabela dos **nomes** que a banca usa para cada
> uma, o mapeamento com o OSI, os três campos de demultiplexação e as pegadinhas.
>
> **Ficou só na completa:** as analogias com o limite declarado, as saídas de `curl`, `ss`,
> `ip route` e `ip neigh`, a tabela longa de protocolos de aplicação e **7 das 9 questões**.
>
> **Leia a completa na primeira vez** — metade dela é vocabulário, e vocabulário não comprime
> sem virar lista solta. Volte a esta no aquecimento e na véspera, pelo botão
> **completa | resumida** do topo.

> [!banca]
> **Item 1.1f do edital 2026 — "Arquitetura e protocolos TCP/IP".** Cobrança **conceitual e
> de nomenclatura**: dizer em que camada da arquitetura TCP/IP vive um protocolo, ou traduzir
> uma camada do TCP/IP para a do OSI.
>
> **Da nossa ênfase, o assunto tem uma questão só de prova direta:** a **2018·Q43**, que lista
> as sete camadas do OSI e planta ==Nível de internet== como alternativa errada — nome
> **correto no modelo errado**. O que sustenta a aula é o caderno CESGRANRIO recente.
>
> **O molde:** enunciado definicional de 40 a 90 palavras que já descreve a camada
> corretamente, alternativa de uma a quatro palavras. Distratores **T2** (protocolo real da
> camada errada), **T4** (nomes na ordem trocada) e **T3** (definição verdadeira da camada
> errada).

---

## 1 · Por que existem dois modelos

Em R01 você viu o **modelo OSI**, a **ISO/IEC 7498** de 1984, com sete camadas — que
**nunca foi implementado**: a pilha OSI de verdade (TP4 e CLNP, os equivalentes do TCP e do
IP) foi comprada por alguns governos nos anos 1980 e morreu. O que roda em toda máquina ligada
à internet é a **arquitetura TCP/IP**, e as duas nasceram ao contrário uma da outra, o que
explica quase todos os distratores do assunto: no OSI **o modelo veio primeiro** e os
protocolos falharam depois; no TCP/IP **os protocolos vieram primeiro** e o modelo, consolidado
na **RFC 1122** de 1989, descreve o que já funcionava. Sete camadas contra **quatro**; um
comitê internacional contra o **IETF** (*Internet Engineering Task Force*), que publica em
**RFCs** — a Q42 de 2023 abre com *"O IETF criou um conjunto de protocolos, conhecido como
IPsec"*.

**O que o TCP/IP resolve a mais**, e é a razão de ele ter vencido:
==funcionar sobre qualquer tecnologia de enlace já existente, sem substituí-la==. Ele roda
sobre Ethernet, Wi-Fi, linha telefônica, satélite. Foi projetado para interligar redes
**diferentes** — daí o nome da camada 3 dele ser *inter-rede*, e não "rede".

**O artefato que a aula desmonta.** Mesmo cenário de R01 e R02: notebook `10.20.30.40/24`,
MAC `A4:BB:6D:11:22:33`; gateway `10.20.30.1`, MAC `00:1A:2B:3C:4D:5E`; servidor
`200.150.10.80:80`; porta de origem `51344`.

```bash
$ sudo tcpdump -ni enp0s3 -e host 200.150.10.80
a4:bb:6d:11:22:33 > 00:1a:2b:3c:4d:5e, ethertype IPv4 (0x0800), length 74:
    10.20.30.40.51344 > 200.150.10.80.80: Flags [S], seq 1829403311, win 64240, length 0
```

Lida da esquerda para a direita, essa linha é a pilha TCP/IP de fora para dentro: os dois
MACs e o `ethertype` são a **camada de acesso à rede**; os dois IPs, a **inter-rede**; as
portas e o `Flags [S]`, o **transporte**; e o `GET / HTTP/1.1` que vem no terceiro pacote, a
**aplicação**.

## 2 · As quatro camadas

### Aplicação

**Resolve:** chegando os bytes à máquina certa e ao programa certo, alguém precisa dizer o que
eles **significam**.

**Mecanismo:** não é uma camada do sistema operacional — ==ela é o seu próprio programa==.
Cada aplicação define seu **protocolo de aplicação**, o formato exato das mensagens que troca
com a aplicação par: HTTP define que a primeira linha é `MÉTODO caminho versão`, SMTP que o
cliente diz `MAIL FROM:`. **A PDU** aqui chama-se **mensagem** ou **dados**.

Aqui está a diferença estrutural mais cobrada da aula: **esta única camada absorve as camadas
7, 6 e 5 do OSI**. ==No modelo TCP/IP não existe camada de Sessão nem de Apresentação.== As
funções existem — o TLS cifra, o cookie mantém a sessão —, mas o modelo não lhes dá camada
própria: quem quiser, implementa dentro da aplicação.

**Protocolos daqui:** HTTP, HTTPS (HTTP sobre **TLS**), FTP, SMTP, POP3, IMAP, DNS, DHCP,
SNMP, LDAP, Telnet, SSH, NFS, NTP. **Todos** — se o nome é conhecido de usuário final, a aposta
certa é aplicação. A banca costuma escrevê-los **por extenso**, para esconder a sigla.

**A banca chama de:** *"nível de aplicação"*, *"aplicativos de alto nível"*, *"processos de
usuário"*, ou o nome de qualquer protocolo da lista.

### Transporte

**Resolve:** o IP entrega na **máquina**, mas nela há navegador, e-mail e DNS ao mesmo tempo.
Sem transporte, ==uma máquina só poderia ter uma conversa por vez==.

**Mecanismo — duas funções, e a primeira quase nunca é lembrada:**

1. **Multiplexação e demultiplexação por porta.** **Porta** é um número de 16 bits (0 a
   65.535) que identifica o processo dentro da máquina; o par (IP, porta) chama-se **socket**.
   O TCP identifica uma conexão pelos **quatro** valores — IP e porta de origem, IP e porta de
   destino —, e é por isso que você pode ter duas abas no mesmo site: mesmo IP, mesma porta de
   destino, **portas de origem diferentes**.
2. **Confiabilidade — opcional.** O **TCP** numera os bytes, exige confirmação (**ACK**),
   retransmite o não confirmado e controla o fluxo com **janela deslizante**. O **UDP** põe
   portas, tamanho e **checksum** (que só **detecta** corrupção, sem corrigir) e manda.

As portas são atribuídas pela **IANA** em três faixas: **0–1023 bem conhecidas** (80 HTTP,
443 HTTPS, 53 DNS, 25 SMTP, 22 SSH, 21 FTP, 23 Telnet, 161 SNMP, 67/68 DHCP),
**1024–49151 registradas** e **49152–65535 dinâmicas**. **A PDU:** **segmento** no TCP,
**datagrama** no UDP.

**A banca chama de:** *"fim a fim"*, *"ponta a ponta"*, *"entre as extremidades"*, *"orientado
à conexão"*, *"entrega ao processo"*, *"porta"* — e
==a expressão que decide é sempre "fim a fim" ou "orientado à conexão"==. **Confunde-se com**
o **enlace**, que faz erro e fluxo entre nós *adjacentes*, e com a **inter-rede**: o distrator
clássico oferece o UDP "na camada de rede" por ele ser mais simples que o TCP.

### Inter-rede (Internet)

**É a camada que mais aparece como distrator, e a seção 3 é só sobre os nomes dela.**

**Resolve:** Ethernet entrega dentro de um segmento local, Wi-Fi dentro do alcance do rádio —
nenhuma alcança uma máquina do outro lado do país. Sem esta camada, ==a rede acaba na parede==.

**Mecanismo — o IP (RFC 791) faz três coisas**, e a primeira é a que mais se esquece:

1. **Decide se o destino é local ou remoto.** O **host** aplica a **máscara de sub-rede** ao
   próprio IP e ao IP de destino — máscara é o número que diz **quantos bits iniciais
   identificam a rede** (em `/24`, os 24 primeiros). Dando o mesmo resultado, o destino está
   na mesma rede e o pacote vai **direto**; dando resultados diferentes, vai para o **gateway
   padrão**. Isto é conteúdo de prova literal: é o ponto inteiro da questão do BANESE 2025.
2. **Encaminha, salto a salto.** Cada roteador olha o IP de destino, consulta a tabela de
   rotas e escolhe a saída. Sem conexão, sem confirmação, sem memória: o serviço do IP é
   ==não confiável e sem conexão== (*best effort*) por decisão de projeto — a confiabilidade
   fica no transporte, onde só as pontas pagam por ela.
3. **Fragmenta**, quando o pacote é maior que a **MTU** do enlace (1500 bytes em Ethernet).

No cenário, `200.150.10.80` não casa com `10.20.30.0/24`, então o pacote vai para
`10.20.30.1` — e é por isso que, no `tcpdump`, o **MAC de destino é o do roteador** enquanto o
**IP de destino é o do servidor**: ==camada 3 aponta para o destino final, camada 2 aponta para
o próximo salto.== **A PDU:** **pacote**, ou **datagrama IP** — cuidado, "datagrama" é usado
aqui e no UDP.

**Outros protocolos desta camada:** o **ICMP** (*Internet Control Message Protocol*), das
mensagens de controle e erro do próprio IP ("destino inalcançável", "tempo excedido", o
`ping`), que viaja **dentro** de um pacote IP e por isso faz gente jurar que é transporte —
não é: ==ICMP é da inter-rede==, porque serve ao IP, não às aplicações; o **ARP** (*Address
Resolution Protocol*), que descobre o MAC correspondente a um IP local perguntando em
**broadcast** — no OSI a resposta esperada é **camada 2**, mas em questão de "rede TCP/IP" a
banca o cobra como quem traduz endereço lógico em físico; e o **IGMP**, dos grupos
**multicast**, quase sempre distrator.

**A banca chama de:** *"encaminhamento"*, *"roteados da origem até o destino"*, *"endereço
lógico"*, *"melhor esforço"*, *"sem conexão"*, *"tabela de rotas"*, *"gateway"* — e, atenção,
tanto ==camada de rede== quanto ==camada de inter-rede==, que aqui são a mesma coisa.

### Acesso à rede

**Resolve:** alguém tem que pôr os bits no cabo, e cada tecnologia faz isso de um jeito. Sem
esta camada, o IP teria que conhecer voltagem de par trançado, modulação de rádio e formato
de quadro Ethernet, e mudaria a cada tecnologia nova.

**Mecanismo:** embrulha o pacote IP num **quadro** (*frame*) com os **MAC** de origem e de
destino, resolve a disputa pelo meio, acrescenta o **FCS** (*Frame Check Sequence*) no fim e
transmite; carrega também o **EtherType**, que diz para qual protocolo de cima entregar.
**O quadro é descartado e refeito a cada salto**; o pacote IP atravessa a viagem inteira.
**A PDU:** **quadro**; no fio, **bits**. **Padrões:** Ethernet (IEEE 802.3), Wi-Fi (802.11),
PPP, HDLC, Frame Relay, ATM.

**A banca chama de:** *"acesso ao meio"*, *"quadro"*, *"endereço físico"*, *"nós adjacentes"*,
*"interface de rede"*. **Confunde-se com** as camadas **1 e 2 do OSI**, que é exatamente
onde ela se divide — a segunda diferença estrutural mais cobrada:
==o modelo TCP/IP não separa físico de enlace==.

## 3 · Os nomes de cada camada — a seção de maior retorno

A CESGRANRIO quase nunca erra o conceito: ela troca o **nome** — e, nas nove questões reais da
versão completa, chama a mesma camada de coisas diferentes de um ano para o outro.

| Camada TCP/IP | Nomes que a banca já usou, em prova |
|---|---|
| 4 · **Aplicação** | "camada de aplicação", "nível de aplicação", "nível de aplicação internet TCP/IP" |
| 3 · **Transporte** | "camada de transporte", "nível de transporte" |
| 2 · **Inter-rede** | ==**"camada de inter-rede"**== · ==**"camada de rede"**== · "camada IP" |
| 1 · **Acesso à rede** | "camada de enlace", "camada de acesso à rede", "host-rede" |

O conjunto também troca de nome, todos vistos em prova da mesma banca: **arquitetura
TCP/IP**, **arquitetura de protocolos da Internet**, **arquitetura da internet**, **modelo
Internet**, **pilha de protocolos da arquitetura TCP/IP**, **rede TCP/IP**.

> [!decore]
> ==Nunca elimine uma alternativa porque o nome da camada "está errado".== Em questão de
> TCP/IP, *camada de rede* e *camada de inter-rede* são a mesma coisa: elimine pela **função**
> descrita, nunca pelo rótulo.
>
> A recíproca é a armadilha da Q43 de 2018: **"nível de internet" numa lista das sete camadas
> do OSI está errado**, porque ali o nome pertence ao outro modelo.

## 4 · O mapeamento, camada por camada

| OSI | TCP/IP (4 camadas, RFC 1122) | PDU | Protocolos | Endereço |
|---|---|---|---|---|
| 7 Aplicação · 6 Apresentação · 5 Sessão | **Aplicação** | mensagem / dados | HTTP, DNS, SMTP, FTP, SSH, DHCP | nome |
| 4 Transporte | **Transporte** | segmento / datagrama | TCP, UDP | porta (`51344`, `80`) |
| 3 Rede | **Inter-rede** (Internet) | pacote / datagrama IP | IP, ICMP, IGMP, (ARP) | IP (`10.20.30.40`) |
| 2 Enlace · 1 Física | **Acesso à rede** | quadro / bits | Ethernet, Wi-Fi, PPP, HDLC | MAC |

Três leituras que a banca cobra separadamente:

1. **7, 6 e 5 do OSI viram uma só.** "Camada de sessão" numa questão que diz "arquitetura
   TCP/IP" está errada **por existência**, não por função.
2. **2 e 1 do OSI viram uma só.** O TCP/IP não distingue enlace de física.
3. **Transporte e Rede são as únicas com correspondência exata** — daí a pergunta mais
   frequente ser *"a que camadas do OSI correspondem TCP e IP?"*, cuja resposta é
   **transporte e rede**.

## 5 · Os três campos que costuram a pilha

Na **descida**, cada camada acrescenta seu cabeçalho. Na **subida**, cada uma precisa saber a
qual protocolo de cima entregar — e sabe porque **quem desceu escreveu isso num campo**.

| Quem entrega | Campo do cabeçalho | Valores que a prova cobra |
|---|---|---|
| Acesso à rede → Inter-rede | **EtherType** (16 bits, no quadro Ethernet) | `0x0800` IPv4 · `0x0806` ARP · `0x86DD` IPv6 |
| Inter-rede → Transporte | **Protocol** (8 bits, no cabeçalho IPv4) | `1` ICMP · `6` **TCP** · `17` **UDP** · `50` ESP · `51` AH |
| Transporte → Aplicação | **porta de destino** (16 bits) | `80` HTTP · `443` HTTPS · `53` DNS · `22` SSH · `25` SMTP |

**ESP** (*Encapsulating Security Payload*) e **AH** (*Authentication Header*) são os dois
protocolos do IPsec — o AH só autentica, o ESP cifra o pacote inteiro —, e o número próprio no
campo `Protocol` é a prova de que os dois vivem na inter-rede. Guarde o par: ele cai nas duas
provas da TRANSPETRO.

Na subida, dentro do servidor: a placa confere o FCS e lê `ethertype 0x0800` → entrega ao IP;
o IP lê `Protocol = 6` → entrega ao TCP; o TCP lê a porta `80` → entrega ao processo do
servidor web, que lê `GET / HTTP/1.1`.

> [!decore]
> **6 é TCP, 17 é UDP, 1 é ICMP** no campo *Protocol* do IP. **0x0800 é IPv4, 0x0806 é ARP**
> no EtherType. São números pequenos, e a banca gosta de distrator numérico vizinho (T8).

## 6 · Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "arquitetura TCP/IP", "modelo Internet" | a pilha de **4 camadas** | modelo OSI, de 7 |
| "camada de inter-rede", "camada IP", "camada de rede" num enunciado de TCP/IP | a **camada 2 do TCP/IP** = camada 3 do OSI | o rótulo não muda a resposta |
| "fim a fim", "ponta a ponta", "orientado à conexão" | **transporte**, em geral **TCP** | enlace, que faz o mesmo entre adjacentes |
| "melhor esforço", "sem conexão", "encaminhamento" | **IP**, inter-rede | UDP, não confiável mas de transporte |
| "traduzir o endereço lógico no físico" | **ARP** | DNS, que traduz nome em IP |
| "controle de diálogo", "sintaxe e semântica" | camadas **5 e 6 do OSI** | num enunciado de TCP/IP a alternativa cai por existência |

## Onde a banca derruba

> [!pegadinha] "Nível de internet" numa lista das sete camadas do OSI
> Foi o gabarito inteiro da Q43 de 2018: a banca escreve as sete camadas na ordem certa e troca
> **só a última** por um nome do TCP/IP. Leia a lista até o fim.

> [!pegadinha] "O UDP fica na camada de rede porque é mais simples"
> Alternativa do CNU 2024, quase palavra por palavra. Simplicidade não muda camada:
> ==TCP e UDP são os dois do transporte==. O que muda é o serviço que cada um oferece dentro
> dela.

> [!pegadinha] ICMP no transporte, e sessão no TCP/IP
> O ICMP viaja dentro de um pacote IP e fala de portas nas mensagens de erro — daí a tentação
> —, mas serve ao **IP**, não a aplicações, e não tem porta própria: é da **inter-rede**. E
> "com o suporte da camada de sessão" foi distrator no CNU 2024: dito *arquitetura TCP/IP*,
> essa camada **não existe**, e a alternativa cai sem que você avalie a função descrita.

> [!pegadinha] "Não confiável" do IP × "não confiável" do UDP
> Os dois são, e a banca aproveita. A separação é o **escopo**: o IP não confirma nada em salto
> nenhum; o UDP não confirma **fim a fim**, embora entregue ao processo certo. Numa questão que
> diga "fim a fim", a resposta nunca é IP. E o nome do modelo decide onde fica a criptografia:
> **OSI → camada 6; TCP/IP → aplicação**.

## Questões

> [!nota] Só as duas de conferência estão aqui
> Pela regra das 24 horas, no dia da leitura você resolve **duas ou três** questões, só para
> aferir se a leitura pegou — copiadas sem uma vírgula de diferença da versão completa. São a
> **questão-mãe do assunto**, a única de prova TRANSPETRO direta, e a do **UNEMAT 2024**, que
> cobra o mapeamento no formato mais frequente.
>
> **As outras sete** — TRANSPETRO 2023 (cargo Informática), BANESE 2025 (duas), IPEA 2024
> (duas), CNU 2024 e AgeRIO 2023 — ficam na **versão completa**, com o gabarito comentado
> nomeando o tipo de distrator. Elas são o aquecimento das sessões seguintes e o material do
> bloco de sábado, não são para hoje.

### Q01 · TRANSPETRO 2018 · questão 43

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 43
> A questão-mãe deste assunto: quatro das cinco alternativas trocam **um nome só** na lista
> das sete camadas do OSI, e uma delas usa um nome do modelo TCP/IP. Se você resolver só
> uma questão desta aula hoje, resolva esta.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638830)

O modelo OSI possui sete níveis de protocolos.

Tais níveis são os seguintes:

- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e Nível lógico.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de criptografia; Nível de apresentação e Nível de aplicação.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de banco de dados; Nível de apresentação e Nível de aplicação.
- [x] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e Nível de aplicação.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e Nível de internet.

> [!gabarito]-
> **Gabarito: D.** A lista correta, de baixo para cima: Física, Enlace, Rede, Transporte,
> Sessão, Apresentação, Aplicação.
>
> As cinco alternativas são **idênticas nos quatro primeiros itens**. O que muda é o 5º ou o
> 7º:
>
> - **E** — *"Nível de internet"* no lugar de Aplicação. É a armadilha desta aula inteira: ==Internet é uma camada do modelo TCP/IP, não do OSI==. Nome real, modelo errado. Distrator **T2 (irmão taxonômico)**: o termo existe, só não pertence a esta família.
> - **A** — *"Nível lógico"* no lugar de Aplicação: nome que não existe em modelo nenhum. **T1 (neologismo plausível)**.
> - **B** — *"Nível de criptografia"* no lugar de Sessão. Criptografia é **função** da camada 6, não nome de camada. **T1**, com isca semântica.
> - **C** — *"Nível de banco de dados"* no lugar de Sessão. **T1**, o mais grosseiro dos quatro.
>
> Repare no método: a banca não precisa mentir sobre o conteúdo, basta plantar **um** token
> falso numa cadeia verdadeira — é a assinatura do **T7 (variação mínima em cadeia exata)**
> aplicada a nomes em vez de a comandos. Leia a lista inteira, sempre.

### Q03 · CESGRANRIO · UNEMAT 2024 (Técnico em Informática)

> [!fonte] Fonte: prova UNEMAT 2024, Técnico em Informática — do seu caderno CESGRANRIO
> A pergunta central desta aula, na forma mais direta que existe: dois protocolos, duas
> camadas, "respectivamente". É a única linha da tabela da seção 5 que tem correspondência
> exata entre os dois modelos, e é justamente a que cai.
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
> **Gabarito: C.** TCP = **transporte** (camada 4 do OSI); IP = **rede** (camada 3).
>
> As quatro erradas são pares de camadas **adjacentes**, deslocados um degrau para cima ou
> para baixo: **B** e **D** acertam uma e erram a outra por um nível; **A** e **E** erram as
> duas. Quem souber que TCP é transporte elimina A, B e E de uma vez; quem souber que IP é
> rede elimina D.
>
> Tipo de distrator: **T4 (deslocamento de ordem)**. A banca não precisa inventar camada
> nenhuma — basta deslocar a régua.
>
> **Esta questão também está em R01, como Q10.** Não é descuido: ela mede exatamente a
> mesma coisa pelos dois lados, e reencontrá-la aqui, uma semana depois, é o teste de
> retenção que a leitura de hoje não consegue fazer.


## Figuras pendentes

**Nenhuma.** Todas as questões deste assunto têm enunciado e alternativas em texto.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores** · Assunto: `Modelos de Referência de Redes` ›
**`Arquitetura TCP/IP`**, com a banca **CESGRANRIO** marcada. A tabela completa de
complementos está na versão completa da aula.

> [!checklist]
> - **4 camadas:** acesso à rede · inter-rede · transporte · aplicação.
> - **7, 6 e 5 do OSI viram aplicação; 2 e 1 viram acesso à rede.**
> - ==Não existe sessão nem apresentação no TCP/IP.==
> - "Camada de rede" e "camada de inter-rede" são a mesma. Elimine pela função.
> - **TCP e UDP são os dois do transporte. ICMP e ARP não são.**
> - **6 TCP · 17 UDP · 1 ICMP · 50 ESP · 51 AH** no campo Protocol.
> - **0x0800 IPv4 · 0x0806 ARP** no EtherType.
> - Enunciado de OSI → cifrar é 6. Enunciado de TCP/IP → cifrar é aplicação.
