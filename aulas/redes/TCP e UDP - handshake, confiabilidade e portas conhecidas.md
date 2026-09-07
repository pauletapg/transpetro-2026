---
id: R04
titulo: TCP × UDP — handshake, confiabilidade e portas conhecidas
resumo: Ao terminar, você diz as três etapas do handshake com as flags certas, explica por que o UDP é mais rápido dizendo o que ele deixou de fazer, separa controle de fluxo de controle de congestionamento, recita as portas bem conhecidas com o transporte de cada uma, e reconhece na hora quando a banca oferece IP, ICMP ou ARP como se fossem protocolos de transporte.
tempo: 45 min
---

> [!banca]
> **Itens 1.1e e 1.1f do edital 2026** — "Modelo OSI da ISO" e "Arquitetura e protocolos
> TCP/IP". Cobrança **conceitual e de mecanismo**: descrever o que o protocolo faz por
> dentro, nomear a flag certa na etapa certa, dizer qual porta pertence a qual serviço.
> Não pede implementação, não pede cálculo de sub-rede — mas pede **sequência exata**
> (a ordem SYN → SYN+ACK → ACK) e **número exato** (a porta 587, e não a 25).
>
> **Quantas vezes caiu:**
>
> - **2018 — 1 questão direta.** A **questão 45**, indexada em "TI - Redes de Computadores - TCP e UDP", gabarito A (UDP). É a questão-mãe do assunto e abre a seção de questões.
> - **2023 — 1 questão direta na nossa ênfase.** A **questão 48**, que descreve a camada de transporte por inteiro e pede o nome dela. Some-se a **questão 49**, que só se resolve sabendo o que é um SYN pendurado — mas ela é contada em Segurança e fica na aula de IDS.
> - **Na mesma prova de 2023, em outros cargos da TRANSPETRO**, o assunto caiu mais **três** vezes: `cad.Q556` (cargo Informática, "os protocolos confiável e não confiável são, respectivamente"), `cad.Q555` (as camadas vizinhas da de Transporte) e `cad.Q703` (cargo Segurança Cibernética, SYN Flood). Mesma banca, mesmo dia, mesmo elaborador.
> - **No caderno CESGRANRIO 2023-2026** há **4 questões** sob o rótulo "TCP e UDP" — IPEA 2024, CNU 2024 (duas) e BASA 2024 — e mais **5** que são deste assunto mas estão indexadas sob outro rótulo (Modelo OSI, Algoritmos de Detecção de Erros, ICMP, Segurança em Correio Eletrônico). ==Metade das questões deste assunto está catalogada sob outro nome.==
>
> **Total desta aula: 12 questões, todas reais** — 2 de prova TRANSPETRO da nossa ênfase e
> 10 do caderno CESGRANRIO (três delas da própria TRANSPETRO 2023, em outros cargos).
> **Nenhuma inédita:** com doze questões de banca no assunto, escrever mais só diluiria o
> treino no molde verdadeiro.
>
> **O molde:** enunciado definicional de 40 a 110 palavras que já descreve o mecanismo
> corretamente, alternativa de uma a quatro palavras — os 56% da ênfase 4 descritos no
> `perfil-da-banca-TRANSPETRO.md` §1.1. Os distratores se concentram em três tipos:
> **T2** (protocolo real da camada errada: IP, ICMP, ARP, IGMP oferecidos como transporte),
> **T4** (TCP e UDP invertidos, flags fora de ordem) e **T8** (portas vizinhas).
>
> **Um aviso de vocabulário que vale pontos.** A CESGRANRIO escreve as questões deste
> assunto com o vocabulário da tradução brasileira do **Comer** (*Interligação de Redes com
> TCP/IP*). É de lá que saem expressões como *"campo de bits de código"* (em vez de "flags")
> e *"síndrome da janela tola"* (em vez de *silly window syndrome*). Quem só leu Tanenbaum
> ou Kurose trava no enunciado. As duas expressões estão definidas nesta aula.

> [!nota] Esta aula não cabe na semana 1 como o calendário está desenhado. Leia isto antes.
> A fatia de R04 é de **45 min** — a terça da semana 1 tem 90 min divididos entre R03 e R04.
> Medido com `python ferramentas/tamanho.py`, o que está escrito abaixo dá:
>
> | | |
> |---|---|
> | Teoria | **13.208 palavras de peso, 132 min** |
> | 15 questões | **60 min** |
> | Checklist | 5 min |
> | **Total** | **197 min — mais de quatro vezes a fatia** |
>
> **Dos 132 min de teoria, 41 são tabelas e 8 são blocos de saída de comando.** Tabela não
> se lê de ponta a ponta na primeira vez: consulta-se. ==A prosa desta aula, lida de corrido, são 83 minutos; as tabelas são material de releitura.== É a leitura honesta do
> número, não um desconto para fazer caber.
>
> **Não encolhi, e o motivo é a regra R4 do `_MODELO.md`:** o conceito que mais aparece como
> distrator recebe mais espaço. Aqui esse conceito **não é o TCP** — é o grupo
> **IP / ICMP / ARP / IGMP oferecidos como se fossem transporte**, que ocupa alternativa
> errada nas questões **Q02, Q05, Q06 e Q08** — 4 das 12 questões de prova desta aula, e em
> Q02 ele aparece em três das cinco alternativas. Daí a seção 7 existir e ser longa, apesar
> de falar de protocolos que nem são o assunto do dia.
>
> **O problema é que não há folga na semana 1.** Segunda a sexta já têm dois tópicos em
> 90 min cada; sábado é língua mais bateria de questões; domingo é refazer erros. R03 já
> tinha avisado que sobrariam 7 minutos na terça. Então a distribuição abaixo **tira tempo
> de outros blocos**, e diz de onde:
>
> | Quando | O quê | Tempo |
> |---|---|---|
> | **Terça, os 7 min que sobraram de R03** | o callout `[!banca]` acima e a **seção 6** — só a tabela comparativa | 7 min |
> | **Quarta, no aquecimento** | **seções 1 e 2** — o problema, as camadas vizinhas e o cenário do `tcpdump` | 20 min |
> | **Quinta, no aquecimento** | **seção 3** — portas, faixas da IANA, tabela de portas, Port Unreachable | 17 min |
> | **Sexta, no aquecimento** | **seção 4** — UDP por dentro | 10 min |
> | **Sábado, no lugar da bateria L02** | **seção 5 inteira** — TCP por dentro — e **Q01 a Q05** | 63 min |
> | **Domingo, nos primeiros 60 min** | **seções 7 e 8** e "Onde a banca derruba", mais **Q06 a Q12** | 60 min |
> | **Segunda da semana 2, no aquecimento** | o **checklist**, escrito de memória antes de reabrir a aula | 5 min |
>
> **O que essa distribuição custa:** a bateria de Redes de sábado (L02) e a primeira hora do
> domingo. É um preço alto e eu o declaro em vez de escondê-lo. A justificativa: na semana 1
> ainda há poucos erros acumulados para o domingo refazer, e ==metade das questões deste assunto está catalogada sob outro nome no TecConcursos==, então a bateria de sábado
> filtrada por "TCP e UDP" traria só 4 questões — menos do que as 12 que já estão aqui.
>
> **Se preferir não mexer no calendário**, corte a seção 6 (a tabela comparativa está
> repetida no checklist), a seção 8 e as pegadinhas P4, P6 e P9. Sobram 105 min de teoria e a
> aula continua fechando as 12 questões. ==Não corte a seção 5 nem a seção 7: são as duas que as questões cobram diretamente.==
>
> **Q05 a Q12 não são para o dia da leitura.** Responder sobre um texto que você acabou de
> ler mede memória de trabalho, não aprendizado — é a regra das 24 horas do `_MODELO.md`.

---

## 1 · O problema: por que existe uma camada de transporte, e por que ela tem dois donos

Em R03 você viu as quatro camadas da arquitetura **TCP/IP**, e em R01 as sete do modelo
**OSI** (*Open Systems Interconnection*, "interconexão de sistemas abertos", a norma
ISO/IEC 7498 que dá o vocabulário de camadas usado em prova). Recapitulando só o que
interessa aqui: a camada de **inter-rede** — a do **IP** (*Internet Protocol*, o protocolo que dá endereço e
rota a cada pacote) — entrega um pacote **de uma máquina para outra máquina**, atravessando
roteadores. Ela faz isso com o que a literatura chama de **serviço de melhor esforço**
(*best effort*): tenta entregar e não promete nada. Se o pacote se perder numa fila cheia,
se chegar fora de ordem, se chegar duplicado ou corrompido, ==o IP não avisa ninguém e não tenta de novo.==

Isso deixa dois buracos, e a camada de transporte existe para tapar os dois.

**Buraco 1 — o IP entrega na máquina, não no programa.** Neste instante seu notebook tem
um navegador, um cliente de e-mail, o Spotify e um resolvedor de **DNS** (*Domain Name
System*, o serviço que traduz nome de máquina em endereço IP) conversando com a rede ao
mesmo tempo. Se a entrega parasse em "chegou para o notebook `10.20.30.40`", o
sistema operacional não teria como saber qual dos quatro programas deve receber cada
pacote. Sem transporte, ==uma máquina só poderia manter uma conversa por vez.==

**Buraco 2 — ninguém garante que a mensagem chegou inteira.** Um pacote perdido no meio do
caminho simplesmente some. Um programa que precise do arquivo inteiro e correto teria de
implementar sozinho numeração, confirmação e retransmissão. Todo programa. De novo. Errado
cada um do seu jeito.

A camada de transporte tapa o buraco 1 **sempre**, para todo mundo, com o conceito de
**porta**. E tapa o buraco 2 **só para quem quiser**, e é aqui que nascem os dois
protocolos:

- o **TCP** (*Transmission Control Protocol*, "protocolo de controle de transmissão") tapa
  o buraco 2 inteiro — numera, confirma, retransmite, reordena, controla o fluxo;
- o **UDP** (*User Datagram Protocol*, "protocolo de datagrama de usuário") não tapa nada
  além do buraco 1 — põe as portas, um comprimento, uma soma de verificação, e manda.

> [!decore]
> **Os dois buracos, e quem tapa cada um.**
> Buraco 1, entregar ao **processo** certo → **porta**. TCP e UDP fazem os dois.
> Buraco 2, entregar **confiavelmente** → **só o TCP**.
> Toda questão deste assunto está perguntando de qual dos dois buracos ela está falando.

**Por que não um protocolo só, confiável, e pronto?** Porque confiabilidade custa três
coisas que nem toda aplicação pode pagar: **tempo de ida e volta** para abrir a conexão
antes do primeiro byte útil, **memória e estado** no servidor para cada cliente, e
**atraso variável** quando algo é retransmitido. Numa chamada de voz, um pacote
retransmitido chega tarde demais para ser tocado — retransmitir é pior que perder. É por
isso que o UDP não é "o TCP capado": ==é uma escolha de projeto, e o que ele entrega em troca é latência previsível e ausência de estado.==

### 1.1 · As camadas vizinhas, e por que cada uma vira alternativa errada

Em quatro das doze questões de prova desta aula, as alternativas são **nomes de camada**, não
nomes de protocolo. Para essas, não basta saber o que o transporte faz: é preciso saber o que
as outras fazem, para eliminá-las. Este é o resumo mínimo, e ele resolve Q03, Q12 e a
pegadinha P8.

