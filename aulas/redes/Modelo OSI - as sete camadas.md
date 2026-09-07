---
id: R01
titulo: Modelo OSI: as sete camadas e o que cada uma resolve
resumo: Ao terminar, você diz de cabeça em que camada vive cada equipamento, cada protocolo e cada função — e reconhece pela palavra do enunciado qual camada a banca está descrevendo sem nomear.
tempo: 45 min
---

> [!banca]
> **Item 1.1e do edital 2026.** Cobrança **conceitual e de associação**: dado um
> equipamento, um protocolo ou uma função, dizer em que camada ele está. Nunca pede
> implementação, nunca pede cálculo. É questão que se ganha ou se perde em dez segundos.
>
> **Quantas vezes caiu:** **3 das 70 questões em 2018** (Q41, Q42, Q43) e **1 em 2023**
> na nossa ênfase (Q48). O `perfil-da-banca-TRANSPETRO.md` classifica este assunto como
> **o item de redes mais recorrente do histórico** — 7º lugar entre os 15 assuntos mais
> prováveis para 2026.
>
> Além dessas quatro, esta aula traz **mais 6 questões CESGRANRIO** do seu caderno, entre
> elas **duas da própria TRANSPETRO em 2023** (cargo Informática, mesma prova, mesmo dia)
> e uma do BNDES 2024 e uma do BANESE 2025. **São 10 questões reais de banca**, mais 2
> inéditas para tapar o que nenhuma delas cobriu.
>
> **O molde:** enunciado longo e definicional, alternativa de duas ou três palavras — o
> formato que responde por 56% das questões de TI da ênfase 4. Os distratores são quase
> sempre **T2** (outra camada, que existe) e **T3** (a definição *correta* da camada
> *errada*). O perfil da banca cita a questão de OSI do BANESE como exemplo canônico de T3.

> [!nota] Esta aula é maior que a fatia dela. Como distribuir.
> A fatia de R01 no calendário é de 45 min, mas a teoria abaixo tem **5.400 palavras, 55 a
> 60 min de leitura de estudo** (medido com `python ferramentas/tamanho.py`). Não encolhi: é o assunto de redes mais cobrado do histórico,
> e a seção 4 (encapsulamento) já entrega boa parte de **R02**, que divide a segunda-feira
> com esta aula. Ou seja, o tempo não some — muda de lugar. Use a segunda inteira assim:
>
> | | |
> |---|---|
> | Teoria desta aula, seções 1 a 7 | 55 min |
> | **Q01 a Q04** — as quatro da TRANSPETRO | 16 min |
> | R02, que vira consolidação do que a seção 4 já explicou | ~15 min |
> | Checklist do fim | 5 min |
>
> **Q05 a Q12 ficam para o bloco de questões de sábado.** Elas existem para você
> reencontrar os mesmos sete conceitos com outras palavras — que é exatamente o que a prova
> vai fazer.

---

## 1 · O problema que o modelo resolve

Nos anos 1970 cada fabricante tinha a sua própria arquitetura de rede: a IBM vendia a
**SNA**, a DEC vendia a **DECnet**, a Burroughs vendia a dela. Eram pilhas fechadas. Uma
rede IBM não trocava um byte com uma rede DEC, e trocar de fornecedor significava jogar
fora o parque inteiro.

Havia um segundo problema, menos visível e mais grave: **um programa único que fizesse
tudo seria impossível de manter**. Esse programa teria que, ao mesmo tempo, gerar o pulso
elétrico no cabo, descobrir o caminho até a outra ponta, remontar mensagens que chegaram
fora de ordem e cifrar o conteúdo. Trocar o cabo coaxial por fibra obrigaria a reescrever
o programa de correio eletrônico. Não é exagero de didática: é a razão técnica de existir
o modelo.

Em 1984 a **ISO** publicou a norma **ISO/IEC 7498**, o **modelo de referência OSI** (*Open
Systems Interconnection*, "interconexão de sistemas abertos"). A ideia é dividir a
comunicação em **sete camadas independentes**, e a independência é a propriedade que
importa: *trocar a implementação de uma camada não pode obrigar a mexer nas outras*. Você
troca par trançado por fibra e altera só a camada 1; o navegador não fica sabendo.

Para isso funcionar, a palavra "camada" carrega três conceitos distintos, e a banca usa os
três:

- **Serviço** — o que a camada N oferece à camada N+1, que está logo acima dela. É o
  contrato: "me dê um bloco de bytes e um endereço, que eu entrego".
- **Protocolo** — o combinado entre a camada N de um lado e **a camada N do outro lado**.
  Camadas de mesmo nível são chamadas **camadas pares** (*peer layers*); elas conversam
  entre si como se houvesse um fio direto ligando as duas, embora na prática tudo desça
  até a camada 1 e suba de novo.
- **Interface** — como a camada de cima chama a de baixo dentro da mesma máquina.

> [!analogia] A carta e os Correios
> Você escreve a carta (7), põe num envelope de formato padronizado (6), combina com o
> destinatário que ela vai em três partes numeradas (5), contrata um serviço com aviso de
> recebimento (4), o centro de triagem decide por qual cidade a carta passa (3), o
> carteiro do bairro entrega de porta em porta (2), e o caminhão é o meio que a carrega (1).
>
> **Onde quebra — e este é ponto de prova:** nos Correios um único envelope viaja inteiro
> do começo ao fim. No OSI, **cada camada põe um envelope novo por cima**, e o envelope da
> camada 2 é **jogado fora e refeito a cada trecho da viagem**, enquanto o da camada 3
> atravessa a viagem inteira. Por isso o endereço MAC muda a cada salto e o endereço IP
> não muda. Analogia nenhuma substitui esse mecanismo.

> [!decore]
> De baixo para cima: *Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação*.
> A frase: **"Fernando Escreveu Rápido Três Sonetos Para Ana"**.
> A contagem oficial é **sempre de baixo para cima**: a 1ª é Física, a 3ª é Rede, a 7ª é
> Aplicação.

## 2 · O exemplo que atravessa a aula inteira

Fixe este cenário. Ele vai reaparecer em todas as sete seções seguintes.

Você está num notebook na rede da TRANSPETRO e digita `http://www.transpetro.com.br` no
navegador.

| Elemento | Valor |
|---|---|
| Seu notebook | IP `10.20.30.40/24`, MAC `A4:BB:6D:11:22:33` |
| Roteador de saída (gateway) | IP `10.20.30.1`, MAC `00:1A:2B:3C:4D:5E` |
| Servidor web | IP `200.150.10.80`, porta `80` |
| Porta de origem sorteada pelo seu sistema | `51344` |

