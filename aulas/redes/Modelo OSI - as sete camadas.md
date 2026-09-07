---
id: R01
titulo: Modelo OSI: as sete camadas e o que cada uma resolve
resumo: Ao terminar, você diz de cabeça em que camada vive cada equipamento e cada protocolo — que é a forma como a CESGRANRIO pergunta isso.
tempo: 45 min
---

> [!banca]
> Quase nunca a definição do modelo. O que cai é **associação**: dado um equipamento,
> protocolo ou função, em que camada ele está. É cobrança *conceitual e direta*,
> de resposta curta — o tipo de questão que se ganha ou se perde em dez segundos.
>
> Este é o assunto de Redes mais cobrado nas provas da TRANSPETRO: **3 das 70 questões
> em 2018** (Q41, Q42, Q43) e **1 em 2023** (Q48). Quatro pontos em duas provas, no mesmo
> assunto, com a mesma abordagem. As quatro estão resolvidas no fim desta aula.

## Por que o modelo existe

Antes da padronização, cada fabricante fazia sua própria pilha e os equipamentos não
conversavam. A ISO propôs dividir a comunicação em **sete camadas independentes**: cada
uma resolve um problema e entrega o resultado para a de cima, sem precisar saber como as
outras funcionam por dentro.

O OSI é um *modelo de referência* — didático, não implementado literalmente. Quem roda na
prática é o TCP/IP. Guarde essa distinção: ela já foi alternativa de prova.

## As sete camadas

| # | Camada | Resolve | PDU | Exemplos |
|---|---|---|---|---|
| 7 | **Aplicação** | Interface com o programa do usuário | Dados | HTTP, FTP, SMTP, DNS, SNMP |
| 6 | **Apresentação** | Formato, criptografia e compressão | Dados | TLS/SSL, JPEG, ASCII |
| 5 | **Sessão** | Abre, mantém e encerra o diálogo | Dados | NetBIOS, RPC, PPTP |
| 4 | **Transporte** | Entrega fim a fim, portas, confiabilidade | Segmento / Datagrama | TCP, UDP |
| 3 | **Rede** | Endereçamento lógico e roteamento | Pacote | IP, ICMP, roteador |
| 2 | **Enlace** | Endereço físico (MAC) e detecção de erro | Quadro | Ethernet, switch, ARP |
| 1 | **Física** | Bits no meio: tensão, luz, rádio | Bit | Cabo, hub, repetidor, RJ-45 |

> [!decore]
> De baixo para cima: *Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação*.
> A frase que funciona: **"Fernando Escreveu Rápido Três Sonetos Para Ana"**.
>
> E a PDU, de baixo para cima: **bit → quadro → pacote → segmento**. Esta sequência de
> quatro palavras já valeu questão inteira.

## Cada camada, com o detalhe que a banca cobra

**1 · Física.** Só bits: tensão, pinagem, conector, tipo de cabo, modulação. Todo defeito
de *hardware de transmissão* mora aqui — cabo partido, conector com mau contato,
interferência. Equipamentos: hub, repetidor, transceiver, o próprio cabo.

**2 · Enlace.** Organiza os bits em quadros, endereça por **MAC** dentro do mesmo segmento
e detecta erro pelo FCS. Equipamentos: switch e bridge. Protocolos: Ethernet, PPP, HDLC,
ARP. Subdivide-se em LLC e MAC — detalhe que aparece em alternativa.

**3 · Rede.** Endereço **lógico** (IP) e escolha de caminho entre redes diferentes.
Equipamento: roteador. Protocolos: IP, ICMP, OSPF, RIP, BGP.

**4 · Transporte.** Entrega **fim a fim** entre processos, identificados por porta. É onde
mora a diferença entre *confiável* (TCP: conexão, confirmação, retransmissão, controle de
fluxo, recuperação de erro ponta a ponta) e *não confiável* (UDP).

**5 · Sessão.** Abre, mantém, sincroniza e encerra o diálogo. Pontos de sincronização e
retomada. É a camada mais esquecida — e por isso a mais usada como distrator.

