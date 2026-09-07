---
resumo_de: R04
titulo: TCP × UDP — handshake, confiabilidade e portas (versão resumida)
resumo: A mesma aula dentro da fatia: os dois buracos que o transporte tapa, as portas com o transporte de cada uma, o handshake com as flags certas, fluxo × congestionamento e os falsos protocolos de transporte.
tempo: 45 min
---

> [!nota] Esta é a versão resumida — e ela ainda pede 7 min a mais que a fatia
> Lida de uma vez, a completa pede **185 min**; esta pede **52**, contra os 45 da fatia. É a
> compressão mais forte das quatro aulas de redes — de 3,6 para 1 — e mesmo assim sobra, porque
> este assunto tem três blocos que a banca cobra separados: portas, UDP e TCP. Não encolhi mais
> do que isto porque o que restou é tabela, e tabela é o que a prova pergunta.
> ==Se o dia apertar, pare depois da seção 4 e leve as seções 5 a 7 para o aquecimento de
> amanhã== — são tabelas, e tabela relida no dia seguinte fixa melhor.
>
> **Ficou só na completa:** as analogias com o limite declarado, o `tcpdump` comentado linha a
> linha, o cabeçalho campo a campo, o ICMP *Port Unreachable*, a síndrome da janela tola com as
> curas de Clark e Nagle, o TIME_WAIT, e **10 das 12 questões**.
> ==Este é o único dos quatro assuntos em que vale mesmo abrir a completa:== o mecanismo por
> dentro é o que a banca cobra aqui.

> [!banca]
> **Itens 1.1e e 1.1f do edital 2026.** Cobrança **de mecanismo**: nomear a flag certa na etapa
> certa, dizer qual porta pertence a qual serviço. Pede **sequência exata** (SYN → SYN+ACK →
> ACK) e **número exato** (587, não 25). **Caiu 1 vez em 2018** (Q45) e **1 em 2023** na nossa
> ênfase (Q48); mais três vezes na mesma prova de 2023, em outros cargos. ==Metade das questões
> deste assunto está catalogada sob outro rótulo no acervo.==
>
> **Distratores:** **T2** (IP, ICMP, ARP, IGMP oferecidos como transporte), **T4** (TCP e UDP
> invertidos, flags fora de ordem) e **T8** (portas vizinhas). A banca usa o vocabulário da
> tradução do **Comer**: *"campo de bits de código"* em vez de "flags".

---

## 1 · Os dois buracos que o transporte tapa

A camada de **inter-rede**, a do IP, entrega um pacote de uma máquina a outra com **serviço de
melhor esforço**: ==perdeu, duplicou ou corrompeu, o IP não avisa ninguém e não tenta de novo.==
Daí dois buracos: **o IP entrega na máquina, não no programa** — sem transporte,
==uma máquina só poderia manter uma conversa por vez== — e **ninguém garante que a mensagem
chegou inteira**. O primeiro é tapado **sempre**, pela **porta**; o segundo, **só para quem
quiser** — e é daí que nascem os dois protocolos.

**Por que não um só, confiável?** Porque confiabilidade custa **um tempo de ida e volta** antes
do primeiro byte útil, **estado no servidor** por cliente e **atraso variável** nas
retransmissões — e numa chamada de voz retransmitir é pior que perder, porque o pacote chega
tarde demais para ser tocado. ==O UDP não é "o TCP capado": é escolha de projeto, e entrega em
troca latência previsível e ausência de estado.==

> [!decore]
> Buraco 1, entregar ao **processo** certo → **porta**: TCP e UDP fazem os dois.
> Buraco 2, entregar **confiavelmente** → **só o TCP**.
> Toda questão do assunto pergunta de qual dos dois buracos ela está falando.

**A camada vizinha mais perigosa é o enlace**, que também faz erro e fluxo:
==fim a fim é transporte; entre nós adjacentes é enlace.== E há a armadilha estrutural —
==o TCP/IP tem quatro camadas e não tem sessão nem apresentação==, então num enunciado que diga
"modelo Internet" a alternativa que invoca a sessão já está errada pela moldura.