## 3 · As sete camadas, uma a uma

### Camada 1 · Física

**O problema.** Um bit é uma abstração. O cabo só sabe conduzir tensão, a fibra só sabe
conduzir luz. Alguém precisa decidir que tensão significa 1, que tensão significa 0, e por
quanto tempo cada uma fica no fio.

**Como funciona.** A camada física define as características **mecânicas** (o formato do
conector RJ-45, quantos pinos tem), **elétricas** (níveis de tensão, impedância),
**funcionais** (o que cada pino faz) e **de procedimento** (a sequência para transmitir).
Define também a **codificação de linha**: no Ethernet 10Base-T usa-se *Manchester*, em que
o bit é representado por uma *transição* no meio do intervalo — subida é 1, descida é 0 —
justamente para o relógio dos dois lados não se perder.

Esta camada não sabe o que é byte, o que é endereço, nem onde um bloco de dados começa.
Ela vê um **fluxo de bits não estruturado**.

- **PDU** (*Protocol Data Unit*, a unidade de dado da camada): o **bit**.
- **Equipamentos:** cabo, conector, repetidor, **hub**, transceiver.

**No nosso exemplo:** o cabo cat 5e ligando o notebook ao switch carrega uma sequência de
pulsos elétricos no par 1-2. Se o conector estiver com mau contato, é aqui que o problema
está — e só aqui.

> [!analogia] A estrada
> A camada física é o asfalto: não sabe o que o caminhão carrega nem para onde vai.
> **Onde quebra:** a estrada é passiva e a camada física não é — ela define ativamente a
> temporização. Dois lados com relógios dessincronizados leem o mesmo sinal como bits
> diferentes, e é isso que a codificação de linha impede.

**Como a banca chama:** *"transmissão do fluxo de bits não estruturado pelo meio físico"*,
*"características mecânicas, elétricas, funcionais e de procedimento"*, *"meio físico"*.
Essa frase de quatro adjetivos é literal de prova — apareceu inteira no BANESE 2025 (Q07
desta aula).

**Não confunda com:** a **camada 2**. A física *transmite* bits; a 2 os *agrupa* e diz onde
o bloco começa e termina.

### Camada 2 · Enlace de dados

**O problema.** Dois: o meio é compartilhado (se dois computadores falam ao mesmo tempo no
mesmo cabo, os sinais se somam e nada chega), e o meio é ruidoso (um bit vira do 0 para o 1
sem avisar). Além disso, a camada 1 entrega um fluxo contínuo — alguém precisa dizer onde
uma mensagem acaba e a outra começa.

**Como funciona.** Quatro mecanismos:

1. **Enquadramento** — agrupa os bits em blocos delimitados, os **quadros** (*frames*), com
   marcas de início e fim.
2. **Endereçamento físico** — cada placa de rede tem um **MAC** (*Media Access Control*),
   número de **48 bits** gravado de fábrica, escrito como `A4:BB:6D:11:22:33`. É um
   endereço **plano**: não tem hierarquia, não dá para deduzir onde a máquina está a partir
   dele.
3. **Detecção de erro** — no fim do quadro vai o **FCS** (*Frame Check Sequence*), 4 bytes
   com um **CRC-32** calculado sobre o quadro inteiro. O receptor recalcula; se não bater,
   **descarta o quadro**. Repare: enlace **detecta e descarta, não conserta** e nem avisa a
   origem — quem vai perceber a falta é a camada 4.
4. **Controle de acesso ao meio** — no Ethernet clássico, o **CSMA/CD**: escute antes de
   falar, e se der colisão, pare e tente de novo depois de um tempo aleatório.

A camada 2 é dividida em duas subcamadas, e isso aparece como alternativa: **LLC**
(*Logical Link Control*, padrão IEEE 802.2 — faz a interface com a camada 3) e **MAC**
(IEEE 802.3 — cuida do acesso ao meio).

- **PDU:** o **quadro** (*frame*).
- **Equipamentos:** **switch**, bridge, placa de rede.
- **Protocolos:** Ethernet, PPP, HDLC, **ARP**.
- **Alcance: um salto.** A camada 2 só enxerga **dois nós adjacentes** — quem está no mesmo
  segmento de rede. Ela não faz ideia de que existe internet.

**No nosso exemplo:** seu notebook monta um quadro com MAC de origem `A4:BB:6D:11:22:33` e
MAC de destino `00:1A:2B:3C:4D:5E` — **o do roteador, não o do servidor**. O servidor está
em outra rede; o MAC dele é desconhecido e irrelevante aqui. O roteador vai descartar esse
quadro, ler o pacote de dentro e montar **um quadro novo** para o próximo trecho.

> [!nota] O ARP em uma frase
> Para descobrir o MAC do gateway, o notebook transmite em broadcast: *"quem tem
> 10.20.30.1?"*. Isso é **ARP** (*Address Resolution Protocol*). Ele traduz IP em MAC, o que
> o faz *parecer* camada 3 — mas a resposta esperada em prova é **camada 2**, porque ele
> trabalha com quadros dentro de um único segmento. Alguns autores dizem "entre 2 e 3"; se
> as duas opções aparecerem, marque **2**.

> [!analogia] O carteiro do bairro
> A camada 2 é o carteiro que entrega de porta em porta **numa rua só**. Ele conhece cada
> casa daquele quarteirão pelo número da porta (o MAC), e não faz ideia de como se chega a
> outra cidade.
>
> **Onde quebra:** o carteiro sabe o endereço final escrito no envelope e só não pode
> levá-lo. A camada 2 **nem enxerga** o endereço final — ela lê apenas o MAC do próximo
> equipamento. Quem carrega o destino verdadeiro é o pacote de dentro, e a 2 não o abre.

**Como a banca chama:** *"dividindo o fluxo de bits recebidos em frames"*, *"endereço
físico"*, *"entre dois nós adjacentes"*, *"detecção de erros"*, *"acesso ao meio"*.

**Não confunda com:** a **camada 4**. As duas fazem controle de erro e de fluxo — mas a 2
faz **entre vizinhos**, a 4 faz **de ponta a ponta**. Essa distinção decidiu o gabarito da
Q48 de 2023 (Q04 desta aula).

### Camada 3 · Rede

**O problema.** O MAC não escala. Ele é plano: para entregar por MAC, cada roteador do
mundo precisaria de uma tabela com todas as placas de rede do planeta. É preciso um
endereço que diga **onde** a máquina está, não só **quem** ela é.