**6 · Apresentação.** *Como o dado está escrito*: formato, codificação de caracteres,
compressão e **criptografia**.

**7 · Aplicação.** A interface com o programa do usuário: HTTP, SMTP, FTP, DNS, SNMP.

## Encapsulamento

Descendo a pilha, cada camada acrescenta o seu próprio cabeçalho ao que veio de cima.
Subindo do outro lado, cada camada retira o cabeçalho que é seu. É por isso que o nome da
unidade muda a cada nível — o conteúdo é o mesmo, o que muda é quanto cabeçalho está
grudado nele.

```
[ Dados                                    ]  camada 7
[ TCP | Dados                              ]  camada 4  -> segmento
[ IP  | TCP | Dados                        ]  camada 3  -> pacote
[ ETH | IP  | TCP | Dados | FCS            ]  camada 2  -> quadro
 101000110101110010101110101011...            camada 1  -> bits
```

> [!nota]
> Só a camada 2 põe informação também *no fim* do bloco: o FCS, que serve para detectar
> erro. As demais só acrescentam cabeçalho na frente.

## A "camada mais alta em que o equipamento opera"

Enunciado clássico da TRANSPETRO (caiu exatamente assim em 2018). A lógica: o equipamento
opera até a camada em que ele **toma decisão**.

| Equipamento | Camada mais alta | Decide com base em |
|---|---|---|
| Cabo, conector, repetidor, **hub** | **1** | nada — só repete o sinal |
| **Switch**, bridge | **2** | endereço MAC |
| **Roteador** | **3** | endereço IP |
| Firewall de estado | 4 | porta e estado da conexão |
| **Servidor** (correio, web) | **7** | a aplicação em si |

O ponto que derruba: **servidor de e-mail e servidor web estão os dois na camada 7**.
A tentação é pôr o de e-mail em 6, porque "apresentação" soa como formatação de mensagem.
Não é. SMTP é aplicação.

## Onde a banca derruba

> [!pegadinha] Switch e roteador
> **Switch é camada 2** (decide por MAC), **roteador é camada 3** (decide por IP),
> **hub é camada 1** (só repete o sinal elétrico, sem decidir nada). Quando o enunciado
> disser "switch layer 3", ele está falando de um switch com função de roteamento
> embutida — a exceção que confirma a regra.

> [!pegadinha] Onde fica a criptografia
> No modelo OSI, criptografia é **camada 6, Apresentação**. A alternativa errada quase
> sempre oferece Sessão ou Aplicação. Guarde: Apresentação cuida de *como o dado está
> escrito* — formato, compressão e cifra.

> [!pegadinha] A camada do ARP
> O ARP traduz IP em MAC, então parece de camada 3. A resposta esperada em prova é
> **camada 2**, porque ele opera com quadros dentro do mesmo segmento de rede. Alguns
> autores dizem "entre 2 e 3" — se as duas opções aparecerem, marque a 2.

> [!pegadinha] Nome trocado no meio da lista
> A banca escreve as sete camadas na ordem certa e troca **uma só**: "nível lógico" no
> lugar de aplicação, "nível de criptografia" no lugar de sessão, "nível de internet" no
> lugar de aplicação. Caiu assim em 2018. Leia a lista inteira até o fim — o erro costuma
> estar no último item, quando você já decidiu que estava certa.

> [!pegadinha] A contagem invertida
> Enunciados dizem "a terceira camada" ou "a camada imediatamente superior à de
> transporte". A contagem oficial é **de baixo para cima**: a terceira é Rede, e acima de
> Transporte vem Sessão.

## Questões

### Q01 · TRANSPETRO 2018 · questão 41

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 41
> O enunciado clássico da banca para este assunto: dá uma lista de equipamentos e
> pede a camada de cada um, na ordem.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638681)

Uma grande empresa tem vários equipamentos de rede e servidores instalados em seu parque
computacional. Dentre esses equipamentos encontram-se: (i) 1 roteador de saída para a
internet; (ii) 3 Switches Ethernet compondo um backbone interno de interligação da
empresa; (iii) 10 Hubs (repetidores) usados para interconectar estações terminais de
usuários em várias redes locais; (iv) 1 servidor de correio eletrônico; (v) 1 servidor de
páginas WWW.