**O cenário desta aula.** Você digita `http://www.transpetro.com.br` no notebook `10.20.30.40`.
Antes de existir conexão TCP, o sistema pergunta o IP daquele nome ao DNS `10.20.30.2:53` — por
**UDP**, da porta efêmera `54137`. Só depois o navegador abre a conexão **TCP** de `51344` para
`200.150.10.80:80`. **Um gesto, os dois protocolos.** No `tcpdump`, as linhas de UDP não têm
flag nenhuma; as de TCP mostram `[S]` (SYN), `[S.]` (SYN+ACK — o ponto final é sempre o ACK),
`[.]` (só ACK), `[P.]` (PSH+ACK, o que carrega dados), `[F.]` (FIN+ACK) e `[R]` (RST).

## 2 · Porta: a função que TCP e UDP têm em comum

**Porta** é um inteiro de **16 bits** (0 a **65.535**) que identifica o ponto de comunicação de
um processo dentro da máquina; porta de origem e de destino são os **dois primeiros campos** do
cabeçalho, nos dois protocolos, e o par (IP, porta) chama-se **socket**.

O **TCP** identifica uma conexão pela **quádrupla** (IP e porta de origem, IP e porta de
destino) — por isso duas abas no mesmo site não se misturam. O **UDP** não tem conexão para
identificar, e por isso suporta **broadcast** e **multicast**, enquanto
==o TCP é sempre unicast.== **Não confunda** porta com a **porta física** de um switch, o
conector RJ-45: uma questão da própria TRANSPETRO 2023 usa a palavra nesse sentido.

**As três faixas da IANA:** **0–1023 bem conhecidas**, **1024–49151 registradas** (3306 MySQL,
5432 PostgreSQL, 8080 proxy) e **49152–65535 dinâmicas, privadas ou efêmeras**. O Linux sorteia
de 32768 a 60999 — ==a faixa efêmera real não coincide com a da IANA, e a que a prova cobra é a
da IANA.==

**A tabela cobrada por número exato.** A coluna do meio é a que derruba: saber a porta não
basta, é preciso saber se ela é TCP ou UDP.

| Porta | Transporte | Serviço |
|---|---|---|
| 20 / 21 · 22 · 23 | TCP | FTP dados/controle · SSH (e SFTP, SCP) · Telnet |
| 25 | TCP | SMTP — **entre servidores** (*relay*) |
| 53 | **UDP e TCP** | DNS — consulta em UDP; transferência de zona em TCP |
| 67 / 68 · 69 | UDP | DHCP servidor/cliente · TFTP |
| 80 · 443 | TCP | HTTP · HTTPS (UDP no HTTP/3) |
| 110 · 143 · 993 · 995 | TCP | POP3 · IMAP · IMAPS · POP3S |
| 123 | UDP | NTP |
| 161 / 162 | UDP | SNMP — consulta ao agente / *trap* ao gerente |
| 389 · 636 · 445 · 465 | TCP | LDAP · LDAPS · SMB/CIFS · SMTPS |
| 514 | UDP | syslog |
| **587** | TCP | **SMTP submission** — cliente entregando ao servidor, autenticado |
| 1812 / 1813 | UDP | RADIUS — autenticação / contabilização |
| 3389 | TCP | RDP |

> [!decore]
> **As de UDP, que você erra se não decorar:** 53 (DNS, também TCP), 67/68 (DHCP), 69 (TFTP),
> 123 (NTP), 161/162 (SNMP), 514 (syslog), 1812/1813 (RADIUS).
> **O par 25 × 587:** ==25 é servidor falando com servidor; 587 é cliente entregando ao
> servidor.==

**Quando a porta não existe:** no **UDP** o destino descarta e devolve **ICMP tipo 3 código 3**
(*Port Unreachable*); no **TCP**, um segmento com **RST**. ==Só o host de destino conhece as
portas alocadas nele, então é ele que emite o Port Unreachable==, nunca um roteador do caminho.

## 3 · UDP: definido pelo que não faz

Cabeçalho de **8 bytes fixos**, quatro campos de 16 bits: **porta de origem**, **porta de
destino**, **comprimento** e **checksum** (**opcional em IPv4**, obrigatório em IPv6). E é só
isso — **cada campo que falta é uma função que ele não executa:** sem número de sequência **não
reordena nem elimina duplicata**; sem confirmação **não retransmite**; sem janela **não faz
controle de fluxo nem de congestionamento**; sem flags **não abre nem fecha conexão** — não
existe handshake UDP. O checksum **detecta** corrupção e faz o receptor **descartar em
silêncio**, sem corrigir nem pedir de novo.