**Como funciona.** O **IP** é um endereço **hierárquico**: `10.20.30.40/24` se separa em
parte de rede (`10.20.30`) e parte de host (`.40`). Assim um roteador guarda uma linha para
a rede inteira em vez de uma linha por máquina.

Com isso a camada 3 faz **roteamento**: consulta a tabela de rotas e escolhe o **próximo
salto**. A escolha é pela rota mais específica que casa com o destino (*longest prefix
match*). O campo **TTL** (*Time To Live*) é decrementado a cada roteador e o pacote é
descartado quando chega a zero — é o que impede que um pacote circule para sempre num
laço de roteamento. A camada 3 também **fragmenta** o pacote quando ele é maior do que o
próximo enlace suporta.

- **PDU:** o **pacote**.
- **Equipamento:** **roteador**.
- **Protocolos:** IP, **ICMP** (mensagens de controle e erro — é o que o `ping` usa), OSPF,
  RIP, BGP.
- **Alcance:** é a **primeira camada que enxerga o destino final**. Mas o trabalho é feito
  salto a salto: cada roteador decide só o próximo passo.

**No nosso exemplo:** o pacote sai com origem `10.20.30.40`, destino `200.150.10.80` e
TTL 64. Esses dois endereços **não mudam** durante toda a viagem, mesmo passando por dez
roteadores. O que muda em cada trecho é o par de MACs do lado de fora.

> [!analogia] O centro de triagem dos Correios
> A camada 3 é a triagem: olha o CEP, decide se a encomenda vai para o caminhão de São
> Paulo ou o de Belém, e passa adiante. Ela não conhece o caminho inteiro — conhece só a
> próxima parada. O CEP é hierárquico (região, cidade, bairro) exatamente como o IP.
>
> **Onde quebra:** os Correios sabem onde a encomenda está e podem rastreá-la. O IP **não
> guarda estado nenhum**: cada pacote é decidido isoladamente, dois pacotes da mesma
> conversa podem seguir rotas diferentes e chegar fora de ordem, e ninguém é avisado se um
> se perder. É por isso que a camada 4 precisa existir.

**Como a banca chama:** *"controla a operação da sub-rede"*, *"determina a maneira como os
pacotes são roteados da origem até o destino"*, *"endereçamento lógico"*, *"interconexão de
redes distintas"*.

**Não confunda com:** a **camada 2** (IP × MAC) e a **camada 4**. A camada 3 entrega ao
*computador*; a 4 entrega ao *programa* dentro dele.

### Camada 4 · Transporte

**O problema.** Dois buracos que a camada 3 deixa. Primeiro: o IP entrega ao computador,
mas o computador roda o navegador, o cliente de e-mail e o Teams ao mesmo tempo — quem
decide para qual deles vai este pacote? Segundo: o IP é *melhor esforço*. Ele perde,
duplica e entrega fora de ordem, e não avisa ninguém.

**Como funciona.**

- **Porta** — um número de **16 bits** (0 a 65.535) que identifica o processo. Endereço IP
  + porta é o que se chama *socket*. Portas conhecidas: 80 HTTP, 443 HTTPS, 22 SSH, 25
  SMTP, 53 DNS.
- **Segmentação** — a camada 4 pega o fluxo vindo de cima e o corta em pedaços do tamanho
  que a rede aguenta, numerando-os.
- **Confiabilidade (só no TCP)** — cada byte é numerado (**número de sequência**); o
  receptor confirma o que recebeu (**ACK**); o que não for confirmado dentro de um tempo é
  **retransmitido**. O receptor usa a numeração para **reordenar** e para descartar
  duplicatas.
- **Controle de fluxo (só no TCP)** — a **janela deslizante**: o receptor anuncia quantos
  bytes ainda cabem no buffer dele, e o transmissor não passa disso. Impede que uma máquina
  rápida afogue uma lenta.
- **Estabelecimento de conexão (só no TCP)** — o *three-way handshake*: `SYN` →
  `SYN+ACK` → `ACK`.

| | **TCP** | **UDP** |
|---|---|---|
| Conexão | orientado à conexão (handshake) | sem conexão |
| Confiabilidade | confirma, retransmite, reordena | não confirma nada |
| Controle de fluxo | sim (janela deslizante) | não |
| Cabeçalho | 20 bytes | **8 bytes** |
| PDU | **segmento** | **datagrama** |
| Usa quem | HTTP, SMTP, FTP, SSH | DNS, DHCP, VoIP, streaming |
| Troca o quê pelo quê | garantia, ao custo de atraso | menos atraso, sem garantia |

**No nosso exemplo:** o segmento sai com porta de origem `51344` e porta de destino `80`.
Quando a resposta voltar, é a porta 51344 que diz ao sistema que aquilo é do navegador e
não do cliente de e-mail.

> [!analogia] A encomenda com aviso de recebimento, e o apartamento
> Dois serviços numa camada só. O **aviso de recebimento** é o TCP: você fica sabendo que
> chegou, e reenvia se não chegar. E o **número do apartamento** é a porta: o IP entrega no
> prédio (a máquina), a porta diz em qual apartamento (o programa) — sem ela, o pacote
> chega ao computador certo e ninguém sabe se é do navegador ou do e-mail.
>
> **Onde quebra:** nos Correios, o aviso de recebimento é opcional e o pacote é o mesmo. No
> TCP a confiabilidade **muda o protocolo inteiro**: numeração de bytes, janela, handshake,
> 20 bytes de cabeçalho contra os 8 do UDP. Não é um adicional colado num serviço básico —
> são dois protocolos diferentes na mesma camada.

**Como a banca chama:** *"fim a fim"*, *"ponta a ponta"*, *"entre as extremidades"*,
*"orientado à conexão"*, *"transferência confiável e transparente"*, *"segmenta os dados"*.
==Se aparecer "ponta a ponta" ou "extremidades" num enunciado de OSI, a resposta é transporte.==

**Não confunda com:** a **camada 2**, que faz controle de erro e de fluxo *entre nós
adjacentes*. É a mesma função, escopo diferente.

### Camada 5 · Sessão

> [!nota]
> Esta é a camada com menos uso prático e **maior risco em prova**. É a mais oferecida
> como alternativa errada, e a CESGRANRIO já a cobrou diretamente, com o vocabulário
> técnico exato (BANESE 2025, Q07 desta aula). Leia esta seção com o mesmo cuidado da de
> transporte.