Do ponto de vista do modelo de referência OSI da ISO, os equipamentos descritos nos itens
(i) a (v), nessa ordem, têm funcionando, como camada mais alta de protocolo, os níveis

- [ ] 1, 2, 3, 6 e 7
- [ ] 3, 2, 1, 6 e 7
- [x] 3, 2, 1, 7 e 7
- [ ] 3, 2, 2, 6 e 7
- [ ] 4, 3, 2, 7 e 7

> [!gabarito]-
> **Gabarito: C.** Aplique a tabela da seção anterior, na ordem do enunciado:
> roteador = **3**, switch = **2**, hub = **1**, servidor de correio = **7**,
> servidor WWW = **7**.
>
> Todo o peso da questão está nos dois últimos. As alternativas A, B e D oferecem **6**
> para o servidor de correio — a armadilha de achar que e-mail é "apresentação". Não é:
> SMTP é protocolo de aplicação, camada 7, igual ao HTTP.
>
> A alternativa E desloca tudo uma camada para cima (4, 3, 2) e pega quem contou a partir
> do 2 em vez do 1. A alternativa D põe hub em 2, confundindo repetidor com switch.

### Q02 · TRANSPETRO 2018 · questão 42

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 42
> Mesma prova, outro ângulo: em vez de equipamento, um defeito físico. Testa se
> você sabe separar onde o problema está de quem o detecta.
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
> **Gabarito: B.** Conector, cabo e mau contato são meio de transmissão: **camada 1,
> física**. A regra prática: se o defeito é em algo que você pega com a mão, é camada 1.
>
> O distrator forte é **E, enlace de dados**. Enlace é onde se *detecta* o erro (o FCS
> acusa o quadro corrompido), mas a *causa* está na física. A banca separa causa de
> sintoma — e a pergunta é sobre onde está o problema, não sobre quem o percebe.

### Q03 · TRANSPETRO 2018 · questão 43

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 43
> Memorização pura da ordem das sete camadas. Três questões de OSI na mesma prova
> — é o peso que este assunto tem na TRANSPETRO.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638830)

O modelo OSI possui sete níveis de protocolos. Tais níveis são os seguintes:

- [ ] Físico; enlace de dados; rede; transporte; sessão; apresentação e **nível lógico**
- [ ] Físico; enlace de dados; rede; transporte; **nível de criptografia**; apresentação e aplicação
- [ ] Físico; enlace de dados; rede; transporte; **nível de banco de dados**; apresentação e aplicação
- [x] Físico; enlace de dados; rede; transporte; sessão; apresentação e aplicação
- [ ] Físico; enlace de dados; rede; transporte; sessão; apresentação e **nível de internet**

> [!gabarito]-
> **Gabarito: D.** É a única lista correta e completa.
>
> Questão de pura memorização, e o método é o mesmo em todas: as cinco alternativas
> começam iguais. **Leia só o que diferencia.** A troca está sempre em uma posição:
> na 5ª (criptografia, banco de dados) ou na 7ª (lógico, internet).
>
> Repare que "nível de internet" existe de verdade — mas no modelo **TCP/IP**, não no OSI.
> É o distrator mais elegante da questão: um termo correto, no modelo errado.

### Q04 · TRANSPETRO 2023 · questão 48

> [!fonte] Fonte: prova TRANSPETRO 2023, questão 48
> Prova mais recente e a mais próxima do edital de 2026. Como o conteúdo
> programático de 2026 é 95,7% igual ao de 2023, esta é a questão desta aula com
> maior chance de se repetir em formato.

O modelo de referência OSI foi desenvolvido como um modelo para arquitetura de protocolos
de comunicação entre sistemas. As funções de comunicação são particionadas numa hierarquia
de sete camadas, na qual cada uma realiza um subconjunto das funções exigidas para
comunicação com outro sistema. Dentre essas camadas, há uma que fornece um serviço
orientado à conexão e que possibilita a transferência confiável e transparente de dados
entre as extremidades, além de oferecer recuperação de erro e controle de fluxo de ponta a
ponta. A camada que realiza o subconjunto de funções descrito é a