| Camada OSI | Nº | O que ela faz | Por que é oferecida como distrator |
|---|---|---|---|
| Aplicação | 7 | serviço final ao usuário — HTTP, SMTP, DNS | o candidato marca "aplicação" porque o exemplo do enunciado é um programa |
| **Apresentação** | 6 | sintaxe e semântica dos dados: codificação, compressão, cifra | "transparente" no enunciado sugere tradução, e tradução sugere apresentação |
| **Sessão** | 5 | **controle de diálogo, gerenciamento de token e sincronização** de uma conversa | "conexão" e "sincronismo" parecem sessão; ver pegadinha P8 |
| **Transporte** | **4** | **entrega ao processo (porta) e, no TCP, confiabilidade fim a fim** | — |
| **Rede** | 3 | endereçamento lógico e roteamento entre redes — é a casa do **IP** | "entrega de pacotes" descreve as duas camadas |
| **Enlace** | 2 | entrega entre dois nós **adjacentes**, em quadros; também faz controle de erro e de fluxo | ==é o vizinho mais perigoso: faz erro e fluxo também, mas **um salto por vez**== |
| Física | 1 | bits no meio — tensão, conector, modulação | raramente engana; entra na lista para completar cinco |

**A regra de corte é uma expressão só:** ==erro e fluxo **fim a fim** é transporte; erro e fluxo **entre nós adjacentes** é enlace.==

E há uma armadilha estrutural, que a questão Q05 explora: ==o modelo TCP/IP tem **quatro** camadas e **não tem camada de sessão nem de apresentação**.== Quando um enunciado disser
"no modelo Internet" e uma alternativa invocar a camada de sessão, ela já está errada pela
moldura, antes mesmo do conteúdo.

> [!analogia] A carta registrada e o panfleto
> **TCP** é carta registrada com aviso de recebimento: numerada, o correio confirma a
> entrega, e o que não for confirmado é enviado de novo. **UDP** é o panfleto jogado por
> baixo da porta: sai mais barato, chega antes, e ninguém fica sabendo se chegou.
> **Onde quebra:** o aviso de recebimento do correio volta por fora e é um por carta; o
> **ACK** do TCP volta dentro da mesma conexão e é **cumulativo** — um único ACK confirma
> tudo o que veio antes dele. E o correio nunca corta uma carta ao meio: o TCP corta, porque
> para ele o que trafega é um **fluxo de bytes** sem fronteira, não uma pilha de cartas.

---

## 2 · O exemplo que atravessa a aula inteira

É o mesmo cenário de R01, R02 e R03, e agora ele fica melhor: **um único gesto seu dispara
os dois protocolos de transporte, em sequência.**

Você está no notebook da rede da TRANSPETRO e digita `http://www.transpetro.com.br` — o
**HTTP** (*HyperText Transfer Protocol*) é o protocolo com que o navegador pede páginas a um
servidor web. Antes
que qualquer conexão TCP exista, o sistema precisa descobrir o endereço IP daquele nome — e
essa pergunta vai por **UDP**. Só depois de receber a resposta é que o navegador abre a
conexão **TCP** com o servidor.

| Elemento | Valor |
|---|---|
| Seu notebook | IP `10.20.30.40/24`, MAC `A4:BB:6D:11:22:33` |
| Roteador de saída (*gateway* padrão) | IP `10.20.30.1` |
| Servidor DNS interno | IP `10.20.30.2`, porta `53` |
| Servidor web | IP `200.150.10.80`, porta `80` |
| Porta efêmera do resolvedor DNS | `54137` |
| Porta efêmera do navegador | `51344` |

**MAC** (*Media Access Control*) é o endereço físico de 48 bits gravado na placa de rede;
**gateway padrão** é o roteador para onde a máquina manda todo pacote cujo destino não
esteja na própria rede local. Os dois foram definidos em R03 e só aparecem aqui para o
cenário ficar completo.

E este é o artefato que a aula inteira vai desmontar — a captura de `tcpdump`, o programa
que imprime os pacotes que passam na interface de rede:

```bash
$ sudo tcpdump -ni enp0s3 -tttt
14:02:11.104233 IP 10.20.30.40.54137 > 10.20.30.2.53: 26518+ A? www.transpetro.com.br. (39)
14:02:11.131902 IP 10.20.30.2.53 > 10.20.30.40.54137: 26518 1/0/0 A 200.150.10.80 (55)
14:02:11.132870 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [S], seq 1829403311, win 64240, options [mss 1460,sackOK,wscale 7], length 0
14:02:11.159344 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [S.], seq 2984771056, ack 1829403312, win 65160, options [mss 1460,sackOK,wscale 7], length 0
14:02:11.159401 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [.], ack 1, win 502, length 0
14:02:11.159620 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [P.], seq 1:78, ack 1, win 502, length 77: HTTP: GET / HTTP/1.1
14:02:11.186012 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [.], ack 78, win 509, length 0
14:02:11.190455 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [P.], seq 1:1449, ack 78, win 509, length 1448: HTTP: HTTP/1.1 200 OK
```

Duas linhas de UDP, seis de TCP, 86 milissegundos no total. **Flag**, ou **bit de código**,
é um bit isolado do cabeçalho TCP que sinaliza o papel daquele segmento; os seis existentes
estão detalhados na seção 5.2. **Como se lê a notação de flags do `tcpdump`**, que é o único
dialeto novo aqui:

| No tcpdump | Significa |
|---|---|
| `[S]` | só o bit **SYN** ligado |
| `[S.]` | **SYN + ACK** — o ponto final é sempre o bit ACK |
| `[.]` | só o **ACK**, sem dados |
| `[P.]` | **PSH + ACK**, o segmento que carrega dados |
| `[F.]` | **FIN + ACK**, o começo do encerramento |
| `[R]` | **RST**, aborto |

Repare em três coisas, porque cada uma vira uma seção adiante:

1. As duas primeiras linhas **não têm flag nenhuma**. Não há `[S]`, não há `[.]`. O UDP não
   tem bits de código porque não tem conexão para abrir nem confirmação para dar.
2. Na linha 4, `ack 1829403312` é exatamente `1829403311 + 1`, o número de sequência que o
   cliente mandou na linha 3, mais um. ==O SYN consome um número de sequência mesmo sem carregar nenhum byte de dado.==
3. Da linha 5 em diante o `tcpdump` passa a mostrar números **relativos** (`seq 1:78`,
   `ack 78`) porque já viu o handshake e sabe de onde a contagem partiu.

---

## 3 · Porta: a função que TCP e UDP têm em comum

### 3.1 · Multiplexação e demultiplexação

**O problema.** O IP entrega no host. Alguém precisa dizer para qual dos programas.

**Como funciona por dentro.** **Porta** é um número inteiro de **16 bits** — de 0 a
**65.535** — que identifica o ponto de comunicação de um processo dentro da máquina. Toda
saída da camada de transporte carrega dois deles: **porta de origem** e **porta de
destino**, e eles são sempre os **dois primeiros campos** do cabeçalho, tanto no TCP quanto
no UDP.

O par (endereço IP, número de porta) chama-se **socket**. E aqui está a assimetria que a
banca gosta:

- o **TCP** identifica uma conexão pela **quádrupla** *(IP de origem, porta de origem, IP
  de destino, porta de destino)*. É por isso que você abre duas abas no mesmo site sem que
  as respostas se misturem: tudo igual, exceto a porta de origem;
- o **UDP** não tem conexão para identificar. Um socket UDP aberto na porta 53 recebe
  datagramas de qualquer origem, e é o programa que decide o que fazer com cada um. É
  também por isso que o UDP suporta **broadcast** (mandar para todos na rede) e
  **multicast** (mandar para um grupo), enquanto ==o TCP é sempre unicast, de uma ponta a uma ponta só.==

**Multiplexação** é o que o lado que envia faz: pegar dados de vários processos e enfiar
todos no mesmo canal de saída, carimbando cada um com sua porta. **Demultiplexação** é o
inverso, do lado que recebe: olhar a porta de destino e entregar ao processo certo.

**Exemplo concreto.** O comando `ss` lista os sockets abertos no Linux. Com o navegador em
duas abas do mesmo site:

```bash
$ ss -tn
State   Recv-Q  Send-Q      Local Address:Port      Peer Address:Port
ESTAB   0       0             10.20.30.40:51344    200.150.10.80:80
ESTAB   0       0             10.20.30.40:51350    200.150.10.80:80
```

Mesmo IP local, mesmo IP remoto, mesma porta 80 do outro lado. O que separa as duas
conexões é `51344` contra `51350`. E o intervalo de onde esses números saem está num
arquivo:

```bash
$ cat /proc/sys/net/ipv4/ip_local_port_range
32768	60999
```

**Palavras que a banca usa:** *"porta"*, *"número de porta"*, *"porta de comunicação"*,
*"multiplexação"*, *"identifica o processo"*, *"corredores de entrada"* (aparece assim numa
questão de varredura de portas do caderno).

**Confunde-se com:** a **porta física** de um switch, que é o conector físico de oito vias (RJ-45) onde se pluga o cabo — questão
`cad.Q591`, da própria TRANSPETRO 2023, usa "porta" nesse sentido, falando de domínio de
colisão. Quando o enunciado fala em *porta do equipamento*, é conector; quando fala em
*porta do serviço*, é número de 16 bits.

> [!analogia] O número publicado e o número de onde você liga
> A **porta bem conhecida** é o telefone que a empresa publica: 80 para web, 53 para DNS.
> A **porta efêmera** é o número do aparelho de onde você ligou — muda a cada ligação e
> ninguém precisa saber qual é de antemão.
> **Onde quebra:** número de telefone é único no mundo; porta é **local à máquina**. A porta
> 80 do seu notebook e a porta 80 do servidor são coisas diferentes, e ==a porta 53/TCP e a porta 53/UDP também são espaços separados== — o mesmo número em dois protocolos de
> transporte pode pertencer a serviços distintos.

### 3.2 · As três faixas da IANA

Quem atribui os números é a **IANA** (*Internet Assigned Numbers Authority*, a autoridade
que administra os números da internet). Ela divide os 65.536 valores em três faixas:

| Faixa | Nome | Quem usa |
|---|---|---|
| **0 – 1023** | **bem conhecidas** (*well-known*) ou de sistema | serviços padronizados; em Unix, só um processo com privilégio de root consegue abrir uma delas |
| **1024 – 49151** | **registradas** (*registered*) | produtos que pediram um número à IANA: 3306 MySQL, 5432 PostgreSQL, 8080 proxy HTTP |
| **49152 – 65535** | **dinâmicas**, **privadas** ou **efêmeras** | sorteadas pelo sistema para o lado que inicia a conexão |

O Linux, na prática, sorteia de 32768 a 60999, como o `cat` acima mostrou — ==a faixa efêmera real do sistema não coincide com a faixa dinâmica da IANA, e a que a prova cobra é a da IANA.==

### 3.3 · As portas bem conhecidas, com o transporte de cada uma

Esta é a tabela que a banca cobra por número exato. A coluna do meio é a que derruba:
**saber a porta não basta, é preciso saber se ela é TCP ou UDP.**

| Porta | Transporte | Serviço |
|---|---|---|
| 20 / 21 | TCP | FTP — dados / controle |
| 22 | TCP | SSH, e com ele SFTP e SCP |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP — **transporte entre servidores** (*relay*) |
| 53 | **UDP e TCP** | DNS — consulta comum em UDP; transferência de zona e resposta grande em TCP |
| 67 / 68 | UDP | DHCP — servidor / cliente |
| 69 | UDP | TFTP |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 123 | UDP | NTP |
| 143 | TCP | IMAP |
| 161 / 162 | UDP | SNMP — consulta ao agente / *trap* para o gerente |
| 389 | TCP (e UDP) | LDAP |
| 443 | TCP (e UDP no HTTP/3) | HTTPS |
| 445 | TCP | SMB / CIFS |
| 465 | TCP | SMTPS — TLS implícito |
| 514 | UDP | syslog |
| **587** | TCP | **SMTP submission** — o cliente entregando ao servidor, com autenticação |
| 636 | TCP | LDAPS |
| 993 | TCP | IMAPS |
| 995 | TCP | POP3S |
| 1812 / 1813 | UDP | RADIUS — autenticação / contabilização |
| 3389 | TCP | RDP |