**O problema.** A conexão TCP resolve entregar bytes, mas não resolve *conversa*. Se você
está transferindo um arquivo de 2 GB e a conexão cai aos 1,9 GB, o TCP não tem como ajudar:
para ele, aquela conexão simplesmente acabou. E há diálogos em que os dois lados **não
podem** falar ao mesmo tempo — uma atualização de banco em duas pontas, por exemplo.

**Como funciona.** Três funções canônicas, e são exatamente estas três palavras que a banca
usa:

1. **Controle de diálogo** — decide de quem é a vez de transmitir. O tráfego pode ser
   *simplex* (só um lado fala), *half-duplex* (revezam) ou *full-duplex* (os dois ao mesmo
   tempo). Quem administra o revezamento é a camada 5.
2. **Gerenciamento de token** — em operações que os dois lados não podem executar
   simultaneamente, circula um **token**, um "bastão de fala": só quem está com ele pode
   executar a operação crítica. A camada 5 cria o token, entrega, recolhe e recria se ele
   se perder.
3. **Sincronização** — insere **pontos de sincronização** (*checkpoints*) numerados dentro
   do fluxo. Se a transmissão cair, ela recomeça **do último checkpoint**, não do zero.

**Exemplo concreto:** transferência de 2 GB que cai aos 1,9 GB. Sem camada 5, você
recomeça do byte zero. Com checkpoint a cada 100 MB, você volta no máximo 100 MB. É esse o
serviço que a camada 5 vende, e é por isso que ele não cabe na camada 4: o TCP não guarda
nada depois que a conexão morre.

- **PDU:** dados (as camadas 5, 6 e 7 não têm PDU com nome próprio).
- **Protocolos citados em prova:** NetBIOS, **RPC**, PPTP, e as sessões do protocolo de
  arquivos NFS.

> [!analogia] A reunião com bastão de fala e ata numerada
> Numa reunião difícil, só fala quem está com o bastão (token), alguém arbitra de quem é a
> vez (controle de diálogo), e a ata é numerada por item para que, se a reunião for
> interrompida, ela recomece do item 7 e não do começo (sincronização).
>
> **Onde quebra:** o bastão da reunião é físico e nunca some. O token da camada 5 é uma
> mensagem que pode se perder no caminho — e por isso existe um procedimento para
> *recriá-lo*, que não tem paralelo na reunião.

**Como a banca chama:** *"controle de diálogo"*, *"gerenciamento de token"*, *"controle de
sincronização"*, *"pontos de sincronização"*, *"estabelece, gerencia e encerra sessões"*,
*"retomada a partir do ponto de interrupção"*.

**Não confunda com:** a **camada 4**. Conexão TCP não é sessão. A conexão é um canal de
bytes; a sessão é o diálogo, que pode sobreviver à queda do canal e ser retomada.

### Camada 6 · Apresentação

**O problema.** Duas máquinas podem representar **o mesmo dado** de formas diferentes, e aí
o byte chega intacto e ainda assim é lido errado.

Dois casos concretos, que valem mais que a definição:

- **Ordem dos bytes.** O inteiro `1`, em 32 bits, é `00 00 00 01` numa máquina
  *big-endian* e `01 00 00 00` numa *little-endian*. Os quatro bytes atravessam a rede sem
  um erro sequer, e o outro lado lê `16.777.216`.
- **Codificação de caractere.** A letra `A` é `0x41` em **ASCII** e `0xC1` em **EBCDIC**, a
  codificação dos mainframes IBM. O mesmo byte, dois alfabetos.

Sem a camada 6, cada aplicação teria que conhecer a arquitetura da máquina do outro lado —
exatamente o acoplamento que o modelo existe para eliminar.

**Como funciona.** A camada 6 separa **sintaxe abstrata** (a estrutura lógica do dado: "um
registro com um inteiro e um texto") de **sintaxe de transferência** (a forma concreta com
que isso viaja no fio). Cada lado converte da sua representação local para a de
transferência, combinada entre os dois. O exemplo canônico da própria ISO é o **ASN.1**
(*Abstract Syntax Notation One*) com as regras de codificação **BER** — é o que o SNMP usa
até hoje.

Além da conversão de formato, a camada 6 responde por mais duas funções, e são as que mais
caem:

- **Compressão** — reduzir o volume antes de transmitir. Formatos: JPEG, GIF, MPEG.
- **Criptografia** — no modelo OSI, ==cifrar é função da camada 6==. É a associação mais
  cobrada desta camada.

**No nosso exemplo:** ao acessar por HTTPS em vez de HTTP, é o TLS que cifra o conteúdo
antes de entregá-lo ao TCP.

> [!analogia] O tradutor juramentado
> Você escreve em português, o tradutor converte para uma língua franca combinada, e do
> outro lado outro tradutor converte para a língua de chegada. Nenhum dos dois altera o
> conteúdo do documento.
>
> **Onde quebra:** o tradutor humano entende o que traduz. A camada 6 **não entende nada** —
> ela converte a *forma*, não o *significado*. Ela não sabe se aquilo é uma nota fiscal ou
> uma foto, e é justamente por não saber que ela serve a qualquer aplicação.

> [!nota] O incômodo do TLS
> Na prática o TLS roda entre o TCP e a aplicação, e vários livros modernos o classificam
> como camada de aplicação. **Em prova de modelo OSI isso não vale:** criptografia e
> compressão são camada 6. Guarde as duas versões e responda pela do modelo.

**Como a banca chama:** *"sintaxe e semântica"*, *"codificação padrão"*, *"diferentes
representações de dados"*, *"estruturas de dados abstratas"*, *"formatação"*,
*"compressão"*, *"criptografia"*.

**Não confunda com:** a **camada 7**, que é o distrator natural, e com a **camada 5**, que é
a vizinha de baixo e a alternativa mais oferecida.

### Camada 7 · Aplicação

**O problema.** Dois programas precisam de um vocabulário comum. Não adianta a mensagem
chegar íntegra se o servidor não sabe que `GET` significa "me mande este arquivo".

**Como funciona.** A camada 7 é onde moram os **protocolos de aplicação**, que definem os
comandos e as respostas possíveis.
==Atenção: o programa não é a camada 7; o protocolo que ele fala é.==
O navegador é um programa; o **HTTP** é a camada 7.

- **HTTP** — `GET`, `POST`, e códigos de resposta como `200 OK` e `404 Not Found`.
- **SMTP** — `HELO`, `MAIL FROM`, `RCPT TO`, `DATA`. É correio eletrônico, e é camada 7.
- **FTP**, **DNS**, **SNMP**, **DHCP**, **Telnet**, **SSH**.