Em troca, ele entrega **zero tempo de abertura**; **nenhum estado no servidor** — e por isso
==é imune ao SYN flood, porque não há conexão pendente para acumular==; **latência previsível**;
e **fronteira de mensagem preservada**, com um envio de 40 bytes virando um datagrama de 40
lido inteiro numa operação só — ==o TCP não tem essa propriedade: para ele existe um fluxo de
bytes, e a divisão em segmentos não tem relação com a divisão em mensagens da aplicação.==

**Quem usa:** DNS (consulta), DHCP, TFTP, NTP, SNMP, syslog, RADIUS, voz e vídeo em tempo real
(**RTP**), jogos, e o **QUIC**, transporte do **HTTP/3**. **Confunde-se com** o **IP**, também
sem conexão e de melhor esforço, e é esse parentesco que a banca explora:
==o IP entrega na máquina e não tem porta; o UDP entrega no processo e tem porta.==

## 4 · TCP por dentro

Cabeçalho de **20 bytes mínimos** (até 60 com opções): as duas portas, o **número de sequência**
(32 bits: a posição, no fluxo, do primeiro byte de dado deste segmento), o **número de
confirmação** (o próximo byte esperado), os seis **bits de código**, a **janela**, o **checksum**
obrigatório e as **opções**. Três detalhes cobrados: ==o número de sequência conta **bytes**, não
segmentos==; **a confirmação é cumulativa** — `ack 78` quer dizer ==recebi tudo até o 77 e espero
o 78==, de modo que um ACK perdido não custa retransmissão; e a **MSS** (*Maximum Segment Size*)
é o maior bloco de **dados** por segmento, `1460` = 1500 de **MTU** menos 20 de IP e 20 de TCP.

**Os seis bits de código.** A banca monta a grade de alternativas **permutando exatamente estes
seis** — assinatura T4.

| Flag | O que significa |
|---|---|
| **SYN** (*synchronize*) | "sincronize os números de sequência comigo" — **só na abertura** |
| **ACK** (*acknowledgement*) | "o Número de confirmação é válido" — ligado em quase todo segmento depois do primeiro |
| **FIN** (*finish*) | "não tenho mais nada a enviar nesta direção" — encerramento normal |
| **RST** (*reset*) | "aborte agora" — encerramento anormal, porta fechada, RST de firewall |
| **PSH** · **URG** | entrega imediata à aplicação · dado urgente (obsoleto) |

São bits independentes e podem estar ligados juntos — daí `SYN+ACK` na abertura e `FIN+ACK` no
encerramento. ==FIN nunca participa da abertura. SYN nunca participa do encerramento.==

| # | Abertura — **três** segmentos | Flags | Conteúdo |
|---|---|---|---|
| 1 | cliente → servidor | **SYN** | `seq = x`, o ISN do cliente |
| 2 | servidor → cliente | **SYN + ACK** | `seq = y`, `ack = x+1` |
| 3 | cliente → servidor | **ACK** | `seq = x+1`, `ack = y+1` |

**ISN** (*Initial Sequence Number*) é o ponto de partida da contagem e **não é zero**: é
pseudoaleatório, para impedir que um segmento atrasado de uma conexão antiga entre numa nova e
dificultar injeção por um atacante. **Por que três e não duas:** a etapa 2 confirma o SYN do
cliente, a 3 confirma o do servidor, e como cada direção é independente (o TCP é
**full-duplex**), ==são duas aberturas, e a do meio foi economizada juntando SYN e ACK no mesmo
segmento.== O custo é **um RTT** antes do primeiro byte útil, e ==o SYN consome um número de
sequência mesmo sem carregar dado== — o FIN também.

Entre a etapa 2 e a 3 o servidor guarda estado para uma conexão que ainda não existe: é a
**conexão meio-aberta** (*half-open*), na fila de *backlog*. Milhares de SYN com origem falsa e
sem o terceiro segmento enchem essa fila e o servidor recusa conexões legítimas — é o **SYN
flood**, e ==a defesa clássica é o *SYN cookie*: o servidor não guarda estado na etapa 2 e
codifica a informação dentro do próprio ISN que devolve.==

O **encerramento normal usa quatro segmentos**, porque cada direção é fechada em separado:
**FIN** de A → **ACK** de B (que entra em `CLOSE_WAIT` e **ainda pode enviar dados**) → **FIN**
de B → **ACK** de A, que entra em **`TIME_WAIT`**. Na prática as etapas 2 e 3 costumam vir
juntas num `FIN+ACK`, mas ==o encerramento normal do TCP é descrito como de quatro segmentos, e
é assim que a prova cobra.== O **RST** derruba na hora, sem negociação.