> [!decore]
> **As que são UDP e você vai errar se não decorar:** 53 (DNS, também TCP), 67/68 (DHCP),
> 69 (TFTP), 123 (NTP), 161/162 (SNMP), 514 (syslog), 1812/1813 (RADIUS).
> **Cada um desses protocolos tem aula própria na semana 2 (R11 a R20)** — aqui o que se
> cobra é só o par número + transporte.
> **O par 25 × 587:** ==25 é servidor falando com servidor; 587 é cliente entregando ao servidor.== Essa distinção é o conteúdo inteiro da questão Q10 desta aula.

### 3.4 · Quando a porta não existe: o ICMP Port Unreachable

**O problema.** Um datagrama chega ao host de destino, o host olha a porta e não há
processo nenhum escutando ali. E agora?

**Como funciona por dentro.** No **UDP**, o host de destino descarta o datagrama e devolve
uma mensagem **ICMP** (*Internet Control Message Protocol*, o protocolo de mensagens de
controle e erro da camada de rede) do **tipo 3** (*Destination Unreachable*, destino
inalcançável) com **código 3** (*Port Unreachable*, porta inalcançável). No **TCP**, a
resposta é outra: o host devolve um segmento com a flag **RST**, que aborta a tentativa.

O ponto de prova é **quem** gera essa mensagem: ==só o host de destino sabe quais portas estão alocadas nele, então é ele mesmo que emite o Port Unreachable==, e não um roteador do
caminho. Um roteador intermediário até gera ICMP tipo 3, mas com outros códigos — código 0
(rede inalcançável) ou 1 (host inalcançável), quando não sabe para onde encaminhar.

**Exemplo concreto.** Mandando um datagrama UDP para uma porta fechada do servidor DNS:

```bash
$ sudo tcpdump -ni enp0s3 icmp or udp port 9999
14:07:02.331120 IP 10.20.30.40.55110 > 10.20.30.2.9999: UDP, length 5
14:07:02.331612 IP 10.20.30.2 > 10.20.30.40: ICMP 10.20.30.2 udp port 9999 unreachable, length 41
```

A resposta veio de `10.20.30.2` — o próprio destino.

**Palavras que a banca usa:** *"a porta do serviço não se encontra alocada"*,
*"Destination Unreachable"*, *"Port Unreachable"*, *"tipo 3 e código 3"*.

**Confunde-se com:** o **RST** do TCP, que faz o mesmo trabalho sem ICMP nenhum; e com o
comportamento de um firewall configurado para **descartar em silêncio** (*drop*), que não
devolve nada — é justamente por isso que uma varredura de portas distingue porta *fechada*
(respondeu RST ou ICMP) de porta *filtrada* (não respondeu nada).

> [!analogia] O porteiro que devolve a encomenda
> A encomenda chega ao prédio certo, o porteiro procura o apartamento no interfone, não
> encontra ninguém com aquele número e devolve ao remetente com o carimbo "destinatário
> não localizado".
> **Onde quebra:** o carteiro do caminho poderia ler o endereço e devolver antes; ==o roteador **não pode**, porque não conhece as portas do destino — ele só enxerga endereço IP.== Por isso quem devolve é sempre o prédio, nunca a rua.

---

## 4 · UDP por dentro: o protocolo definido pelo que ele não faz

**O problema que ele resolve.** Entregar ao processo certo com o menor custo possível, para
quem não pode pagar por confiabilidade — ou para quem prefere implementar a sua.

**Como funciona por dentro.** O cabeçalho UDP tem **8 bytes fixos**, divididos em
**quatro campos de 16 bits cada**:

| Campo | Bits | O que faz |
|---|---|---|
| Porta de origem | 16 | de qual processo saiu; pode ser zero se não se espera resposta |
| Porta de destino | 16 | para qual processo vai — é o campo da demultiplexação |
| **Comprimento** (*Length*) | 16 | tamanho do cabeçalho **mais** os dados, em bytes; o mínimo é 8, que é o cabeçalho vazio |
| **Checksum** (soma de verificação) | 16 | detecta corrupção; **opcional em IPv4**, obrigatório em IPv6 |

E é só isso. Não há número de sequência, não há confirmação, não há janela, não há flags.
**Cada campo que falta é uma função que o UDP não executa:**

- sem número de sequência → **não reordena** e **não elimina duplicatas**;
- sem campo de confirmação → **não retransmite** o que se perdeu;
- sem campo de janela → **não faz controle de fluxo** nem de congestionamento;
- sem flags → **não abre nem fecha conexão**; não existe handshake UDP.

O **checksum** merece uma frase, porque é o único mecanismo de erro que o UDP tem, e ele é
menos do que parece: uma soma de verificação de 16 bits **detecta** que o conteúdo chegou
corrompido e faz o receptor **descartar o datagrama em silêncio**. Não corrige, não avisa a
origem, não pede de novo. Ele é calculado sobre um **pseudocabeçalho** — um bloco fictício
com os endereços IP de origem e destino, o número do protocolo e o comprimento — o que
permite detectar também um datagrama que chegou à máquina errada.

Em troca de tudo o que não faz, o UDP entrega quatro coisas:

1. **Zero tempo de abertura.** O primeiro datagrama já carrega dado útil.
2. **Sem estado no servidor.** Um servidor DNS atende milhões de consultas sem guardar
   nada entre uma e outra — e, por consequência, ==é imune ao SYN flood, porque não há conexão pendente para acumular.==
3. **Latência previsível.** Nada é retransmitido, então nada chega atrasado por causa de
   uma retransmissão.
4. **Fronteira de mensagem preservada.** Um `sendto()` de 40 bytes vira exatamente um
   datagrama de 40 bytes, e o outro lado o lê inteiro numa operação só. ==O TCP não tem essa propriedade: para ele existe um fluxo de bytes, e a divisão em segmentos não tem relação com a divisão em mensagens da aplicação.==

**Exemplo concreto.** A consulta DNS do nosso cenário, do jeito que ela aparece no
`tcpdump` e no `ss`:

```bash
$ dig +short www.transpetro.com.br @10.20.30.2
200.150.10.80

$ sudo tcpdump -ni enp0s3 udp port 53
14:02:11.104233 IP 10.20.30.40.54137 > 10.20.30.2.53: 26518+ A? www.transpetro.com.br. (39)
14:02:11.131902 IP 10.20.30.2.53 > 10.20.30.40.54137: 26518 1/0/0 A 200.150.10.80 (55)

$ ss -uan | head -3
State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port
UNCONN  0       0              0.0.0.0:53          0.0.0.0:*
```

Dois pacotes, 27 milissegundos, e a coluna `State` diz `UNCONN` — *unconnected*. ==Um socket UDP nunca aparece como `ESTAB`, porque não existe conexão UDP para estar estabelecida.==
Os 39 e os 55 entre parênteses são o tamanho da mensagem DNS; some 8 bytes de UDP e 20 de
IP e você tem o pacote na linha.

**Quem usa UDP:** DNS (consulta), DHCP, TFTP, NTP, SNMP, syslog, RADIUS, voz e vídeo em
tempo real — o **RTP**, *Real-time Transport Protocol* —, jogos online, e o **QUIC**
(*Quick UDP Internet Connections*), o transporte do **HTTP/3**, que roda sobre
UDP e reimplementa confiabilidade e criptografia dentro da aplicação, para não depender do
TCP do sistema operacional.

**Palavras que a banca usa:** *"não orientado a conexão"*, *"sem conexão"*, *"não
confiável"*, *"melhor esforço"*, *"sem vinculação lógica entre origem e destino"*,
*"datagrama"*, *"leve"*, *"baixo overhead"*.

**Confunde-se com:** o **IP**, que também é sem conexão e de melhor esforço — e é
exatamente esse parentesco que a banca explora, oferecendo o IP como se fosse transporte. A
diferença: ==o IP entrega na máquina e não tem porta; o UDP entrega no processo e tem porta.== Confunde-se também com a ideia de que UDP "é mais simples, logo está numa camada
mais baixa" — a alternativa D da questão Q05 desta aula é literalmente isso.

> [!analogia] O rádio amador e o telefone
> UDP é rádio: você aperta o botão e fala. Se ninguém estiver ouvindo, a mensagem se
> perde e você nunca fica sabendo. TCP é telefone: alguém precisa atender antes.
> **Onde quebra:** no rádio, quem está na frequência ouve tudo o que passa; ==um datagrama UDP tem endereço e porta de destino e só é entregue a quem tem aquele socket aberto.==
> O paralelo com "todo mundo ouve" só vale no caso particular do broadcast.

---

## 5 · TCP por dentro

### 5.1 · O cabeçalho, campo a campo

**O problema.** Tudo o que o TCP promete — ordem, confirmação, retransmissão, controle de
fluxo — precisa de espaço no cabeçalho para ser negociado. Daí os **20 bytes mínimos**,
contra os 8 do UDP.

| Campo | Bits | O que faz |
|---|---|---|
| Porta de origem / de destino | 16 + 16 | mesma função do UDP |
| **Número de sequência** (*sequence number*) | 32 | posição, no fluxo, do **primeiro byte de dado** deste segmento |
| **Número de confirmação** (*acknowledgement number*) | 32 | o **próximo byte que este lado espera receber**; só vale se a flag ACK estiver ligada |
| **Deslocamento de dados** (*data offset*, ou HLEN) | 4 | tamanho do cabeçalho em palavras de 32 bits — é o que permite saber onde acabam as opções |
| Reservado | 3 a 6 | não usado |
| **Bits de código** (*flags*) | 6 | URG, ACK, PSH, RST, SYN, FIN — a seção 5.2 |
| **Janela** (*window*) | 16 | quantos bytes este lado ainda aceita receber — o anúncio de janela |
| **Checksum** | 16 | soma de verificação, obrigatória, calculada sobre pseudocabeçalho + cabeçalho + dados |
| Ponteiro de urgência | 16 | só faz sentido com a flag URG; praticamente não se usa |
| **Opções** | 0 a 320 | MSS, escala de janela, SACK permitido, *timestamps* |

Três detalhes que a banca cobra:

- ==O número de sequência conta **bytes**, não segmentos.== Se o segmento carrega os bytes
  1 a 77 do fluxo, o seguinte começa em 78. É isso que a linha 6 do nosso `tcpdump` mostra
  com `seq 1:78`, e a linha 7, com `ack 78`.
- **A confirmação é cumulativa.** `ack 78` não quer dizer "recebi o byte 78": quer dizer
  ==recebi tudo até o 77 e espero o 78.== Um ACK perdido não é problema, porque o próximo
  confirma tudo de novo.
- **MSS** (*Maximum Segment Size*, tamanho máximo de segmento) é o maior bloco de **dados**
  que cabe num segmento, anunciado nas opções durante o handshake. No nosso cenário é
  `mss 1460` — os 1500 bytes de **payload** — a carga útil, o que sobra do quadro Ethernet depois do
  cabeçalho dele — menos 20 de IP e 20 de TCP.
  Não confunda com **MTU** (*Maximum Transmission Unit*), que é o tamanho do quadro inteiro
  na camada de baixo, e vale 1500.