**No nosso exemplo:** o que o navegador entrega para descer a pilha são estes bytes:

```
GET / HTTP/1.1
Host: www.transpetro.com.br
User-Agent: Mozilla/5.0
```

> [!analogia] O idioma da carta, não o papel
> Se as seis camadas de baixo entregaram a folha intacta, ainda falta uma coisa: os dois
> lados precisam escrever no mesmo idioma, com as mesmas fórmulas — "prezado senhor",
> "atenciosamente". A camada 7 é esse idioma combinado.
>
> **Onde quebra:** duas pessoas podem inventar um idioma na hora. Protocolo de aplicação
> não: ele é público e rígido, e quem escrever `PEGA /` em vez de `GET /` recebe erro. E o
> idioma não é a pessoa — o **navegador não é a camada 7, o HTTP é**.

**Como a banca chama:** o nome do protocolo, ou *"interface com o programa do usuário"*,
*"interações de aplicativos de alto nível"*.

**Não confunda com:** a camada 6. E guarde o caso específico que já caiu: **servidor de
e-mail e servidor web estão os dois na camada 7**. A tentação é pôr o de e-mail na 6,
porque "apresentação" soa como formatar mensagem. Não é. SMTP é aplicação.

## 4 · Encapsulamento: o que acontece com o nosso pedido

Descendo a pilha, cada camada acrescenta o **seu próprio cabeçalho** ao que veio de cima e
trata tudo isso como carga. Subindo do outro lado, cada camada retira o cabeçalho que é
seu e entrega o resto para cima. O conteúdo é o mesmo; o que muda é quanto cabeçalho está
grudado nele — e é por isso que o nome da unidade muda a cada nível.

Com os números do nosso exemplo:

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
> A PDU de baixo para cima: **bit → quadro → pacote → segmento**. Esta sequência de quatro
> palavras já valeu questão inteira. Da 5 para cima, chama-se só "dados".

Três detalhes que rendem alternativa:

- **Só a camada 2 põe informação no fim** do bloco: o FCS. As outras acrescentam apenas
  cabeçalho, na frente.
- **O quadro é refeito a cada salto.** Quando o pacote chega ao roteador, o quadro é
  descartado e um novo é montado para o próximo trecho, com MACs diferentes. O pacote IP
  segue igual, só com o TTL decrementado.
- **UDP também é chamado de datagrama**, e o pacote da camada 3 é às vezes chamado
  *datagrama IP*. Se a alternativa disser "datagrama" para a camada 4, ela está falando de
  UDP.

## 5 · Palavra do enunciado → camada

Esta é a tabela que resolve a maioria das questões deste assunto. O enunciado da CESGRANRIO
descreve a camada corretamente e **nunca a nomeia** — o que decide o gabarito é uma
expressão só.

| Se o enunciado disser | É a camada | Não confunda com |
|---|---|---|
| "fluxo de bits não estruturado", "meio físico", "mecânicas, elétricas, funcionais e de procedimento" | **1 · Física** | enlace |
| "divide o fluxo de bits em frames", "endereço físico", "entre nós adjacentes", "acesso ao meio" | **2 · Enlace** | física, rede |
| "controla a operação da sub-rede", "roteados da origem até o destino", "endereçamento lógico" | **3 · Rede** | enlace, transporte |
| "fim a fim", "ponta a ponta", "entre as extremidades", "orientado à conexão", "segmenta os dados" | **4 · Transporte** | enlace (mesmas funções, outro escopo) |
| "controle de diálogo", "gerenciamento de token", "controle de sincronização", "retomada" | **5 · Sessão** | transporte |
| "sintaxe e semântica", "diferentes representações de dados", "compressão", "criptografia" | **6 · Apresentação** | sessão, aplicação |
| nome de protocolo (HTTP, SMTP, FTP, DNS), "aplicativos de alto nível" | **7 · Aplicação** | apresentação |

## 6 · A "camada mais alta em que o equipamento opera"

Enunciado clássico da TRANSPETRO — caiu exatamente assim em 2018. A regra: o equipamento
opera até a camada em que ele **toma decisão**. Ele mexe nos bits de todas as camadas
abaixo, mas a camada dele é a do critério que ele usa para decidir.

| Equipamento | Camada mais alta | Decide com base em |
|---|---|---|
| Cabo, conector, repetidor, **hub** | **1** | nada — só repete o sinal em todas as portas |
| **Switch**, bridge | **2** | endereço MAC |
| **Roteador** | **3** | endereço IP |
| Firewall de estado | **4** | porta e estado da conexão |
| **Servidor** (correio, web, arquivos) | **7** | a aplicação em si |

> [!nota]
> "Switch layer 3" existe: é um switch com função de roteamento embutida. Quando o
> enunciado usar esse termo, ele está descrevendo a exceção de propósito. Switch sem
> qualificação é **camada 2**.

## 7 · OSI × TCP/IP, porque os distratores vêm daí

O OSI é um **modelo de referência**: didático, nunca implementado literalmente. O que roda
na prática é a pilha **TCP/IP**, de quatro camadas. A banca mistura os dois de propósito —
"nível de internet" foi alternativa errada em 2018 justamente por ser um nome **correto no
modelo errado**.

| OSI | TCP/IP | Protocolos |
|---|---|---|
| 7 Aplicação · 6 Apresentação · 5 Sessão | **Aplicação** | HTTP, SMTP, DNS, FTP |
| 4 Transporte | **Transporte** | TCP, UDP |
| 3 Rede | **Internet** | IP, ICMP |
| 2 Enlace · 1 Física | **Acesso à rede** (ou enlace/host-rede) | Ethernet, PPP |

## Onde a banca derruba

> [!pegadinha] Enlace também faz controle de erro e de fluxo
> É a pegadinha número um deste assunto, e decidiu a Q48 de 2023. As camadas 2 e 4 fazem
> as **mesmas funções** com **escopos diferentes**: a 2 entre nós adjacentes, a 4 de ponta
> a ponta. Quando as duas estiverem na lista, procure a palavra de escopo — *"extremidades"*,
> *"fim a fim"* → transporte; *"adjacentes"*, *"mesmo segmento"* → enlace.

> [!pegadinha] Onde fica a criptografia
> No modelo OSI, criptografia é **camada 6, Apresentação**. A alternativa errada oferece
> Sessão (vizinha de baixo) ou Aplicação (onde o TLS de fato roda na prática). Em prova de
> OSI, responda 6.