**Confiabilidade — cinco mecanismos.** **Numeração de bytes**; **confirmação cumulativa** — e
==o TCP só tem confirmação positiva: não existe NAK==, o receptor apenas repete o último ACK e é
o emissor que conclui; **retransmissão por temporizador (RTO)**, calculado do **RTT** medido;
**retransmissão rápida**, disparada por **três ACKs duplicados**; e **checksum com descarte** —
==a detecção de erro do TCP não corrige nada: transforma corrupção em perda, e a perda é
resolvida pela retransmissão.==

**Os dois controles.** No de **fluxo**, o receptor publica no campo **Janela** ==quantos bytes
ainda cabem no buffer dele==, e o emissor não passa disso; conforme os ACKs chegam a borda
esquerda avança, daí **janela deslizante**. Buffer cheio → `win 0` e o emissor **para**. No de
**congestionamento**, o emissor mantém a **cwnd**, que **ninguém anuncia**: ele a estima pela
perda de pacotes e transmite pelo **menor dos dois limites**, em **partida lenta** (dobra a cada
RTT) e depois **prevenção de congestionamento** (um MSS por RTT), no padrão AIMD.

> [!decore]
> ==Controle de **fluxo** protege o **receptor** e é **anunciado**; controle de
> **congestionamento** protege a **rede** e é **estimado**.== O UDP não tem nenhum dos dois.

## 5 · TCP × UDP: a tabela que a banca troca

| | **TCP** | **UDP** |
|---|---|---|
| Nº no campo Protocolo do IPv4 | **6** | **17** |
| Conexão | **orientado à conexão**, handshake de 3 vias | **sem conexão** |
| **PDU** · cabeçalho | **segmento** · **20 bytes** (até 60) | **datagrama** · **8 bytes** fixos |
| Entrega | **confiável**: confirma e retransmite | **melhor esforço**: manda e esquece |
| Ordem e duplicatas | garante a ordem, elimina duplicata | não garante, não elimina |
| Checksum | obrigatório | opcional em IPv4 |
| Fluxo · congestionamento | **sim** (anunciado) · **sim** (estimado) | não · não |
| Fronteira de mensagem | **não** — fluxo de bytes | **sim** — um datagrama, uma leitura |
| Modo | full-duplex, **unicast** apenas | suporta **broadcast e multicast** |
| Estado no servidor · 1º byte útil | um bloco por conexão · **1 RTT** | nenhum · zero |
| Aplicações | HTTP, HTTPS, SMTP, FTP, SSH, IMAP, RDP | DNS, DHCP, TFTP, NTP, SNMP, syslog, RADIUS, RTP, QUIC |

## 6 · Os falsos protocolos de transporte — a seção que mais vale pontos

Em **4 das 12 questões de prova** deste assunto, a alternativa mais tentadora depois do gabarito
é um protocolo **real**, com sigla familiar, que ==não é de transporte==. É a assinatura **T2**.

- **IP** — camada de rede; engana por ser sem conexão e de melhor esforço, igual ao UDP.
  ==Não tem porta e entrega na máquina.==
- **ICMP** — camada de rede, protocolo 1: o `ping`, o `traceroute`, *Destination Unreachable*.
  ==Não tem porta, e existe para falar **sobre** a rede, não **através** dela.==
- **ARP** — descobre o MAC correspondente a um IP local. ==Não é encapsulado em IP: vai direto
  no quadro Ethernet, ethertype `0x0806`==, e nunca sai da rede local.
- **IGMP** — camada de rede, protocolo 2, grupos multicast; engana pela sigla vizinha do ICMP, e
  a banca escreve o nome errado de propósito: ==é *Group Management*, não *Group Message*.==

Os transportes de verdade que quase nunca caem: **SCTP** (132) e **DCCP** (33). O atalho
definitivo é numérico — o campo **Protocolo** do cabeçalho IPv4:

| 1 | 2 | **6** | 17 | 50 / 51 | 132 |
|---|---|---|---|---|---|
| ICMP · rede | IGMP · rede | **TCP · transporte** | UDP · transporte | ESP / AH (IPsec) · rede | SCTP · transporte |

==Se o protocolo tem número nesse campo, ele está acima do IP. E dos que estão acima do IP, só
TCP, UDP e SCTP são de transporte.== O ARP nem aparece na lista, porque não mora acima do IP.