**Palavras que a banca usa** para este cabeçalho: *"campo de bits de código"*, *"número de
sequência"*, *"número de confirmação"*, *"tamanho da janela"*, *"soma de verificação"*.
==Quando o enunciado citar um campo pelo nome, ele está fixando a resposta naquele mecanismo== — "tamanho da janela" é controle de fluxo, "bits de código" é handshake ou
encerramento.

### 5.2 · Os bits de código, um a um

**O problema.** As duas pontas precisam de um jeito compacto de dizer "estou abrindo",
"estou confirmando", "estou fechando", "desisti". Seis bits resolvem.

Esta é a seção mais rentável da aula, porque **a banca monta a grade de alternativas
permutando exatamente estes seis bits** — é a assinatura T4 descrita no
`perfil-da-banca-CESGRANRIO-TI.md` §3.

| Flag | Nome | O que significa | Onde aparece |
|---|---|---|---|
| **SYN** | *synchronize* | "sincronize os números de sequência comigo" — **só na abertura** | etapas 1 e 2 do handshake |
| **ACK** | *acknowledgement* | "o campo Número de confirmação deste segmento é válido" | etapa 2 em diante — ==fica ligado em praticamente todo segmento depois do primeiro== |
| **FIN** | *finish* | "não tenho mais nada a enviar nesta direção" | encerramento normal |
| **RST** | *reset* | "aborte esta conexão agora" — encerramento anormal | porta fechada, estado inconsistente, `RST` de firewall |
| **PSH** | *push* | "entregue à aplicação já, não espere encher o **buffer**" — buffer é a área de memória em que o sistema acumula os bytes recebidos antes de passá-los ao programa | segmentos com dados |
| **URG** | *urgent* | marca dado urgente, com o ponteiro de urgência | obsoleto na prática |

**Como funciona por dentro.** São bits independentes: podem estar ligados juntos. Daí
`SYN+ACK` na segunda etapa e `FIN+ACK` no encerramento. Um segmento com **zero bytes de
dados e só o ACK ligado** é o que se chama de ACK puro — é a linha 5 e a linha 7 do nosso
`tcpdump`, ambas com `length 0`.

**Exemplo concreto.** Duas linhas da nossa captura, com os bits explícitos:

```
Flags [S],  seq 1829403311   -> SYN=1, ACK=0, FIN=0.  Abre.
Flags [S.], seq 2984771056, ack 1829403312
                             -> SYN=1, ACK=1.         Abre a volta e confirma a ida.
```

**Palavras que a banca usa:** *"campo de bits de código do cabeçalho TCP"* (é assim,
exatamente assim, no enunciado da questão do CNU 2024), *"o bit SYN é marcado"*,
*"os bits SYN e ACK são marcados"*, *"flag"*.

**Confunde-se com:** o **FIN**, plantado como terceira etapa da abertura em duas das cinco
alternativas da questão Q04 desta aula. ==FIN nunca participa da abertura. SYN nunca participa do encerramento.== Guarde essa frase; ela sozinha elimina três alternativas.

> [!analogia] As caixinhas do formulário
> Cada bit de código é uma caixinha que se marca ou não: "isto é uma abertura", "isto
> confirma algo", "isto encerra".
> **Onde quebra:** num formulário as opções costumam ser exclusivas — marcar uma desmarca a
> outra. ==Aqui várias podem estar marcadas ao mesmo tempo, e é exatamente a combinação SYN+ACK que faz o handshake ter três etapas em vez de quatro.== A grade de alternativas da
> banca vive dessa combinação.

### 5.3 · O handshake de três vias

**O problema.** Antes do primeiro byte útil, as duas pontas precisam concordar em três
coisas: que ambas estão vivas, de que número cada uma vai começar a contar seus bytes, e
que parâmetros vão usar (MSS, escala de janela, SACK). Um único pacote não resolve, porque
==cada lado precisa saber que o outro recebeu o número de sequência dele.==

**Como funciona por dentro.** Três segmentos, nesta ordem:

| # | Direção | Flags | Conteúdo | Estado em que o emissor entra |
|---|---|---|---|---|
| 1 | cliente → servidor | **SYN** | `seq = x`, o ISN do cliente | `SYN_SENT` |
| 2 | servidor → cliente | **SYN + ACK** | `seq = y` (ISN do servidor), `ack = x+1` | `SYN_RECEIVED` |
| 3 | cliente → servidor | **ACK** | `seq = x+1`, `ack = y+1` | `ESTABLISHED` |

**ISN** (*Initial Sequence Number*, número de sequência inicial) é o ponto de partida da
contagem de bytes, e ele **não é zero**: é um valor pseudoaleatório. Duas razões — impedir
que um segmento atrasado de uma conexão antiga entre no meio de uma nova entre o mesmo par
de sockets, e dificultar que um atacante adivinhe o número e injete dados numa conexão
alheia.

**Por que três e não duas.** A etapa 2 confirma o SYN do cliente; a etapa 3 confirma o SYN
do servidor. Como cada direção do TCP é independente (ele é **full-duplex**: os dois lados
transmitem ao mesmo tempo, cada direção com sua numeração), ==são duas aberturas, e a do meio foi economizada juntando SYN e ACK no mesmo segmento.== O enunciado da questão do CNU
diz isso com todas as letras: *"esse handshake é necessário e suficiente"*.

**Exemplo concreto.** As linhas 3, 4 e 5 da nossa captura:

```
10.20.30.40.51344   > 200.150.10.80.80: Flags [S],  seq 1829403311, win 64240
200.150.10.80.80    > 10.20.30.40.51344: Flags [S.], seq 2984771056, ack 1829403312
10.20.30.40.51344   > 200.150.10.80.80: Flags [.],  ack 1
```

`1829403312 = 1829403311 + 1`, apesar de o primeiro segmento ter `length 0`. **O SYN
consome um número de sequência**, e o FIN também — é a única exceção à regra de que a
numeração conta bytes de dados.

O custo disso é **um RTT** (*Round-Trip Time*, tempo de ida e volta) antes do primeiro byte
útil: no nosso cenário, `14:02:11.159620 − 14:02:11.132870 = 26,7 ms` de espera pura antes
do `GET`.

> [!analogia] O "alô" do telefone
> — Alô? / — Alô, oi! / — Oi. Três falas antes do assunto, e nenhuma delas é o assunto.
> **Onde quebra:** no telefone antigo o circuito ficava **reservado** de ponta a ponta
> durante toda a ligação. ==No TCP não há circuito reservado nenhum: a "conexão" é só um par de estados guardados nas duas pontas==, e os segmentos podem tomar rotas diferentes
> a cada momento. Por isso a rede não sabe que a sua conexão existe — só os dois hosts sabem.

**O que acontece quando o handshake não termina — e o SYN flood.** Entre a etapa 2 e a
etapa 3, o servidor guardou estado para uma conexão que ainda não existe: é a
**conexão meio-aberta** (*half-open*), na fila de *backlog*. Um atacante que dispare
milhares de SYN com endereço de origem falso, e nunca mande o terceiro segmento, enche essa
fila e o servidor passa a recusar conexões legítimas. Isso é o **SYN flood**, e é a questão
Q09 desta aula. ==A defesa clássica é o *SYN cookie*: o servidor não guarda estado nenhum na etapa 2, e codifica a informação dentro do próprio ISN que ele devolve.==

### 5.4 · Confiabilidade: o que "confiável" quer dizer, mecanismo por mecanismo

**O problema.** A camada de baixo perde, duplica, reordena e corrompe. A aplicação quer os
bytes na ordem, uma vez cada, íntegros.

**Como funciona por dentro.** Cinco mecanismos, e a banca já cobrou pelo menos três:

1. **Numeração de bytes.** Cada byte do fluxo tem uma posição. Segmento perdido é lacuna
   identificável.
2. **Confirmação cumulativa (ACK).** O receptor devolve o número do próximo byte esperado.
   Cumulativo significa que um ACK confirma tudo até ali — perder um ACK não custa
   retransmissão, porque o próximo cobre. ==O TCP só tem confirmação **positiva**: não existe NAK, confirmação negativa, no protocolo.== O receptor nunca diz "não recebi";
   ele apenas repete o último ACK, e é o emissor que tira a conclusão.
3. **Retransmissão por temporizador (RTO).** O emissor guarda cada segmento enviado até ser
   confirmado. Se o **RTO** (*Retransmission TimeOut*) estourar antes, ele reenvia. O RTO
   não é fixo: é calculado a partir do **RTT** medido, com média e desvio (o algoritmo de
   Jacobson), porque uma rede de 2 ms e uma de 300 ms não podem usar o mesmo prazo.
4. **Retransmissão rápida** (*fast retransmit*). Esperar o RTO é lento. Se o emissor recebe
   **três ACKs duplicados** — três vezes o mesmo "espero o byte N" —, ele conclui que o
   segmento N se perdeu e retransmite sem esperar o temporizador.
5. **Checksum e descarte.** Segmento corrompido é descartado silenciosamente pelo receptor;
   como ele não é confirmado, o RTO o traz de volta. ==A detecção de erro do TCP não corrige nada: ela transforma corrupção em perda, e a perda é resolvida pela retransmissão.==

Ainda há o **SACK** (*Selective ACKnowledgement*, confirmação seletiva), uma opção que
permite ao receptor dizer "recebi de 1 a 1000 e de 2001 a 3000", para o emissor retransmitir
só o buraco. É o `sackOK` que aparece nas opções do nosso handshake.

**Exemplo concreto.** Uma perda real, vista no `tcpdump` do servidor:

```
14:02:12.401118 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [.], seq 1449:2897, ack 78, length 1448
14:02:12.428009 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [.], ack 1449, length 0
14:02:12.428455 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [.], ack 1449, length 0
14:02:12.429001 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [.], ack 1449, length 0
14:02:12.429512 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [.], seq 1449:2897, ack 78, length 1448
```

Três `ack 1449` seguidos — três ACKs duplicados — e o servidor reenvia o segmento que
começa em 1449 em menos de 1,5 ms, sem esperar o RTO.

**Palavras que a banca usa:** *"assegura a entrega"*, *"entrega confiável"*, *"o receptor
confirma cada pacote recebido"*, *"controle de erro fim a fim"*, *"recuperação de erro"*,
*"transferência confiável e transparente"*.

> [!analogia] O ditado por telefone
> Você dita um texto e a outra pessoa repete de vez em quando: "estou no ponto 78". Se ela
> parar de avançar, você sabe onde recomeçar.
> **Onde quebra:** num ditado de verdade quem não entendeu **pede para repetir**. ==O TCP não tem pedido de repetição: não existe NAK.== O receptor apenas repete o último ponto correto,
> e é o emissor que tira a conclusão — daí a retransmissão rápida por três ACKs duplicados.

**Confunde-se com:** **segurança**. ==Uma conexão TCP é confiável e completamente aberta: qualquer um que capture o tráfego lê tudo.== "Confiável" quer dizer "chega inteiro e na
ordem", nunca "chega em sigilo". Quem cifra é o TLS, acima do TCP. Confunde-se também com o
controle de erro da **camada de enlace**, que existe — mas entre nós **adjacentes**, um
salto por vez, não fim a fim.

### 5.5 · Controle de fluxo: a janela deslizante

**O problema.** O emissor pode ser um servidor de 40 Gbps e o receptor, um sensor com 8 KB
de memória. Sem freio, o emissor afoga o receptor e todo o excesso é descartado e
retransmitido — trabalho puro jogado fora.