> [!pegadinha] Servidor de e-mail não é camada 6
> "Apresentação" soa como "formatar a mensagem". Servidor de correio fala SMTP, que é
> protocolo de aplicação: **camada 7**, igual ao servidor web. Foi o ponto inteiro da Q41
> de 2018.

> [!pegadinha] Nome trocado no meio de uma lista correta
> A banca escreve as sete camadas na ordem certa e troca **uma só**: "nível lógico" no
> lugar de aplicação, "nível de criptografia" no lugar de sessão, "nível de internet" no
> lugar de aplicação. Leia a lista inteira até o fim — o erro costuma estar no último item,
> quando você já decidiu que a alternativa estava certa.

> [!pegadinha] A contagem invertida
> "A terceira camada", "a camada imediatamente superior à de transporte". A contagem é
> **de baixo para cima**: a terceira é Rede; acima de Transporte vem Sessão; abaixo, Rede.
> Questão inteira da TRANSPETRO 2023 foi só isso (Q05 desta aula).

> [!pegadinha] O ARP parece camada 3
> Ele traduz IP em MAC, mas opera com quadros em um único segmento. A resposta esperada é
> **camada 2**.

## Questões

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

### Q03 · TRANSPETRO 2018 · questão 43

> [!fonte] Fonte: prova TRANSPETRO 2018, questão 43
> Memorização pura da ordem das sete camadas. Três questões de OSI na mesma prova — é o
> peso que este assunto tem na TRANSPETRO.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/638830)

O modelo OSI possui sete níveis de protocolos.

Tais níveis são os seguintes:

- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e **Nível lógico**.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; **Nível de criptografia**; Nível de apresentação e Nível de aplicação.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; **Nível de banco de dados**; Nível de apresentação e Nível de aplicação.
- [x] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e Nível de aplicação.
- [ ] Nível Físico; Nível de enlace de dados; Nível de rede; Nível de transporte; Nível de sessão; Nível de apresentação e **Nível de internet**.

> [!gabarito]-
> **Gabarito: D.** É a única lista correta e completa.
>
> O método vale para toda questão desse formato: as cinco alternativas começam iguais,
> então **leia só o que diferencia**. Aqui a troca está sempre em uma posição — na 5ª
> (criptografia, banco de dados) ou na 7ª (lógico, internet).
>
> **E** é o distrator mais elegante: "nível de internet" existe de verdade, mas no modelo
> **TCP/IP** (seção 7 desta aula), não no OSI. Um termo correto no modelo errado.
>
> Tipos de distrator: **T1 (neologismo plausível)** em A, B e C — "nível lógico", "nível de
> criptografia" e "nível de banco de dados" não existem em modelo nenhum; **T2 (irmão
> taxonômico)** em E, que empresta um nome real de outro modelo.

### Q04 · TRANSPETRO 2023 · questão 48

> [!fonte] Fonte: prova TRANSPETRO 2023, questão 48 (ênfase 4, a nossa)
> Prova mais recente e a mais próxima do edital de 2026 — o conteúdo programático de 2026
> é 95,7% igual ao de 2023. É a questão desta aula com maior chance de se repetir em
> formato.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2694703)

O modelo de referência OSI (Open Systems Interconnection) foi desenvolvido como um modelo
para arquitetura de protocolos de comunicação entre sistemas. As funções de comunicação são
particionadas numa hierarquia de sete camadas, na qual cada uma realiza um subconjunto das
funções exigidas para comunicação com outro sistema. Dentre essas camadas, há uma que
fornece um serviço orientado à conexão e que possibilita a transferência confiável e
transparente de dados entre as extremidades, além de oferecer recuperação de erro e
controle de fluxo de ponta a ponta. A camada que realiza o subconjunto de funções descrito
é a

- [ ] física
- [ ] de enlace
- [ ] de rede
- [x] de transporte
- [ ] de apresentação

> [!gabarito]-
> **Gabarito: D.** Três expressões do enunciado apontam para a mesma camada: *"orientado à
> conexão"*, *"entre as extremidades"* e *"de ponta a ponta"*. É o TCP sendo descrito sem
> ser nomeado.
>
> O distrator é **B, de enlace**: enlace também faz recuperação de erro e controle de
> fluxo, mas **apenas entre dois nós adjacentes**. A expressão "entre as extremidades" é o
> que o elimina — e a banca a pôs de propósito.
>
> Tipo de distrator: **T2 (irmão taxonômico)**, com o discriminante escondido no escopo.
> Compare com a Q02: as duas testam a mesma habilidade, achar a palavra que fixa a camada.
> Em 2018 foi "conector"; em 2023 foi "ponta a ponta".

### Q05 · CESGRANRIO · TRANSPETRO 2023 (cargo Informática)

> [!fonte] Fonte: prova TRANSPETRO 2023, cargo Informática — do seu caderno CESGRANRIO
> Mesma banca, mesma empresa, mesmo ano da nossa prova, para outro cargo. Cobra só a ordem
> da pilha, e é o exemplo puro da pegadinha da contagem invertida.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2690830)

O modelo de referência OSI da ISO é estruturado em camadas, geralmente descritas em uma
pilha onde as camadas mais próximas da máquina física estão na parte inferior, e as camadas
mais próximas do usuário estão na parte superior. Considerando-se essa organização, as
camadas imediatamente acima e imediatamente abaixo da camada de Transporte são,
respectivamente, as de

- [ ] Aplicação e de Rede
- [ ] Aplicação e de Sessão
- [ ] Apresentação e de Rede
- [ ] Sessão e de Apresentação
- [x] Sessão e de Rede

> [!gabarito]-
> **Gabarito: E.** Transporte é a camada 4. Acima dela, a 5 é **Sessão**; abaixo, a 3 é
> **Rede**.
>
> **D** é a inversão perfeita: oferece Sessão (certa para "acima") e Apresentação, que é a
> 6 — quem contou dois degraus para cima em vez de um marca aqui. **B** troca a direção,
> pondo Sessão como a de baixo. **A** e **C** sobem demais na primeira posição.
>
> Tipo de distrator: **T4 (inversão de papel, ordem ou direção)** — as cinco são pares de
> camadas vizinhas, com a ordem invertida em duas delas. O `perfil-da-banca-CESGRANRIO-TI`
> usa esta questão como exemplo do tipo.

### Q06 · CESGRANRIO · TRANSPETRO 2023 (cargo Informática)