## 7 · Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "sem vinculação lógica entre origem e destino" | **UDP** | o IP, sem conexão mas sem porta |
| "fim a fim", "ponta a ponta", "entre as extremidades" | camada de **transporte** | enlace, que faz o mesmo entre **adjacentes** |
| "assegura a entrega", "transferência confiável e transparente" | **TCP** | segurança — confiável não é sigiloso |
| "campo de bits de código" | as **flags**: SYN, ACK, FIN, RST, PSH, URG | o campo Protocolo do IP |
| "sincronismo entre as extremidades" | **SYN** e o ISN | sincronização de diálogo, que é **sessão** |
| "janela deslizante", "anúncio de janela", "janela zero" | **controle de fluxo** | congestionamento, que é estimado |
| "inundação", "conexões meio-abertas" | **SYN flood** | DRDoS, que reflete SYN/ACK |
| "transferência de zona" · "submissão de mensagens" | DNS sobre **TCP** · SMTP porta **587** | consulta DNS em UDP · porta 25, o relay |

## Onde a banca derruba

> [!pegadinha] P1 — Confiável não é seguro
> "Confiável", no TCP, é **chega inteiro, na ordem e uma vez só** —
> ==a conexão é completamente aberta, e quem capturar o tráfego lê tudo.== Quem cifra é o
> **TLS**, acima do TCP. Enunciado que ligue "confiável" a "sigiloso" está errado.

> [!pegadinha] P2 — O UDP "está numa camada mais baixa porque é mais simples"
> Alternativa literal do CNU 2024. É **T6**, conceito certo com justificativa falsa.
> ==Simplicidade não define camada; ter porta e entregar ao processo define.==

> [!pegadinha] P3 — IP, ICMP, ARP e IGMP oferecidos como transporte
> A errada mais frequente do assunto inteiro. Numa lista de siglas,
> ==primeiro elimine tudo o que não tem porta== — sobram TCP, UDP e, raramente, SCTP.

> [!pegadinha] P4 — "TCP e UDP" contra "UDP e TCP", e FIN na abertura
> A questão da própria TRANSPETRO 2023 tem gabarito `TCP e UDP` e uma alternativa `UDP e TCP`:
> é o **T4** canônico. ==Tendo a pergunta a palavra "respectivamente", leia a ordem duas vezes.==
> Pela mesma lógica, duas alternativas da questão do handshake põem **FIN** na terceira etapa.

> [!pegadinha] P5 — A camada de sessão parece a dona do diálogo
> Numa questão do BANESE 2025 sobre a camada de **sessão**, uma alternativa é a definição literal
> e correta da de **transporte** — é **T3**, e ==quem estudou transporte na véspera marca e
> erra==. O discriminante da sessão é *controle de diálogo, gerenciamento de token e
> sincronização*.

## Questões

> [!nota] Só as duas de conferência estão aqui
> Pela regra das 24 horas, no dia da leitura você resolve **duas ou três** questões, só para
> aferir se a leitura pegou — copiadas sem uma vírgula de diferença da versão completa. São as
> **duas de prova TRANSPETRO da nossa ênfase**: a questão-mãe de 2018 e a de 2023 que descreve
> a camada de transporte inteira e pede o nome dela.
>
> **As outras dez** — TRANSPETRO 2023 dos cargos Informática e Segurança Cibernética, CNU 2024
> (duas), IPEA 2024 (três), BASA 2024, BANESE 2025 e UNEMAT 2024 — ficam na **versão
> completa**, com o gabarito comentado nomeando o tipo de distrator. Elas são o aquecimento das
> sessões seguintes e o material do bloco de sábado, não são para hoje.

