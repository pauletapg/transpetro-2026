---
resumo_de: R02
titulo: Encapsulamento: PDU, cabeçalho e payload (versão resumida)
resumo: A mesma aula dentro da fatia: PDU = PCI + SDU, as cinco unidades com o tamanho de cabeçalho de cada uma, os campos que costuram as camadas na subida, e a diferença entre segmentar e fragmentar.
tempo: 45 min
---

> [!nota] Esta é a versão resumida — a que cabe no dia
> Lida de uma vez, a completa pede **137 min**; esta fecha em **45**. Nada que decide
> gabarito ficou de fora: as cinco PDUs com o tamanho de cabeçalho, os campos de
> demultiplexação, o que muda a cada salto, MTU × MSS e o par segmentar × fragmentar.
>
> **Ficou só na completa:** as analogias com o limite declarado, a fragmentação calculada
> fragmento a fragmento, o HDLC, o `tcpdump` comentado byte a byte e **8 das 10 questões**.
>
> **Leia a completa na primeira vez** — três quartos dela são pré-requisito declarado de R03,
> R04, R06 e R07 a R10. Volte a esta no aquecimento e na véspera, pelo botão **completa |
> resumida** do topo.

> [!banca]
> **Itens 1.1e e 1.1f do edital 2026.** Cobrança **conceitual e de vocabulário**: dado um
> verbo ("segmenta", "fragmenta", "enquadra", "encapsula") ou um nome de unidade ("segmento",
> "datagrama", "pacote", "quadro"), dizer de que camada aquilo é.
>
> **Caiu zero vezes como assunto principal em 2018 e 2023** — e isso não o torna frio: o
> encapsulamento é a máquina por trás de 2018 Q41, Q42, Q43 e 2023 Q48, Q53. Com nome próprio
> ele aparece é no caderno CESGRANRIO recente. Distratores: **T4** (troca o nome da unidade
> entre camadas vizinhas) e **T2** (oferece a camada vizinha).

---

## 1 · O problema, e a regra de uma linha

R01 estabeleceu que as camadas são independentes; falta responder **como**, já que os dados
de todas elas viajam pelo mesmo cabo num fluxo único. Se cada camada escrevesse num cabeçalho
comum, acrescentar um campo no IP deslocaria os campos do TCP, e o roteador teria que entender
protocolos de aplicação que nem existiam quando ele foi fabricado.

**O encapsulamento** é a solução: cada camada, ao receber um bloco da camada de cima, **não o
abre e não o altera** — trata como carga opaca, gruda o **seu** cabeçalho na frente e entrega
para baixo; do outro lado, cada camada retira exatamente o cabeçalho que é seu e passa o miolo
para cima sem olhar. ==A camada N nunca interpreta o conteúdo da camada N+1.== Essa frase é o
assunto inteiro.

**O cenário desta aula**, o mesmo de R01: notebook `10.20.30.40/24`, MAC
`A4:BB:6D:11:22:33`; gateway `10.20.30.1`, MAC `00:1A:2B:3C:4D:5E`; servidor
`200.150.10.80`, porta `80`; sua porta de origem, `51344`. O navegador entregou **120 bytes**
de HTTP para descer — guarde o 120: ele vira 140, 160, 178 e 186, e cada salto é um cabeçalho.

## 2 · PDU, SDU e PCI

A norma ISO/IEC 7498 dá nome a três coisas, e as três explicam uma à outra.

- **PDU** (*Protocol Data Unit*) é o bloco completo que uma camada monta e entrega à de
  baixo: **o cabeçalho dela mais tudo o que veio de cima**. A PDU da camada 4, no cenário,
  tem 140 bytes: 20 de TCP mais os 120 de HTTP.
- **SDU** (*Service Data Unit*) é o que a camada N recebeu da N+1 e trata como opaco. A
  relação exata, e vale decorar: ==a PDU da camada N+1 é a SDU da camada N.== Em prova a SDU
  aparece quase sempre pelos sinônimos **payload** ou **carga útil**. Aqueles 140 bytes são,
  para a camada 3, só carga: ela põe 20 na frente e chama os 160 de PDU **dela**.
- **PCI** (*Protocol Control Information*) são os campos que a camada acrescenta por conta
  própria — o **cabeçalho** e, num caso só, o **fecho** (*trailer*), depois da carga.

```
PDU(N)  =  PCI(N) + SDU(N)  =  cabeçalho da camada N + PDU(N+1)
```

==Só a camada 2 acrescenta informação no FIM do bloco.== Todas as outras acrescentam apenas
na frente — por isso a alternativa que diz "cada camada acrescenta um cabeçalho e um rodapé"
está errada: vale para a 2 e só para ela.

## 3 · As cinco PDUs