> [!fonte] Fonte: prova TRANSPETRO 2023, cargo Informática — do seu caderno CESGRANRIO
> A camada 4 cobrada pelos dois protocolos, e não pela função. Note que o enunciado define
> confiabilidade exatamente como a seção 3 desta aula: "o receptor confirma cada pacote".
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2690832)

Na camada de transporte de uma rede TCP/IP, podem ser encontrados dois protocolos de
transmissão de pacotes: um que provê fluxo confiável, em que o receptor confirma cada
pacote recebido ao emissor; e outro em que essa confirmação não acontece; logo, esse
protocolo não provê fluxo confiável. Nesse contexto, na camada de transporte, os protocolos
confiável e não confiável são, respectivamente:

- [ ] UDP e IP
- [ ] UDP e TCP
- [ ] TCP e IP
- [x] TCP e UDP
- [ ] IP e UDP

> [!gabarito]-
> **Gabarito: D.** Confiável = **TCP** (confirma com ACK e retransmite o que não for
> confirmado); não confiável = **UDP**.
>
> **B** é a mesma resposta com a ordem trocada — a armadilha para quem lê rápido e não
> confere o "respectivamente". **A**, **C** e **E** colocam o **IP** entre as opções, e IP
> é **camada 3**, não 4: o próprio enunciado diz "na camada de transporte".
>
> Tipos de distrator: **T4 (inversão de ordem)** em B; **T2 (irmão taxonômico)** em A, C e
> E, que oferecem um protocolo real da camada errada.

### Q07 · CESGRANRIO · BANESE 2025

> [!fonte] Fonte: prova BANESE 2025, Informática/Suporte — do seu caderno CESGRANRIO
> A questão mais difícil desta aula, e a mais recente. As **cinco** alternativas são
> definições corretas — de camadas diferentes. É o exemplo que o
> `perfil-da-banca-CESGRANRIO-TI.md` usa para explicar o distrator T3.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3347866)

O modelo de referência Open Systems Interconnection (OSI) é uma estrutura conceitual que
descreve como dispositivos e aplicativos se comunicam em uma rede. Esse modelo é dividido
em sete camadas distintas, cada uma com responsabilidades específicas, que vão desde
conexões físicas de hardware até interações de aplicativos de alto nível. Dentre essas
camadas, a camada de sessão

- [ ] gerencia estruturas de dados abstratas com base em uma codificação padrão de sintaxe e semântica para possibilitar o intercâmbio de informações entre equipamentos que utilizam diferentes representações de dados.
- [ ] trata da transmissão do fluxo de bits não estruturado pelo meio físico e lida com características mecânicas, elétricas, funcionais e de procedimento para acessar o meio físico.
- [x] oferece as facilidades de controle de diálogo, gerenciamento de token e controle de sincronização.
- [ ] garante a entrega fim a fim de mensagens das camadas superiores com controle de erro e fluxo, fornecendo comunicação orientada a conexão e sem conexão.
- [ ] controla a operação da sub-rede e determina a maneira como os pacotes são roteados da origem até o destino.