**Como funciona por dentro.** O receptor publica, no campo **Janela** de 16 bits de todo
segmento que envia, ==quantos bytes ainda cabem no buffer dele.== Isso se chama **anúncio
de janela** (*window advertisement*). O emissor nunca pode ter mais bytes não confirmados
em trânsito do que esse número. Conforme os ACKs chegam, a borda esquerda da janela avança
— daí o nome **janela deslizante** (*sliding window*).

Como o campo tem 16 bits, o teto natural é **65.535 bytes**. A opção **escala de janela**
(*window scale*, o `wscale 7` das nossas opções) multiplica o valor anunciado por uma
potência de 2, chegando até 1 GB — sem ela, uma conexão de longa distância e alta banda
nunca encheria o canal.

Três situações que a banca cobra:

- **Janela zero.** Buffer cheio: o receptor anuncia `win 0` e o emissor **para**.
- **O risco do impasse.** O ACK que reabre a janela pode se perder, e aí os dois lados
  esperam para sempre. O TCP resolve com o **temporizador de persistência**
  (*persist timer*) e a **sondagem de janela** (*window probe*): o emissor manda de tempos
  em tempos um segmento mínimo só para arrancar do receptor um anúncio novo.
- **A síndrome da janela tola** (*silly window syndrome*). O receptor libera 1 byte de
  buffer e anuncia janela 1; o emissor manda um segmento de 1 byte de dado com 40 bytes de
  cabeçalho; o buffer enche de novo; e a conexão passa a trabalhar com eficiência ridícula.
  As duas curas: pelo lado do **receptor**, a solução de **Clark** — só anunciar janela
  quando houver espaço razoável (um MSS ou metade do buffer); pelo lado do **emissor**, o
  **algoritmo de Nagle** — acumular os dados pequenos e só mandar quando houver um MSS
  cheio ou quando o ACK anterior chegar.

**Exemplo concreto.** No nosso cenário, `win 64240` no primeiro SYN e `win 502` na linha 5.
502 não é uma janela de 502 bytes: com `wscale 7`, é `502 × 2⁷ = 64.256 bytes`. ==O valor que o tcpdump imprime depois do handshake já está na escala negociada, e ler esse número como bytes é erro clássico.==

**Palavras que a banca usa:** *"janela deslizante"*, *"anúncio de janela"*, *"tamanho da
janela"*, *"janela zero"*, *"síndrome da janela tola"*, *"para evitar receber mais dados do
que pode armazenar"*, *"controle de fluxo"*.

**Confunde-se com:** o controle de **congestionamento**, a seguir. É a distinção mais
cobrada desta seção.

> [!analogia] A caixa d'água com boia
> A boia da caixa fecha a entrada conforme o nível sobe. O anúncio de janela é a boia: ele
> diz ao emissor quanto ainda cabe.
> **Onde quebra:** a boia age sozinha, mecanicamente, na própria caixa. ==O anúncio de janela é uma informação que precisa **viajar** até o emissor dentro de um segmento — e esse segmento pode se perder==, o que travaria a conexão para sempre se não existisse a
> sondagem de janela. A boia nunca precisa de um plano B; a janela precisa.

### 5.6 · Controle de congestionamento: o mecanismo que protege a rede, não o receptor

**O problema.** O receptor pode aguentar 1 MB, mas o roteador no meio do caminho tem uma
fila de 200 KB. O controle de fluxo não vê esse roteador. Se todo mundo mandar no máximo
que o receptor aceita, a rede entra em **colapso por congestionamento** — foi o que
aconteceu de verdade na internet em 1986, e é a razão de o mecanismo existir.

**Como funciona por dentro.** O emissor mantém uma segunda janela, a **janela de
congestionamento** (*cwnd*), que **ninguém anuncia**: ele a estima sozinho, usando a perda
de pacotes como sinal de que a rede está cheia. E transmite pelo menor dos dois limites:

> **janela efetiva = mínimo (janela anunciada pelo receptor, janela de congestionamento)**

As fases clássicas: **partida lenta** (*slow start*), em que a cwnd dobra a cada RTT;
**prevenção de congestionamento** (*congestion avoidance*), em que ela cresce de um MSS por
RTT; e a redução drástica quando há perda. O padrão é AIMD — aumento aditivo, redução
multiplicativa.

**Exemplo concreto.** Uma conexão com janela anunciada de 64 KB numa rede congestionada
pode estar transmitindo com cwnd de 4 KB. ==O receptor tem espaço, e mesmo assim o emissor segura — porque quem está cheio é o caminho, não a ponta.==

**Palavras que a banca usa:** *"congestionamento"*, *"partida lenta"*, *"a rede fica muito
sobrecarregada"*.

**Confunde-se com:** o controle de fluxo. A regra de bolso que resolve toda questão sobre
isso: ==controle de **fluxo** protege o **receptor** e é **anunciado**; controle de **congestionamento** protege a **rede** e é **estimado**.== O UDP não tem nenhum dos dois.

> [!analogia] A garagem e a avenida
> O controle de **fluxo** pergunta se ainda cabe carro na **garagem** do destino. O controle
> de **congestionamento** pergunta se a **avenida** está engarrafada. São duas perguntas
> diferentes, e a resposta a uma não serve para a outra.
> **Onde quebra:** no trânsito você **vê** o engarrafamento. ==O emissor TCP não enxerga a rede: ele infere o congestionamento pela perda de pacotes==, o que o faz reagir tarde e
> reagir também a perdas que nada têm a ver com fila cheia — um enlace sem fio ruim, por
> exemplo, faz o TCP frear sem que haja engarrafamento nenhum.

### 5.7 · Encerramento: quatro segmentos, não três

**O problema.** Cada direção da conexão é independente. Um lado pode ter acabado de falar e
ainda ter muito a ouvir. Fechar tudo de uma vez perderia dados.

**Como funciona por dentro.** O encerramento normal usa **quatro segmentos** — o
*four-way handshake* — porque cada direção é fechada em separado:

| # | Direção | Flag | Efeito |
|---|---|---|---|
| 1 | A → B | **FIN** | "acabei de falar"; A entra em `FIN_WAIT_1` |
| 2 | B → A | **ACK** | B confirma; entra em `CLOSE_WAIT`, e **ainda pode enviar dados** |
| 3 | B → A | **FIN** | quando B também acaba; B entra em `LAST_ACK` |
| 4 | A → B | **ACK** | A confirma e entra em **`TIME_WAIT`** |

O estado entre 2 e 3 chama-se **fechamento parcial** (*half-close*): a conexão está aberta
numa direção e fechada na outra. Na prática, as etapas 2 e 3 costumam vir juntas num só
segmento `FIN+ACK`, e a captura mostra três linhas — mas ==o encerramento **normal** do TCP é descrito como de quatro segmentos, e é assim que a prova cobra.==

O **TIME_WAIT** dura **2 × MSL** (*Maximum Segment Lifetime*, o tempo máximo que um
segmento pode viver na rede — 2 minutos na RFC 793, 30 s na prática do Linux, dando
60 s de TIME_WAIT). Ele existe por duas razões: garantir que o último ACK chegue, e impedir
que um segmento atrasado desta conexão apareça dentro da próxima que use a mesma quádrupla.

Há ainda o **encerramento anormal**: um segmento com a flag **RST** derruba a conexão na
hora, sem negociação e sem TIME_WAIT. É o que um host devolve quando chega um SYN para uma
porta TCP fechada.

**Exemplo concreto.**

```bash
$ sudo tcpdump -ni enp0s3 'tcp port 80 and (tcp[tcpflags] & (tcp-fin|tcp-rst) != 0)'
14:02:16.902114 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [F.], seq 78, ack 3312
14:02:16.928330 IP 200.150.10.80.80 > 10.20.30.40.51344: Flags [F.], seq 3312, ack 79
14:02:16.928402 IP 10.20.30.40.51344 > 200.150.10.80.80: Flags [.], ack 3313

$ ss -tan | grep 51344
TIME-WAIT  0  0   10.20.30.40:51344   200.150.10.80:80
```

`ack 79` confirma o byte 78 **mais um**: o FIN, como o SYN, consome um número de sequência.

**Palavras que a banca usa:** *"encerramento da conexão"*, *"liberação da conexão"*,
*"FIN"*, *"RST"*, *"aborto"*.

**Confunde-se com:** a abertura. ==FIN nunca aparece no handshake de três vias, e SYN nunca aparece no encerramento.== Duas das cinco alternativas da questão Q04 desta aula existem só
para pegar quem não guardou isso.

> [!analogia] As duas assinaturas do distrato
> Cada parte assina a rescisão da sua obrigação, e cada assinatura é acusada pela outra
> parte: quatro atos, não dois.
> **Onde quebra:** num distrato as assinaturas costumam ser simultâneas. ==Aqui o intervalo entre a primeira e a segunda é legítimo e pode durar muito: é o `CLOSE_WAIT`, em que um lado já parou de falar e o outro ainda está enviando.== E, terminado tudo, quem assinou por
> último ainda cumpre o `TIME_WAIT` — uma espera obrigatória sem equivalente em contrato
> nenhum.

---

## 6 · TCP × UDP: a tabela que a banca troca

| | **TCP** | **UDP** |
|---|---|---|
| Nome por extenso | *Transmission Control Protocol* | *User Datagram Protocol* |
| Camada | transporte (4 no OSI) | transporte (4 no OSI) |
| Número no campo Protocolo do IPv4 | **6** | **17** |
| Conexão | **orientado à conexão**, com handshake de 3 vias | **sem conexão** |
| **PDU** (*Protocol Data Unit*, o nome da unidade de dados daquela camada) | **segmento** | **datagrama** (ou datagrama de usuário) |
| Cabeçalho | **20 bytes** mínimos, até 60 com opções | **8 bytes**, fixos |
| Entrega | **confiável**: confirma e retransmite | **melhor esforço**: manda e esquece |
| Ordem | garante a ordem na entrega à aplicação | não garante |
| Duplicatas | elimina | não elimina |
| Detecção de erro | checksum obrigatório | checksum opcional em IPv4, obrigatório em IPv6 |
| Controle de fluxo | **sim**, janela deslizante anunciada | não |
| Controle de congestionamento | **sim**, janela estimada | não |
| Fronteira de mensagem | **não** — é um fluxo de bytes | **sim** — um datagrama, uma leitura |
| Modo | full-duplex, **unicast** apenas | suporta **broadcast e multicast** |
| Estado no servidor | um bloco de controle por conexão | nenhum |
| Custo antes do 1º byte útil | **1 RTT** | zero |
| Aplicações típicas | HTTP, HTTPS, SMTP, FTP, SSH, Telnet, IMAP, POP3, LDAP, RDP, transferência de zona DNS | DNS, DHCP, TFTP, NTP, SNMP, syslog, RADIUS, RTP, QUIC/HTTP-3 |

> [!decore]
> **Seis pares que se opõem, para evocar de memória:**
> segmento × datagrama · 20 bytes × 8 bytes · 6 × 17 no campo Protocolo ·
> orientado à conexão × sem conexão · confiável × melhor esforço · unicast × multicast.

---

## 7 · Os falsos protocolos de transporte — a seção que mais vale pontos

Esta é a maior fonte de erradas do assunto. Em **4 das 12 questões de prova** desta aula, a
alternativa mais tentadora depois do gabarito é um protocolo **real**, com sigla familiar,
que ==não é de transporte==. É a assinatura **T2** do perfil da banca: irmão taxonômico
real, com um atributo discriminante escondido no enunciado.

Aqui está cada um, com o que ele realmente faz e por que ele parece transporte:

**IP** — *Internet Protocol*. **Camada de rede** (inter-rede, no TCP/IP). Endereça e roteia
pacotes entre máquinas. **Por que engana:** é sem conexão e de melhor esforço, exatamente
como o UDP, e o enunciado que descreve "entrega não confiável" combina com os dois.
**O que separa:** ==o IP não tem porta e entrega na **máquina**; o UDP tem porta e entrega no **processo**.== Foi alternativa errada em `cad.Q575`, `cad.Q556` (em três das cinco
opções) e `cad.Q558`.

**ICMP** — *Internet Control Message Protocol*. **Camada de rede**, protocolo número 1 no
campo Protocolo do IPv4. Transporta mensagens de controle e erro: `echo request`/`echo
reply` (tipos 8 e 0, o `ping`), *Time Exceeded* (tipo 11, o que faz o `traceroute`
funcionar), *Destination Unreachable* (tipo 3). **Por que engana:** ele é encapsulado
dentro do IP, como o TCP e o UDP, e "mensagem" soa como conteúdo de aplicação.
**O que separa:** ==ICMP não tem porta e não carrega dados de aplicação; ele existe para falar **sobre** a rede, não **através** dela.== Foi alternativa errada em `cad.Q575` e
`cad.Q558`.

**ARP** — *Address Resolution Protocol*. Descobre o **endereço MAC** correspondente a um
endereço IP na mesma rede local. **Por que engana:** trabalha com endereços IP.
**O que separa:** ==o ARP não é encapsulado em IP — ele vai direto no quadro Ethernet, com ethertype `0x0806`==, e nunca sai da rede local. Foi alternativa errada em `cad.Q575`.

**IGMP** — *Internet Group Management Protocol*. **Camada de rede**, protocolo número 2.
Gerencia quem entra e quem sai de um grupo multicast. **Por que engana:** a sigla é vizinha
do ICMP e a banca costuma escrevê-la errada de propósito. Na questão `cad.Q558`, a
alternativa D oferece *"Internet Group **Message** Protocol"* — ==o nome correto é Management, e a troca de uma palavra é um distrator T1 empilhado sobre o T2.==

**Os transportes de verdade que quase nunca caem:** **SCTP** (*Stream Control Transmission
Protocol*, protocolo 132) e **DCCP** (protocolo 33). Existem, são camada 4, e valem uma
linha de memória caso apareçam numa lista.

**O atalho definitivo, e ele é numérico.** O cabeçalho do **IPv4** (a versão 4 do IP, a que
usa endereços de 32 bits como `10.20.30.40`) tem um campo **Protocolo** de 8 bits, que diz o
que vem encapsulado dentro:

| Valor | Protocolo | Camada |
|---|---|---|
| 1 | ICMP | rede |
| 2 | IGMP | rede |
| **6** | **TCP** | **transporte** |
| 17 | UDP | transporte |
| 41 | IPv6 encapsulado | rede |
| 50 / 51 | ESP / AH — os dois protocolos do **IPsec**, o conjunto de segurança da camada de rede | rede |
| 132 | SCTP | transporte |

==Se o protocolo tem um número nesse campo, ele está **acima** do IP. E dos que estão acima do IP, só TCP, UDP e SCTP são de transporte.==

> [!analogia] A lista do interfone
> O campo Protocolo do IPv4 é a lista de quem mora acima do IP: o 1 é o ICMP, o 6 é o TCP,
> o 17 é o UDP.
> **Onde quebra:** ==morar acima do IP não faz de ninguém transporte.== O ICMP está na lista
> e só fala **sobre** o prédio — não entrega nada a ninguém. E o **ARP nem aparece na
> lista**, porque ele não mora acima do IP: ele fica ao lado, direto no quadro Ethernet, com
> ethertype `0x0806`. Dois motivos diferentes para a mesma sigla não ser transporte.

---

## 8 · Palavra do enunciado → conceito

Esta é a tabela de maior retorno por linha da aula. Cada expressão da coluna da esquerda já
apareceu, nessas palavras, em questão da CESGRANRIO.

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "orientado à conexão", "estabelece uma conexão lógica" | **TCP** | HTTP "com estado" — isso é a aplicação, não o transporte |
| "não orientado a conexão", "sem vinculação lógica entre origem e destino" | **UDP** | o IP, que também é sem conexão, mas não tem porta |
| "fim a fim", "ponta a ponta", "entre as extremidades" | camada de **transporte** | o enlace, que faz erro e fluxo entre nós **adjacentes** |
| "assegura a entrega", "transferência confiável e transparente" | **TCP** | segurança — confiável não é sigiloso |
| "melhor esforço", "a entrega não é confiável" | **IP** ou **UDP** | os dois cabem; o que decide é a presença de porta |
| "o receptor confirma cada pacote recebido" | **ACK** do TCP | o checksum, que só detecta e descarta |
| "handshake de três vias", "campo de bits de código" | abertura do TCP: **SYN → SYN+ACK → ACK** | o encerramento, que é de quatro e usa FIN |
| "sincronismo entre as duas extremidades da conexão" | **SYN** e o ISN | sincronização de diálogo, que é camada de **sessão** |
| "janela deslizante", "anúncio de janela", "janela zero" | **controle de fluxo** do TCP | controle de congestionamento |
| "síndrome da janela tola" | *silly window syndrome* — Clark e Nagle | perda de pacote |
| "a rede fica muito sobrecarregada" | **congestionamento** | buffer cheio no receptor |
| "segmento" | PDU do **TCP** | "datagrama", que é do **UDP** e do IP |
| "datagrama" | **UDP** ou **IP** | segmento |
| "porta", "número de porta", "corredores de entrada" | multiplexação da camada de transporte | porta física do switch |
| "bem conhecidas", "well-known" | portas **0 a 1023** | registradas, 1024–49151 |
| "dinâmicas", "privadas", "efêmeras" | portas **49152 a 65535** | a faixa real do Linux, 32768–60999 |
| "a porta do serviço não se encontra alocada" | **ICMP tipo 3 código 3**, gerado pelo **destino** | RST, que é a resposta equivalente do TCP |
| "inundação", "flood", "conexões meio-abertas" | **SYN flood** | DRDoS (*Distributed Reflection DoS*), que inunda com SYN/ACK refletido |
| "transferência de zona" | DNS sobre **TCP**, porta 53 | a consulta comum, que é UDP |
| "submissão de mensagens", "Message Submission" | SMTP porta **587** | porta 25, que é o relay entre servidores |
| "controle de diálogo, gerenciamento de token, sincronização" | camada de **sessão** | transporte |

---

## Onde a banca derruba

> [!pegadinha] P1 — Confiável não quer dizer seguro
> "Serviço confiável", no TCP, significa **chega inteiro, na ordem e uma vez só**. Não
> significa cifrado, não significa autenticado. ==Toda uma conexão TCP pode ser lida por quem estiver no caminho.== Quem cifra é o **TLS** (*Transport Layer Security*, o protocolo que acrescenta sigilo e
> autenticação **acima** do TCP — é o "S" do HTTPS). Se o enunciado ligar
> "confiável" a "sigiloso", a alternativa está errada.

> [!pegadinha] P2 — Controle de fluxo × controle de congestionamento
> São dois mecanismos diferentes com o mesmo verbo. **Fluxo** protege o **receptor** e usa
> a janela **anunciada** no cabeçalho. **Congestionamento** protege a **rede** e usa uma
> janela **estimada** pelo emissor, que ninguém anuncia. ==Trocar um pelo outro é a errada mais fácil de escrever deste assunto.==

> [!pegadinha] P3 — O UDP "está numa camada mais baixa porque é mais simples"
> Alternativa literal da questão do CNU 2024 (Q05 desta aula, opção D): *"localiza-se, por
> ser mais simples, na camada de rede, enquanto o TCP, na camada de transporte"*. É um
> **T6** — conceito certo com justificativa falsa. ==Simplicidade não define camada; ter porta e entregar ao processo define.== TCP e UDP são a mesma camada, e o campo Protocolo
> do IPv4 prova: 6 e 17, os dois encapsulados dentro do IP.

> [!pegadinha] P4 — Segmento e datagrama trocados
> A alternativa A da mesma questão do CNU diz que o UDP encapsula o dado *"em um cabeçalho
> chamado segmento"*. ==Segmento é a PDU do TCP; a do UDP é datagrama.== A troca de nome de
> PDU é distrator T2 e aparece sempre que a questão fala em encapsulamento.

> [!pegadinha] P5 — IP, ICMP, ARP e IGMP oferecidos como transporte
> A errada mais frequente do assunto inteiro, e a razão da seção 7. Quando as alternativas
> forem uma lista de siglas, ==primeiro elimine tudo o que não tem porta== — sobram TCP,
> UDP e, raramente, SCTP. Só então leia o discriminante do enunciado.

> [!pegadinha] P6 — "TCP e UDP" contra "UDP e TCP"
> A questão `cad.Q556`, da própria TRANSPETRO 2023, tem gabarito D (`TCP e UDP`) e a
> alternativa B é `UDP e TCP`. É o exemplo que o `perfil-da-banca-CESGRANRIO-TI.md` §3 usa
> para ilustrar o distrator **T4**. ==Quando a pergunta tiver a palavra "respectivamente", leia a ordem duas vezes antes de marcar.==

> [!pegadinha] P7 — FIN na abertura, SYN no encerramento
> Duas das cinco alternativas da questão do handshake põem **FIN** na terceira etapa da
> abertura. Guarde a frase: ==abre com SYN e fecha com FIN, e nenhum dos dois cruza para o lado do outro.==

> [!pegadinha] P8 — A camada de sessão parece a dona do diálogo
> Na questão `cad.Q551` (BANESE 2025), que pergunta o que faz a camada de **sessão**, a
> alternativa D é a definição literal e correta da camada de **transporte**:
> *"garante a entrega fim a fim de mensagens das camadas superiores com controle de erro e
> fluxo"*. É um **T3**. ==Quem estudou transporte na véspera marca D e erra.== O
> discriminante da sessão é outro: *controle de diálogo, gerenciamento de token e
> sincronização*.

> [!pegadinha] P9 — HTTP é sem estado, mas roda sobre um protocolo com conexão
> São dois "estados" diferentes. O **HTTP** é *stateless* porque cada requisição é
> independente das anteriores, do ponto de vista da aplicação. O **TCP** que carrega essa
> requisição é orientado à conexão e mantém estado nas duas pontas. ==Uma coisa não contradiz a outra, e o enunciado que junta as duas está testando exatamente isso.==

---

## Questões

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

### Q02 · CESGRANRIO · TRANSPETRO 2023 (cargo Informática)

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 556
> Mesma prova da nossa, mesmo dia, outro cargo. É o exemplo que o
> `perfil-da-banca-CESGRANRIO-TI.md` §3 usa para ilustrar o distrator **T4**: a alternativa
> B é o gabarito com a ordem invertida.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2690832)

Na camada de transporte de uma rede TCP/IP, podem ser encontrados dois protocolos de
transmissão de pacotes: um que provê fluxo confiável, em que o receptor confirma cada pacote
recebido ao emissor; e outro em que essa confirmação não acontece; logo, esse protocolo não
provê fluxo confiável. Nesse contexto, na camada de transporte, os protocolos confiável e
não confiável são, respectivamente:

- [ ] UDP e IP
- [ ] UDP e TCP
- [ ] TCP e IP
- [x] TCP e UDP
- [ ] IP e UDP