### Q01 · TRANSPETRO 2018 · questão 45

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 45
> A única questão de prova da nossa ênfase indexada diretamente em "TCP e UDP". Ela cobra o
> assunto pelo ângulo mais difícil: não pergunta qual protocolo é confiável, e sim qual
> serve para uma aplicação que **precisa enxergar a perda**.
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
> **Gabarito: A — UDP.** O programa quer **medir perda**. Se ele usasse TCP, a perda seria
> invisível: o TCP detecta o segmento que faltou, retransmite por RTO ou por retransmissão
> rápida e entrega tudo à aplicação em ordem — a estatística de "pedaços perdidos" daria
> zero sempre. Só o UDP deixa a perda chegar até a aplicação, porque não retransmite. O
> "após um intervalo, caso o pedaço não chegue" do enunciado é o programa **implementando
> na aplicação** o temporizador que o UDP não tem.
>
> - **b) FTP** — protocolo real, mas de **aplicação**, e o enunciado exige "nível de transporte". Distrator **T2** (irmão taxonômico da camada errada).
> - **c) TCP** — é transporte de verdade e é o par oposto do gabarito. Distrator **T2/T4**: quem lê só "transferindo pedaços de arquivo" marca TCP por reflexo, sem perceber que o requisito é enxergar a perda.
> - **d) DNS** — aplicação. **T2**.
> - **e) HTTP** — aplicação. **T2**.
>
> Repare que **quatro das cinco alternativas nem são de transporte**. Aplicando a regra da
> seção 7 — eliminar tudo o que não tem porta própria de transporte — a questão vira uma
> escolha entre duas.

### Q03 · TRANSPETRO 2023 · questão 48

> [!fonte] Fonte: prova TRANSPETRO 2023, questão 48
> O molde dominante da ênfase 4: enunciado de 70 palavras que descreve a camada
> corretamente e por inteiro, alternativa de duas palavras. Ela vale por ser um dicionário
> das expressões que a banca usa para dizer "transporte".
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2694703)

O modelo de referência OSI (Open Systems Interconnection) foi desenvolvido como um modelo
para arquitetura de protocolos de comunicação entre sistemas. As funções de comunicação são
particionadas numa hierarquia de sete camadas, na qual cada uma realiza um subconjunto das
funções exigidas para comunicação com outro sistema. Dentre essas camadas, há uma que
fornece um serviço orientado à conexão e que possibilita a transferência confiável e
transparente de dados entre as extremidades, além de oferecer recuperação de erro e controle
de fluxo de ponta a ponta. A camada que realiza o subconjunto de funções descrito é a

- [ ] física
- [ ] de enlace
- [ ] de rede
- [x] de transporte
- [ ] de apresentação

> [!gabarito]-
> **Gabarito: D — de transporte.** Três expressões do enunciado apontam para lá, e nenhuma
> delas é dispensável: *"orientado à conexão"*, *"entre as extremidades"* e *"de ponta a
> ponta"*. Guarde as três — elas se repetem em quatro das questões desta aula.
>
> - **a) física** — trata do fluxo de bits no meio; não tem noção de conexão nem de erro fim a fim. **T2** (camada real, atributo errado).
> - **b) de enlace** — ==é a errada perigosa==: o enlace **também** faz controle de erro e de fluxo. O que o elimina é "entre as extremidades" e "de ponta a ponta" — o enlace age entre nós **adjacentes**, um salto por vez. **T2** com discriminante escondido.
> - **c) de rede** — endereça e roteia; o serviço do IP é **não** confiável e **sem** conexão, o oposto do descrito. **T2**.
> - **e) de apresentação** — sintaxe, codificação, compressão e cifra. **T2**.


## Figuras pendentes

**Nenhuma.** Todas as questões deste assunto têm enunciado e alternativas em texto.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores** · Assunto: `Protocolos de Transporte` › **`TCP e
UDP`**, com a banca **CESGRANRIO** marcada. Lembre que ==metade das questões deste assunto está
catalogada sob outro rótulo== (Modelo OSI, Algoritmos de Detecção de Erros, ICMP, Segurança em
Correio Eletrônico), então o filtro sozinho traz menos do que existe. A tabela completa de
complementos está na versão completa da aula.

> [!checklist]
> - **Buraco 1 → porta, os dois fazem. Buraco 2 → confiabilidade, só o TCP.**
> - Cabeçalhos: **TCP 20, UDP 8**. Protocolo IPv4: **6 TCP, 17 UDP, 1 ICMP, 2 IGMP**.
> - **SYN → SYN+ACK → ACK** abre; **FIN, ACK, FIN, ACK** fecha. ==SYN e FIN nunca se cruzam.==
> - **Fluxo protege o receptor e é anunciado; congestionamento protege a rede e é estimado.**
> - **Não existe NAK no TCP.** Três ACKs duplicados = retransmissão rápida.
> - UDP: **sem sequência, sem ACK, sem janela, sem flags** — e fronteira de mensagem preservada.
> - **As portas UDP:** 53, 67/68, 69, 123, 161/162, 514, 1812/1813. **25 relay × 587 submission.**
> - **Sem porta não é transporte:** IP, ICMP, ARP e IGMP estão fora.