> [!gabarito]-
> **Gabarito: C.** As três funções canônicas da camada 5, com o nome exato: **controle de
> diálogo**, **gerenciamento de token** e **controle de sincronização**. É a seção 3 desta
> aula, camada 5, palavra por palavra.
>
> As outras quatro estão **todas corretas** — para outras camadas:
> **A** é a camada **6** ("sintaxe e semântica", "diferentes representações");
> **B** é a camada **1** ("fluxo de bits não estruturado", "mecânicas, elétricas,
> funcionais e de procedimento");
> **D** é a camada **4** ("fim a fim", "orientado à conexão");
> **E** é a camada **3** ("sub-rede", "roteados da origem até o destino").
>
> Tipo de distrator: **T3 (definição verdadeira do conceito errado)** — o tipo que não
> perdoa entendimento aproximado. Aqui não adianta saber "mais ou menos" o que sessão faz:
> é preciso reconhecer a assinatura verbal de cada uma das cinco camadas. É por isso que a
> tabela da seção 5 existe.

### Q08 · CESGRANRIO · BNDES 2024

> [!fonte] Fonte: prova BNDES 2024, Análise de Sistemas – Suporte — do seu caderno CESGRANRIO
> Cobra a camada 4 pelo **verbo** (segmentar) e pela posição na pilha, não pela
> confiabilidade. Mostra que a banca varia o ângulo de ataque da mesma camada.
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
> **Gabarito: E.** O enunciado dá a resposta duas vezes. Primeiro pela posição: "recebe da
> sessão (5) e envia para a rede (3)" só descreve a **4**. Segundo pelo verbo e pela PDU:
> **segmentar** produz **segmentos**, que é a PDU da camada de transporte (seção 4 desta
> aula).
>
> Os quatro distratores são camadas reais em posições impossíveis: aplicação (7) e
> apresentação (6) estão acima da sessão, não abaixo; enlace (2) e física (1) estão abaixo
> da rede, não entre sessão e rede.
>
> Tipo de distrator: **T2 (irmão taxonômico)**. Questão de presente para quem sabe a ordem
> — e é a terceira desta aula que se resolve só com a ordem da pilha.

### Q09 · CESGRANRIO · UNEMAT 2024 (Analista de Sistemas)

> [!fonte] Fonte: prova UNEMAT 2024, Analista de Sistemas — do seu caderno CESGRANRIO
> A camada 2 cobrada pelas duas marcas registradas dela: **frames** e **mesma rede**.
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
> **Gabarito: A.** Duas expressões fecham a resposta: *"dois sistemas de uma mesma rede"*
> (escopo de um salto) e *"dividindo o fluxo de bits recebidos em frames"* (enquadramento).
> As duas são da camada **2**.
>
> **B, de rede** é o distrator principal, e a palavra "pacote" no enunciado é o que o
> alimenta — mas "de uma **mesma** rede" exclui roteamento, que é justamente entregar entre
> redes **diferentes**. **E, física** pega quem viu "fluxo de bits" e parou de ler: a
> física entrega o fluxo, a 2 o divide em frames.
>
> Tipo de distrator: **T2 (irmão taxonômico)**, com um reforço de vocabulário mal colocado
> ("pacote") puxando para a camada 3.

### Q10 · CESGRANRIO · UNEMAT 2024 (Técnico em Informática)

> [!fonte] Fonte: prova UNEMAT 2024, Técnico em Informática — do seu caderno CESGRANRIO
> A associação mais direta possível, e a mais provável de aparecer: dois protocolos, duas
> camadas, na ordem. Vale como aquecimento e como conferência do mapeamento da seção 7.
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
> **Gabarito: C.** TCP = **transporte** (4); IP = **rede** (3).
>
> Todas as erradas são pares de camadas adjacentes, deslocados um degrau para cima ou para
> baixo: **B** e **D** erram uma das duas por um nível; **A** e **E** erram as duas. Quem
> souber que TCP é 4 já elimina A, B e E; quem souber que IP é 3 elimina D.
>
> Tipo de distrator: **T4 (inversão/deslocamento de ordem)**. Repare que a banca respeita a
> ordem "respectivamente" — ela nunca precisa mentir, basta deslocar.

### Q11 · Inédita

> [!fonte] Fonte: questão inédita, não caiu em prova
> Escrita no molde T3 do BANESE (Q07): enunciado definicional, alternativa curta. Cobre a
> **camada 6**, que aparece como distrator em quatro das dez questões acima e nunca foi
> cobrada diretamente pela TRANSPETRO. É o buraco mais provável do assunto.

Um sistema legado executado em mainframe representa caracteres em EBCDIC e números inteiros
em ordem *big-endian*; a aplicação cliente, em um servidor Linux, usa ASCII e ordem
*little-endian*. Para que as duas trocem registros sem que cada aplicação precise conhecer
a arquitetura da outra, o modelo OSI atribui a conversão entre a representação local e uma
sintaxe de transferência comum à camada de

- [ ] sessão
- [ ] aplicação
- [x] apresentação
- [ ] transporte
- [ ] enlace de dados

> [!gabarito]-
> **Gabarito: C.** Converter entre a representação local de cada máquina e uma **sintaxe de
> transferência** comum é a definição da **camada 6, Apresentação** (seção 3 desta aula). É
> o mesmo mecanismo do ASN.1/BER.
>
> **A, sessão** é o distrator por vizinhança na pilha — sessão cuida do *diálogo*, não do
> *formato*. **B, aplicação** pega quem raciocina pela prática, onde a conversão costuma
> ser feita por biblioteca dentro do programa; no modelo OSI o lugar formal é a 6.
> **D** e **E** oferecem camadas que transportam bytes sem interpretá-los.
>
> Tipo de distrator: **T2 (irmão taxonômico)**. Guarde a associação inteira da camada 6:
> **formato + codificação de caractere + compressão + criptografia**.

### Q12 · Inédita

> [!fonte] Fonte: questão inédita, não caiu em prova
> Escrita no molde da Q41 de 2018 (lista + "nessa ordem"), mas cobrando **encapsulamento**
> em vez de equipamento — a única parte da teoria desta aula que nenhuma das dez questões
> reais cobrou, e que é conteúdo explícito do item 1.1e do edital.

Um quadro Ethernet capturado na rede local de uma empresa contém, do lado de fora para o
lado de dentro, os seguintes elementos: (i) o endereço MAC de destino; (ii) o endereço IP
de destino; (iii) a porta TCP de destino; (iv) a linha `GET /index.html HTTP/1.1`.

No modelo de referência OSI, os elementos (i) a (iv) foram inseridos, nessa ordem, pelas
camadas de números

- [ ] 1, 2, 3 e 4
- [ ] 2, 3, 4 e 6
- [x] 2, 3, 4 e 7
- [ ] 3, 2, 4 e 7
- [ ] 2, 3, 5 e 7

> [!gabarito]-
> **Gabarito: C.** MAC = **2**, IP = **3**, porta = **4**, comando HTTP = **7**. É a ordem
> do encapsulamento lida de fora para dentro (seção 4 desta aula): o último cabeçalho a ser
> acrescentado é o primeiro a aparecer no fio.
>
> **A** desloca tudo um nível para baixo e põe MAC na física. **B** repete a armadilha da
> Q41 de 2018, oferecendo **6** para algo que é aplicação. **D** inverte MAC e IP — quem
> leu "de dentro para fora" sem prestar atenção marca aqui. **E** troca transporte por
> sessão, aproveitando que a 5 não tem PDU própria.
>
> Tipo de distrator: **T4 (inversão de ordem)** em D, **T2** nas demais. Se você acertou
> esta e a Q01, o assunto está resolvido.

## Figuras pendentes

**Nenhuma.** Todas as questões deste assunto têm `alt_em_imagem = N` nos índices de 2018 e
2023 e no caderno CESGRANRIO — as alternativas saíram inteiras em texto. Não há nada para
recortar de PDF nesta aula.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Modelos de Referência de Redes` › **`Modelo OSI`** |
| Hierarquia | `03.01` |
| Questões no acervo | 2.106 (667 comentadas) |
| No seu caderno CESGRANRIO | 7 — todas as sete estão nesta aula |

Marque também a banca **CESGRANRIO**. Se sobrarem menos de 20 questões, tire o filtro de
banca: o conceito não muda entre bancas e o treino de leitura vale.

**Complementos, para o resto da semana**

| Assunto | Hierarquia | Questões | Por quê |
|---|---|---:|---|
| `Componentes Físicos de Redes` › **`Equipamentos de Redes (Roteador, Switch, Hub, etc.)`** | `08.01` | 2.158 | É a outra metade da Q41 de 2018 e da seção 6 |
| `Modelos de Referência de Redes` › **`Arquitetura TCP/IP`** | `03.02` | 1.560 | Par do OSI, cai junto; é o filtro da aula R03 |
| **`Topologias de Redes`** | `02` | 1.084 | Assunto da Q40 de 2018, vizinha de prova |

> [!nota]
> Os nomes acima vêm da árvore real em `dados/assuntos-tec.json`. Navegue por eles no site:
> **Questões → Filtrar por matéria → TI - Redes de Computadores** e abra a hierarquia
> indicada. Para achar o assunto de qualquer outra aula:
> `python ferramentas/assuntos.py <palavra-chave>`

> [!checklist]
> - Ordem, de baixo para cima: Física, Enlace, Rede, Transporte, Sessão, Apresentação, Aplicação.
> - PDU: bit → quadro → pacote → segmento. Da 5 para cima, "dados".
> - Hub = 1, switch = 2, roteador = 3, firewall de estado = 4, servidor = 7. ARP = 2.
> - Camada 5 = controle de diálogo + gerenciamento de token + sincronização.
> - Camada 6 = formato, codificação de caractere, compressão e criptografia.
> - "Ponta a ponta" e "extremidades" = transporte; "nós adjacentes" = enlace.
> - Defeito em cabo ou conector = camada 1, mesmo que quem detecte seja a 2.
> - "Nível de internet" é TCP/IP, não OSI.