> [!gabarito]-
> **Gabarito: D — TCP e UDP.** O discriminante está em *"o receptor confirma cada pacote
> recebido ao emissor"*: isso é o **ACK**, e só o TCP tem. A palavra
> **"respectivamente"** manda ler a ordem: primeiro o confiável, depois o não confiável.
>
> - **a) UDP e IP** — dois erros: inverte o papel do UDP e oferece o IP, que **não é de transporte**. **T4 + T2**.
> - **b) UDP e TCP** — o gabarito com a ordem trocada. Distrator **T4** puro, e o mais votado nesse tipo de questão. É a razão de a pegadinha P6 existir.
> - **c) TCP e IP** — acerta o confiável e erra a camada do segundo: o IP é de rede. **T2**.
> - **e) IP e UDP** — o IP no lugar do confiável, que é o oposto do que ele é. **T2 + T4**.
>
> Note que **três das cinco alternativas contêm o IP**. Aplicar a seção 7 — o IP não tem
> porta, logo não é transporte — mata a, c e e de uma vez, e sobra a escolha de ordem.

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

### Q04 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 577
> A questão canônica do handshake, e a única fonte de treino que existe para as flags. As
> cinco alternativas são permutações de SYN, ACK e FIN nas três etapas — a grade **T4**
> descrita no perfil da banca.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3038232)

Para estabelecer uma conexão, o Transmission Control Protocol (TCP) usa um handshake de três
vias. Esse handshake é necessário e suficiente para o sincronismo correto entre as duas
extremidades da conexão. Em cada um dos segmentos transmitidos durante o handshake, o campo
de bits de código do cabeçalho TCP é devidamente preenchido.

No primeiro segmento, o(s)

- [ ] bit SYN é marcado; no segundo, o bit ACK é marcado; e, no terceiro, o bit FIN é marcado.
- [x] bit SYN é marcado; no segundo, os bits SYN e ACK são marcados; e, no terceiro, o bit ACK é marcado.
- [ ] bit SYN é marcado; no segundo, os bits SYN e ACK são marcados; e, no terceiro, os bits ACK e FIN são marcados.
- [ ] bits SYN e ACK são marcados; no segundo, os bits SYN e ACK também são marcados; e, no terceiro, o bit FIN é marcado.
- [ ] bits SYN e ACK são marcados; no segundo, os bits SYN e ACK também são marcados; e, no terceiro, os bits SYN, ACK e FIN são marcados.

> [!gabarito]-
> **Gabarito: B — SYN / SYN+ACK / ACK.** É a sequência da seção 5.3, e o `tcpdump` do
> cenário mostra os três: `Flags [S]`, `Flags [S.]`, `Flags [.]`. O primeiro segmento não
> pode ter ACK porque ainda não há nada a confirmar; o segundo abre a direção de volta
> (SYN) e confirma a de ida (ACK) num só segmento — é essa fusão que faz o handshake ter
> três etapas em vez de quatro; o terceiro só confirma.
>
> - **a)** — o segundo segmento sem SYN deixaria a direção servidor→cliente sem abrir, e o **FIN** no terceiro **encerraria** a conexão que acabou de nascer. **T4** (inversão de papel: flag de fechamento na abertura).
> - **c)** — igual ao gabarito, exceto por acrescentar **FIN** ao terceiro segmento. Diferença de **um bit**: distrator **T7** (variação mínima em cadeia exata), o mais perigoso da grade porque as duas primeiras etapas estão certas.
> - **d)** — põe ACK já no primeiro segmento, quando não há número de confirmação válido para carregar, e fecha com FIN. **T4**.
> - **e)** — acumula tudo em todos os segmentos, incluindo SYN+FIN juntos no terceiro, o que é contraditório. **T4/T5** (excesso).
>
> ==O corte rápido: FIN não participa da abertura.== Isso elimina a, c, d e e de uma vez.

### Q05 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 576
> A melhor questão do caderno sobre UDP, porque as quatro erradas são quatro erros
> **diferentes**: nome de PDU, atributo do TCP, definição do TCP e troca de camada. Vale
> mais como aula que como treino.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3038226)

Um dos desafios enfrentados por projetistas de redes de computadores é decidir entre os
protocolos Transmission Control Protocol (TCP) e User Datagram Protocol (UDP) para
diferentes aplicações e cenários de rede. A escolha envolve considerar cuidadosamente a
natureza das transmissões de dados necessárias para cada aplicação. A seleção entre TCP e
UDP exige uma análise minuciosa das exigências específicas da aplicação e das características
da rede, garantindo uma escolha alinhada com os requisitos de desempenho e confiabilidade da
infraestrutura de rede.

No processo decisório, o projetista deve considerar que o protocolo UDP

- [ ] encapsula, no modelo Internet, o dado na camada de transporte em um cabeçalho chamado segmento.
- [ ] garante, na transmissão, a entrega e a sequência de dados, com o suporte da camada de sessão.
- [ ] implementa a conexão lógica ligando as aplicações no modo full-duplex, com reconhecimento ACK e NAK.
- [ ] localiza-se, por ser mais simples, na camada de rede, enquanto o TCP, na camada de transporte.
- [x] revela-se um serviço não orientado a conexão, sem que haja uma vinculação lógica entre origem e destino.

> [!gabarito]-
> **Gabarito: E.** *"Não orientado a conexão"* e *"sem vinculação lógica entre origem e
> destino"* são as duas expressões que a banca usa para UDP. Não há handshake, não há
> estado nas pontas: cada datagrama é independente.
>
> - **a)** — a PDU do UDP é **datagrama**; segmento é a do TCP. Distrator **T2** (troca do nome do irmão taxonômico). Ver pegadinha P4.
> - **b)** — "garante a entrega e a sequência" é atributo do **TCP**, e a justificativa é dupla­mente falsa: ==o modelo Internet não tem camada de sessão==, e mesmo no OSI não seria a sessão a garantir entrega. **T6** (termo certo com justificativa falsa).
> - **c)** — descreve o TCP corretamente ("conexão lógica", "full-duplex"), o que faz dela um **T3** (definição verdadeira do conceito errado), com um **T1** embutido: ==o TCP usa ACK, mas **não** usa NAK== — não existe confirmação negativa no TCP.
> - **d)** — a pegadinha P3 em estado puro: **T6**, conceito certo com justificativa falsa. Simplicidade não determina camada. TCP e UDP são ambos transporte; o campo Protocolo do IPv4 vale 6 e 17 para eles.

### Q06 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 575
> O molde definicional com cinco siglas concorrentes — 13,1% das questões da TRANSPETRO,
> contra 5,5% dos outros órgãos. Três das quatro erradas são da camada de rede.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2780831)

No nível mais baixo da rede de comunicação de dados, a entrega dos pacotes não é confiável.
Esses pacotes podem ser perdidos ou destruídos quando os erros de transmissão interferem com
os dados, quando o hardware de transmissão falha ou quando as redes ficam muito
sobrecarregadas. Para resolver essa questão, a arquitetura da internet fornece um protocolo
de comunicação que assegura a entrega de mensagens fim a fim, com controle de erro e
controle de fluxo.

Esse protocolo é o

- [ ] IP
- [ ] UDP
- [x] TCP
- [ ] ICMP
- [ ] ARP

> [!gabarito]-
> **Gabarito: C — TCP.** Três expressões decidem: *"assegura a entrega"*, *"fim a fim"* e
> *"controle de fluxo"*. Só o TCP tem as três. Repare também que o enunciado descreve, na
> primeira frase, exatamente o serviço do **IP** — e o pedido é pelo protocolo que
> **resolve** aquilo, não pelo que o causa.
>
> - **a) IP** — é o protocolo descrito na primeira frase como problema. Marcar IP é responder à descrição em vez de à pergunta. **T2**, e é a errada mais votada.
> - **b) UDP** — camada certa, atributo errado: não assegura entrega nem faz controle de fluxo. **T2/T4**.
> - **d) ICMP** — camada de rede; transporta mensagens de erro **sobre** a rede, não dados fim a fim. **T2**.
> - **e) ARP** — resolve IP em MAC dentro da rede local, nem sequer é encapsulado em IP. **T2**.

### Q07 · CESGRANRIO · BASA 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 578
> A questão mais profunda do assunto em todo o caderno: cobra a **síndrome da janela tola**,
> vocabulário da tradução do Comer. O enunciado explica a janela deslizante inteira e pede
> só o desfecho do mecanismo.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3135927)

O protocolo de comunicação Transmission Control Protocol (TCP) fornece um serviço orientado
à conexão com controle de fluxo e erro fim-a-fim. Para fazer um controle de fluxo eficiente,
o TCP adota o mecanismo de janela deslizante e permite que o tamanho da janela varie com o
tempo. Para evitar receber mais dados do que pode armazenar, o receptor envia anúncios de
janela menores enquanto seu buffer se enche. No caso extremo de buffer cheio, o receptor
anuncia um tamanho de janela zero para interromper a transmissão do emissor. Quando o espaço
do buffer se torna disponível, o receptor anuncia um tamanho de janela diferente de zero
para disparar o fluxo de dados novamente.

Após o anúncio de um tamanho de janela zero, é importante evitar a síndrome da janela tola,
na qual cada confirmação do receptor anuncia uma pequena quantidade de espaço disponível no
seu buffer e cada

- [x] segmento enviado pelo emissor transporta uma pequena quantidade de dados, que volta a encher o buffer do receptor e a interromper a transmissão do emissor.
- [ ] segmento enviado pelo emissor transporta uma grande quantidade de dados, que provoca um erro no receptor e o encerramento da conexão.
- [ ] segmento enviado pelo emissor transporta uma grande quantidade de dados, que é ignorada e descartada pelo receptor.
- [ ] confirmação é entregue e ignorada pelo emissor, que mantém a interrupção da transmissão do emissor.
- [ ] confirmação é perdida e não chega até o emissor, que mantém a interrupção da transmissão do emissor.

> [!gabarito]-
> **Gabarito: A.** O ciclo da síndrome é: janela minúscula anunciada → segmento minúsculo
> enviado → buffer cheio de novo → janela zero de novo. O resultado é uma conexão que gasta
> 40 bytes de cabeçalho para transportar 1 byte de dado. As curas estão na seção 5.5:
> **Clark** no receptor (não anunciar janela pequena) e **Nagle** no emissor (juntar dados
> pequenos antes de enviar).
>
> - **b)** e **c)** — invertem o tamanho: o mecanismo exige *pequena* quantidade de dados, e as duas dizem *grande*. **T4** (inversão do atributo), com **T6** por cima, porque cada uma inventa uma consequência que o TCP não produz — um segmento grande demais nunca "provoca erro e encerra a conexão"; ele simplesmente não é enviado, porque a janela não permite.
> - **d)** e **e)** — trocam o sujeito: falam da **confirmação** em vez do **segmento**. Além de fugir da definição, descrevem um impasse que o TCP resolve com o **temporizador de persistência** e a **sondagem de janela** (seção 5.5). **T4** (inversão de papel) reforçado por **T6**.
>
> ==A palavra que decide está no próprio enunciado: "pequena quantidade de espaço".== O que
> vem depois tem de ser pequeno também.

### Q08 · CESGRANRIO · BANESE 2025

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 558
> Exemplo do problema de catalogação: esta questão é de TCP puro, mas está indexada sob
> "Algoritmos de Codificação e de Detecção de Erros". Quem filtrar só por "TCP e UDP" no
> TecConcursos não a encontra.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3347046)

A arquitetura de protocolos da Internet é organizada em camadas conceituais que oferecem
serviços através de protocolos de comunicação. Em particular, a camada de transporte oferece
um serviço de comunicação orientado à conexão para as aplicações, provendo controle de erro
e controle de fluxo fim a fim. Esse serviço é oferecido pelo protocolo