É o miolo do assunto: quatro das dez questões da versão completa são decididas por saber qual
nome de unidade pertence a qual camada, e nada mais.

**Bit — camada 1.** A física **não encapsula**: converte o quadro em sinal e transmite. O que
ela põe no cabo é sinalização que **não faz parte do quadro** — 7 bytes de **preâmbulo** e 1 de
**SFD** (*Start Frame Delimiter*), para os relógios se alinharem. A camada 1 não sabe o que é
byte: agrupar bits em blocos com começo e fim é serviço da 2.

**Quadro (*frame*) — camada 2.** Faz o **enquadramento**: delimita o bloco e acrescenta
cabeçalho **e** fecho. No Ethernet II o cabeçalho tem **14 bytes** — MAC de destino (6), de
origem (6) e **EtherType** (2), que diz qual protocolo está lá dentro — e o fecho tem **4**, o
**FCS** (*Frame Check Sequence*), um **CRC-32** sobre o quadro inteiro; não batendo, o quadro
é **descartado em silêncio**. O campo de dados vai de **46 a 1500 bytes**: o teto é a MTU, e
abaixo do piso de 46 entra **preenchimento** (*padding*) de zeros, porque um quadro curto
demais terminaria antes de a colisão voltar — um `ACK` puro do TCP (40 bytes de carga) vira um
quadro de **64 bytes com zero byte de conteúdo útil**. Para preencher o MAC de destino a
estação precisa descobri-lo, e só conhece o IP: quem traduz é o **ARP** (*Address Resolution
Protocol*), perguntando em *broadcast* *"quem tem 10.20.30.1?"*.
==Sem ARP o quadro não fica pronto.== Não confunda o ARP com o **ICMP** (erro e
alcançabilidade, o protocolo do `ping`) nem com o **IGMP** (grupos de *multicast*).

**Pacote — camada 3.** Cabeçalho de **20 bytes** (IPv4 sem opções; máximo 60) com os dois IPs,
o **TTL** e o campo **Protocolo**. É a única PDU que atravessa a viagem inteira sem ser
refeita: mudam nela só o TTL e o *checksum* do cabeçalho, recalculado por causa dele.
==Se o enunciado disser "datagrama IP", é camada 3;== perto de porta ou aplicação, é UDP.

**Segmento — camada 4, no TCP.** O TCP corta o fluxo da aplicação (a **segmentação**) e põe
**20 bytes** de cabeçalho: portas, **número de sequência**, **número de reconhecimento**,
**janela**, *checksum* e os **bits de controle** — as *flags* de um bit: `SYN` **abre** e
sincroniza a numeração, `ACK` **confirma**, `FIN` **encerra**, `RST` derruba à força, `PSH`
pede entrega imediata, `URG` marca dado urgente.
==`SYN` é de abertura e `FIN` é de encerramento: nunca aparecem no mesmo passo.==

**Datagrama — camada 4, no UDP.** O UDP põe **8 bytes** e nada mais: porta de origem, porta de
destino, **comprimento** e **checksum**. Sem número de sequência, sem ACK, sem janela — por
isso cada bloco é independente dos outros, que é o que a palavra **datagrama** significa. Ele
==economiza 12 bytes por bloco e o custo inteiro do handshake==.

> [!decore]
> De baixo para cima: **bit → quadro → pacote → segmento (TCP) ou datagrama (UDP)**.
> Da camada 5 para cima não há PDU com nome próprio: chama-se **dados** ou **mensagem**.
> Cabeçalhos, em bytes: **14+4 · 20 · 20 (TCP) ou 8 (UDP)**.

## 4 · A descida, com os bytes na mão

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

58 bytes de cabeçalho para 120 de conteúdo: **32,6% do quadro é invólucro**. Esse
**overhead** é péssimo para blocos pequenos e ótimo para grandes — num quadro cheio, os mesmos
58 bytes são 3,8%. Um analisador mostraria **174**, não 178, porque a placa já removeu o FCS
depois de conferir o CRC: 174 no software, 178 no cabo, 186 no meio físico.

## 5 · A subida: como cada camada sabe para quem entregar

Descer é fácil, a camada sabe quem a chamou. **Subir é o problema:** retirados os 14 bytes do
Ethernet, sobram 160 — como saber que aquilo é IPv4, e não IPv6 ou ARP? Pelo **campo de
demultiplexação**: um número, tirado de um registro público da **IANA**, que identifica o
protocolo da camada de cima.

| Camada que entrega | Campo no cabeçalho | No exemplo | Significa |
|---|---|---|---|
| 2 → 3 | **EtherType** (2 bytes) | `0x0800` | IPv4 (`0x0806` = ARP, `0x86DD` = IPv6) |
| 3 → 4 | **Protocolo** (1 byte) | `6` | TCP (`17` = UDP, `1` = ICMP, `50` = ESP do IPsec) |
| 4 → 7 | **Porta de destino** (2 bytes) | `80` | o processo do servidor web |