- [ ] física
- [ ] de enlace
- [ ] de rede
- [x] de transporte
- [ ] de apresentação

> [!gabarito]-
> **Gabarito: D.** Três expressões do enunciado apontam para a mesma camada:
> *"orientado à conexão"*, *"entre as extremidades"* e *"de ponta a ponta"*. Fim a fim é a
> definição de **transporte**, camada 4 — e é o TCP sendo descrito sem ser nomeado.
>
> O distrator é **B, enlace**. Enlace também faz detecção de erro e controle de fluxo, mas
> apenas **entre dois nós adjacentes**, nunca ponta a ponta. A expressão "entre as
> extremidades" é o que elimina enlace — e é a palavra que a banca põe de propósito.
>
> Compare com a Q42 de 2018: as duas testam a mesma habilidade — ler o enunciado e achar a
> palavra que fixa a camada. Em 2018 foi "conector"; em 2023 foi "ponta a ponta".

### Q05 · Inédita

> [!fonte] Fonte: questão inédita, não caiu em prova
> Escrita com base no padrão de associação identificado nas quatro questões acima.
> Cobre a camada 6, que aparece como distrator nas outras e nunca foi cobrada
> diretamente pela TRANSPETRO.

Um analista precisa cifrar o conteúdo de uma mensagem antes que ela seja transmitida e,
além disso, garantir que o receptor consiga interpretar a codificação de caracteres
utilizada. No modelo OSI, essas duas funções pertencem à camada de

- [ ] sessão
- [ ] aplicação
- [x] apresentação
- [ ] transporte
- [ ] enlace de dados

> [!gabarito]-
> **Gabarito: C.** Criptografia e codificação de caracteres são as duas funções clássicas
> da **camada 6, apresentação** — ela cuida de *como o dado está escrito*.
>
> **A, sessão** é o distrator principal, por vizinhança na pilha. **B, aplicação** pega
> quem pensa em TLS/HTTPS na prática, onde a cifra aparece junto da aplicação; no modelo
> OSI, porém, o lugar formal da criptografia é a camada 6.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Modelos de Referência de Redes` › **`Modelo OSI`** |
| Hierarquia | `03.01` |
| Questões no acervo | 2.106 (667 comentadas) |
| No seu caderno CESGRANRIO | 7 |

Marque também a banca **CESGRANRIO**. Se sobrarem menos de 20 questões, tire o
filtro de banca: o conceito não muda entre bancas e o treino de leitura vale.

**Complementos, para o resto da semana**

| Assunto | Hierarquia | Questões | Por quê |
|---|---|---:|---|
| `Componentes Físicos de Redes` › **`Equipamentos de Redes (Roteador, Switch, Hub, etc.)`** | `08.01` | 2.158 | É a outra metade da Q41 de 2018 |
| **`Topologias de Redes`** | `02` | 1.084 | Assunto da Q40 de 2018, vizinha de prova |
| `Modelos de Referência de Redes` › **`Arquitetura TCP/IP`** | `03.02` | 1.560 | Par do OSI, cai junto; será o filtro da aula R03 |

> [!nota]
> Os nomes acima são os do TecConcursos, tirados da árvore real em
> `dados/assuntos-tec.json`. Navegue por eles no site: **Questões → Filtrar por
> matéria → TI - Redes de Computadores** e depois abra a hierarquia indicada.
> Para achar o assunto de qualquer outra aula:
> `python ferramentas/assuntos.py <palavra-chave>`

> [!checklist]
> - Ordem de baixo para cima: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação.
> - PDU: bit → quadro → pacote → segmento.
> - Hub = 1, switch = 2, roteador = 3, servidor = 7. ARP = 2.
> - Criptografia e compressão = camada 6, Apresentação.
> - "Ponta a ponta" e "orientado à conexão" = transporte. "Entre nós adjacentes" = enlace.
> - Defeito em cabo ou conector = camada 1, mesmo que quem detecte seja a 2.