- [ ] Internet Protocol
- [ ] User Datagram Protocol
- [x] Transmission Control Protocol
- [ ] Internet Group Message Protocol
- [ ] Internet Control Message Protocol

> [!gabarito]-
> **Gabarito: C — Transmission Control Protocol.** As cinco alternativas estão por extenso,
> o que é uma variação que a banca usa para tirar o apoio da sigla. *"Orientado à conexão"*
> mais *"controle de erro e de fluxo fim a fim"* é a descrição fechada do TCP.
>
> - **a) Internet Protocol** — camada de rede, sem conexão, sem controle de fluxo. **T2**.
> - **b) User Datagram Protocol** — camada certa, e é justamente o que **não** é orientado a conexão. **T2/T4**.
> - **d) Internet Group **Message** Protocol** — ==o nome real é Internet Group **Management** Protocol (IGMP)==, e ele é de rede, para grupos multicast. Distrator duplo: **T1** (deformação do nome, "Message" no lugar de "Management") sobre **T2** (protocolo real da camada errada).
> - **e) Internet Control Message Protocol** — o ICMP existe e o nome está certo, mas é de rede e serve para mensagens de erro. **T2**.
>
> Repare a maldade de d) e e) juntas: **duas siglas quase idênticas**, uma com o nome certo
> e outra com o nome deformado, para o candidato gastar tempo comparando as duas em vez de
> notar que nenhuma das duas é transporte.

### Q09 · CESGRANRIO · TRANSPETRO 2023 (cargo Segurança Cibernética)

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 703
> Mesma prova de 2023, outro cargo. Está catalogada em Segurança, mas ==só se resolve sabendo o que acontece entre a segunda e a terceira etapa do handshake==. É o retorno
> prático da seção 5.3.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2695459)

Um atacante ordenou aos seus bots a continuamente estabelecerem inúmeras conexões TCP
diretamente com um servidor web alvo, usando um endereço de origem falsificado e inexistente.
Todas as solicitações realizadas pelos bots foram recebidas e respondidas por esse servidor
alvo durante algum tempo e, agora, não há mais recursos no servidor para responder a novas
solicitações de conexão. Esse servidor alvo está diante de um ataque de TCP

- [x] SYN Flood
- [ ] SYN/ACK Flood
- [ ] FIND Drain
- [ ] SEND Drain
- [ ] REVC Drain

> [!gabarito]-
> **Gabarito: A — SYN Flood.** Reconstrua a cena com a seção 5.3: o bot manda o **SYN** com
> IP de origem falso e inexistente; o servidor aloca um bloco de controle, responde
> **SYN+ACK** e entra em `SYN_RECEIVED`; o SYN+ACK vai para um endereço que não existe e a
> terceira etapa **nunca chega**. A conexão fica **meio-aberta** ocupando a fila de
> *backlog*, e milhares delas esgotam os recursos. As palavras *"diretamente"* e
> *"endereço de origem falsificado e inexistente"* são as que fixam o gabarito.
>
> - **b) SYN/ACK Flood** — ==ataque real, e é a errada perigosa==: existe a variante por reflexão, em que o atacante manda SYN forjados a servidores intermediários e são **eles** que inundam a vítima com SYN/ACK. É o **DRDoS** da questão `cad.Q690` do mesmo caderno. Aqui não cabe, porque o enunciado diz *"diretamente com um servidor web alvo"*. Distrator **T2** (irmão taxonômico real).
> - **c) FIND Drain**, **d) SEND Drain**, **e) REVC Drain** — três **T1**: neologismos com morfologia plausível. `FIND` e `SEND` imitam as flags de três letras, e `REVC` é `RECV` com as letras trocadas. ==Nenhum dos três existe.==
>
> Este trio de neologismos é citado nominalmente no `perfil-da-banca-CESGRANRIO-TI.md` §3
> como exemplo padrão de T1.

### Q10 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 773
> A única questão do caderno inteiro que cobra **número de porta** direto. Está catalogada
> em "Segurança em Correio Eletrônico", e é o exemplo de por que buscar pelo nome do
> assunto não basta.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2780861)

Uma estratégia antispam comumente utilizada é conhecida como Gerência de Porta 25 e consiste
em um conjunto de políticas e tecnologias, implantadas em redes de usuários finais ou de
caráter residencial, que procura separar as funcionalidades de submissão de mensagens
daquelas de transporte de mensagens entre servidores.

Dentre várias recomendações importantes, o Messaging Anti-Abuse Working Group (MAAWG)
recomenda a adoção do Message Submission, configurando o software cliente de e-mail para
usar autenticação e a porta TCP número

- [ ] 25
- [ ] 445
- [ ] 554
- [x] 587
- [ ] 993

> [!gabarito]-
> **Gabarito: D — 587.** O enunciado já dá a chave: separar **submissão** (cliente entrega
> ao servidor) de **transporte entre servidores** (relay). A submissão autenticada usa a
> porta **587**; a 25 fica reservada ao tráfego entre servidores. É a distinção 25 × 587 da
> seção 3.3.
>
> - **a) 25** — a porta citada no **próprio enunciado**, e é exatamente aquela de que se quer separar. Distrator **T2** por serviço e armadilha de leitura: quem lê "Gerência de Porta 25" e marca 25 respondeu ao título, não à pergunta.
> - **b) 445** — SMB/CIFS. **T8** (vizinho numérico) sobre **T2** (porta real de outro serviço).
> - **c) 554** — RTSP, streaming. **T8/T2**, e é a mais próxima de 587 na escala.
> - **e) 993** — IMAPS, que **é** de correio eletrônico e por isso é a segunda mais votada. Mas IMAPS serve para o cliente **ler** a caixa, não para **enviar**. **T2**.
>
> ==As cinco alternativas são portas reais.== É a assinatura combinada T2+T8: não há
> neologismo para descartar, só conhecimento de tabela.

### Q11 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 580
> Catalogada em ICMP, mas o que ela cobra é **de quem é a porta**. Fecha a seção 3.4 e liga
> porta, UDP e camada de rede numa questão só.
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
> **Gabarito: E — o próprio destinatário.** O argumento é de uma linha e vem da seção 3.1:
> ==porta é um número local à máquina, e só a máquina de destino sabe quais das suas 65.536 portas têm processo escutando.== Nenhum roteador do caminho tem essa informação. Um
> roteador até gera ICMP tipo 3, mas com código **0** (rede inalcançável) ou **1** (host
> inalcançável) — nunca o código 3.
>
> - **a) a d)** — as quatro são permutações de "gateway" com "entrada/saída/borda" e
>   "remetente/destinatário": a grade **T4** (inversão de papel) montada sobre dois eixos
>   binários, exatamente o método descrito no `perfil-da-banca-TRANSPETRO.md` §5. Todas
>   erram pela mesma razão: ==gateway roteia por endereço IP, não por porta.==
>
> Detalhe que fecha o assunto: no **TCP**, a resposta a uma porta fechada não é ICMP — é um
> segmento com a flag **RST**. O ICMP Port Unreachable é a resposta do **UDP**.

### Q12 · CESGRANRIO · UNEMAT 2024

> [!fonte] Fonte: caderno CESGRANRIO 2023-2026, questão 552
> A forma mais curta de cobrar a seção 7: em que camada mora cada um dos dois protocolos
> que dão nome à arquitetura. É a questão de aquecimento ideal para o dia seguinte.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2837989)

No contexto de redes de computadores, o modelo OSI é utilizado para representar as diferentes
camadas sucessivas responsáveis pelo tráfego de mensagens entre computadores. Dentre os
diversos protocolos de comunicação disponíveis, o mais famoso é o TCP/IP, amplamente usado
na internet.

A quais camadas do modelo OSI correspondem os protocolos TCP e IP, respectivamente?

- [ ] rede e física
- [ ] enlace e rede
- [x] transporte e rede
- [ ] transporte e enlace
- [ ] aplicação e transporte

> [!gabarito]-
> **Gabarito: C — transporte e rede.** TCP é camada 4, IP é camada 3. E de novo a palavra
> **"respectivamente"** manda conferir a ordem.
>
> - **a) rede e física** — desce os dois um degrau. **T4** (deslocamento em bloco).
> - **b) enlace e rede** — acerta o IP e joga o TCP para baixo dele, o que inverteria o encapsulamento. **T4**.
> - **d) transporte e enlace** — ==a errada perigosa: só o segundo item muda.== Diferença mínima em relação ao gabarito, distrator **T7**.
> - **e) aplicação e transporte** — sobe os dois um degrau, e é a que mais engana quem confunde "protocolo famoso da internet" com "protocolo de aplicação". **T4**.
>
> A grade inteira é feita de **pares de camadas adjacentes** deslocados para cima ou para
> baixo — o mesmo método de `cad.Q555`, da TRANSPETRO 2023, que pergunta as camadas vizinhas
> à de Transporte (gabarito: **Sessão e de Rede**).

## Figuras pendentes

**Nenhuma.** Todas as 12 questões de prova desta aula têm `alt_em_imagem = N` nos índices —
enunciado e alternativas existem em texto. Não há nada para recortar de PDF.

---

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Principais Protocolos de Redes` › **`TCP e UDP`** |
| Hierarquia | `07.03` |
| Questões no acervo | 1.495 |
| No seu caderno CESGRANRIO | 4 |

Marque também a banca **CESGRANRIO**. Com 4 questões só, ==tire o filtro de banca depois de resolvê-las== e siga nas demais como treino de leitura — este é um assunto em que outras
bancas cobram o mesmo mecanismo com as mesmas palavras.

**Complementos, para o resto da semana**

| Assunto | Hierarquia | Questões | Por quê |
|---|---|---:|---|
| `Modelos de Referência de Redes` › **`Modelo OSI`** | `03.01` | 2.106 | 5 das 12 questões de prova desta aula estão catalogadas aqui, não em TCP e UDP |
| `Modelos de Referência de Redes` › **`Arquitetura TCP/IP`** | `03.02` | 1.560 | O mapeamento de camadas de R03; sustenta a seção 7 |
| `Principais Protocolos de Redes` › `Protocolo IP` › **`Conceitos e Especificações do IP`** | `07.02.01` | 1.066 | Onde estão as questões que oferecem o IP como se fosse transporte |
| `Principais Protocolos de Redes` › **`ICMP`** | `07.07` | 280 | Fecha a seção 3.4: Port Unreachable e quem o gera |
| `Ameaças aos Sistemas Computacionais` › **`Negação de Serviço (DoS)`** (matéria: TI - Segurança da Informação) | `03.04` | 333 | SYN flood, conexão meio-aberta e DRDoS — o retorno prático do handshake |

> [!checklist]
> - **Handshake:** SYN → SYN+ACK → ACK. **Encerramento:** FIN → ACK → FIN → ACK.
> - **FIN não abre, SYN não fecha.**
> - Cabeçalho: **UDP 8 bytes fixos, 4 campos**; **TCP 20 bytes**, até 60 com opções.
> - Campo Protocolo do IPv4: **1 ICMP, 2 IGMP, 6 TCP, 17 UDP**.
> - PDU: **segmento** no TCP, **datagrama** no UDP.
> - Portas IANA: **0–1023** bem conhecidas · **1024–49151** registradas · **49152–65535** dinâmicas.
> - **Fluxo** protege o **receptor** e é anunciado; **congestionamento** protege a **rede** e é estimado.
> - Porta fechada: **UDP responde ICMP 3/3**, **TCP responde RST** — e quem responde é o **destino**.