**Multiplexação** é a operação na descida, **demultiplexação** é a subida: um único cabo
carrega ao mesmo tempo seu navegador, seu e-mail e o `ping` do colega, e são esses três campos
que os mantêm separados. O último degrau decide questão — a porta identifica um **protocolo de
aplicação** (`80` HTTP, `443` HTTPS, `21`/`20` FTP, `25` SMTP, `53` DNS, `22` SSH, `23`
Telnet), e ==FTP, SMTP, DNS e HTTP são de aplicação, não de transporte:== eles *usam* TCP ou
UDP; nenhum deles **é** TCP ou UDP.

## 6 · O quadro é refeito a cada salto; o pacote não

Chegando o quadro ao roteador, a camada 2 dele confere o FCS, retira os 14 bytes e **joga o
quadro fora**; a camada 3 lê o IP de destino, consulta a tabela de rotas, decrementa o TTL e
recalcula o *checksum*; a camada 2 monta um **quadro novo**, com o MAC do roteador como origem
e um FCS novo. Não existe quadro que percorra dois enlaces.

| O que muda a cada salto | O que não muda de ponta a ponta |
|---|---|
| MAC de origem e MAC de destino | IP de origem e IP de destino |
| O quadro inteiro (cabeçalho e FCS) | Portas de origem e de destino |
| TTL (−1) e *checksum* do cabeçalho IP | Os dados da aplicação |
| A tecnologia de enlace (Ethernet, PPP, Wi-Fi…) | O campo Protocolo |

==Endereço IP é de ponta a ponta; endereço MAC é de salto em salto.== A alternativa que diz
que o MAC de destino é o da máquina final está errada sempre que houver um roteador no
caminho — é o distrator preferido do assunto.

Daí sai a tabela de equipamento de R01, vista por outro ângulo: cada um desencapsula só até o
cabeçalho de que precisa para decidir — e ==quanto mais fundo desencapsula, mais lento e mais
caro ele é==. O **switch** para no MAC e nem olha o pacote IP, e por isso não aparece num
`traceroute`: só roteador decrementa TTL.

## 7 · MTU, MSS e fragmentação

**MTU** (*Maximum Transmission Unit*) é o teto de carga de um enlace: ==o maior payload que
cabe num quadro — 1500 bytes no Ethernet==, sem contar os 18 do próprio Ethernet (um quadro
cheio tem 1518). **MSS** (*Maximum Segment Size*) é o teto do lado do TCP — quantos bytes **de
aplicação** cabem num segmento:

```
MSS = MTU − cabeçalho IP − cabeçalho TCP  =  1500 − 20 − 20 = 1460 bytes
```

Os dois lados anunciam a MSS no `SYN`, e vale a menor — por isso a segmentação é a solução
**preferida**: o TCP corta no tamanho certo e nada precisa ser remendado adiante.

**A fragmentação** é o remédio para quando isso falha — um pacote já formado encontra um
enlace de MTU menor, e a camada 3 do roteador o quebra em fragmentos, cada um com uma cópia do
cabeçalho IP. ==Quem remonta é a camada 3 do destino final, nunca um roteador intermediário.==
Três campos do IPv4 existem só para isso: **Identificação** (o mesmo número em todos os
fragmentos de um pacote), **Flags** (**DF**, *Don't Fragment*, e **MF**, *More Fragments* — o
último tem MF = 0) e o **deslocamento do fragmento**, em unidades de **8 bytes**. Perder **um**
fragmento obriga a retransmitir o pacote **inteiro**. No **IPv6**,
==roteador não fragmenta==: descarta e devolve um ICMPv6 *Packet Too Big*, e a origem é que
reduz — por isso o cabeçalho IPv6 é fixo em **40 bytes**, sem fragmentação e sem *checksum*, e
o TTL vira **Limite de saltos** (*Hop Limit*).

| | **Segmentação** | **Fragmentação** |
|---|---|---|
| Camada | **4** (transporte) | **3** (rede) |
| Quem faz | a origem, sempre | qualquer roteador do caminho (só IPv4) |
| Por quê | o fluxo da aplicação é grande demais | o pacote é maior que a MTU do próximo enlace |
| Limite que respeita | **MSS** (1460) | **MTU** (1500) |
| Quem remonta | o TCP do destino, pelo nº de sequência | o IP do destino, por Identificação + deslocamento |
| Evitável? | não, é o funcionamento normal | sim, e deve ser: use a MSS correta |

**O outro encapsulamento.** No **tunelamento** — item 1.1g do edital, que caiu nas **duas**
provas — um pacote completo vira **carga** de outro pacote da **mesma camada**: o IP privado
`10.20.30.40 → 10.90.0.5` entra inteiro num IP público e só é desembrulhado na outra ponta.
**IPsec ESP** (*Encapsulating Security Payload*) cifra e encapsula o pacote original inteiro;
**IPsec AH** (*Authentication Header*) acrescenta um cabeçalho só de autenticação e
==não cifra== — foi isso que caiu em 2023 (Q42). Cada túnel come MTU: um ESP típico derruba a
útil para ~1440, e é a causa número um de "a VPN conecta, mas página grande não abre".

## 8 · Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "segmenta os dados", "divide o fluxo em segmentos" | **camada 4** | fragmentação, da 3 |
| "fragmenta", "divide em unidades menores que a MTU" | **camada 3** | segmentação, da 4 |
| "transforma esses segmentos em pacotes" | **camada 3** recebendo a PDU da 4 | camada 2 |
| "datagrama", com porta ou transporte por perto | **UDP**, camada 4 | segmento, que é TCP |
| "datagrama IP" | o **pacote**, camada 3 | datagrama UDP |
| "traduzir o IPv4 no endereço físico da interface" | **ARP** | DNS, que traduz nome em IP |
| "encapsula o pacote original inteiro" | **túnel** (IPsec ESP) | AH, que só autentica |

## Onde a banca derruba

> [!pegadinha] "um cabeçalho chamado segmento"
> A alternativa A do CNU 2024 diz que o UDP *"encapsula o dado na camada de transporte em um
> cabeçalho chamado segmento"*. São **dois** erros num pedaço de frase: segmento não é
> cabeçalho, é a PDU inteira; e a PDU do UDP não é segmento, é **datagrama**. A frase soa
> técnica e passa batida em leitura rápida. Regra: cabeçalho é a parte, PDU é o todo.

> [!pegadinha] Segmentar não é fragmentar
> As duas cortam blocos grandes em menores, e a banca as troca à vontade. **Segmentar é 4 e é
> normal; fragmentar é 3 e é excepcional.** Procure a palavra vizinha: "MTU", "roteador" ou
> "deslocamento" → fragmentação; "fluxo", "MSS" ou "sequência" → segmentação.

> [!pegadinha] O rodapé generalizado, e o MAC de destino
> ==Só a camada 2 acrescenta algo no fim do bloco: o FCS.== A alternativa que generaliza o
> rodapé para todas as camadas está errada por uma palavra. E, havendo roteador no caminho, o
> MAC de destino do primeiro quadro é o **do gateway**.

## Questões

> [!nota] Só as duas de conferência estão aqui
> Pela regra das 24 horas, no dia da leitura você resolve **duas ou três** questões, só para
> aferir se a leitura pegou — copiadas sem uma vírgula de diferença da versão completa. São
> as duas que fecham o conceito central: a do **BNDES 2024**, que narra a cadeia de
> encapsulamento inteira numa frase, e a do **CNU 2024**, cujo distrator A é um erro de
> encapsulamento plantado com precisão.
>
> **As outras oito** — TRANSPETRO 2018 Q41 e Q45, UNEMAT 2024 (duas), CNU 2024 (mais duas),
> AgeRIO 2023 e IPEA 2024 — ficam na **versão completa**, com o gabarito comentado nomeando
> o tipo de distrator. Elas são o aquecimento das sessões seguintes e o material do bloco de
> sábado, não são para hoje.

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


## Figuras pendentes

**Nenhuma.** Todas as questões deste assunto têm enunciado e alternativas em texto.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores** · Assunto: `Modelos de Referência de Redes` ›
**`Modelo OSI`** (hierarquia `03.01`), com a banca **CESGRANRIO** marcada. ==Não filtre por
"Encapsulamento": esse rótulo, no TecConcursos, é o da orientação a objetos.== A tabela
completa de complementos está na versão completa da aula.

> [!checklist]
> - **PDU = PCI + SDU**; a PDU de cima é a SDU de baixo.
> - **bit → quadro → pacote → segmento (TCP) / datagrama (UDP)**.
> - Cabeçalhos: **14+4 · 20 · 20 · 8**. Carga do quadro: **46 a 1500**.
> - **Só a camada 2 põe algo no fim** do bloco: o FCS.
> - Campos que costuram a subida: **EtherType · Protocolo · Porta**.
> - **Segmentar é 4 e é normal; fragmentar é 3 e é remendo.** MSS 1460, MTU 1500.
> - **IP é ponta a ponta; MAC é salto a salto.** Roteador IPv6 não fragmenta.
> - **ESP cifra e encapsula o pacote inteiro; AH só autentica.**
