---
id: R03
titulo: Pilha TCP/IP e o mapeamento com o OSI
resumo: Ao terminar, você diz as quatro camadas do TCP/IP na ordem e por todos os nomes que a banca usa para cada uma, aponta quais camadas do OSI somem no mapeamento, e mostra numa única linha de tcpdump os quatro cabeçalhos empilhados com o campo que liga cada camada à de cima.
tempo: 45 min
---

> [!banca]
> **Item 1.1f do edital 2026 — "Arquitetura e protocolos TCP/IP".** Cobrança
> **conceitual e de nomenclatura**: dizer em que camada da arquitetura TCP/IP vive um
> protocolo, ou traduzir uma camada do TCP/IP para a do OSI. Não pede implementação e,
> neste recorte, não pede cálculo.
>
> **Quantas vezes caiu:** **2 das 70 questões em 2018** e **1 em 2023**, segundo o
> `mapa-edital-2026.md`. Mas os três casos precisam de ressalva, e a ressalva é o motivo
> desta aula existir:
>
> - **2018·Q43** é o caso puro: lista as sete camadas do OSI e planta ==Nível de internet== como alternativa errada — um nome **correto no modelo errado**. É a questão-mãe deste assunto e abre a seção de questões.
> - **2018·Q44** ("Máscara e Endereçamento IP") e **2023·Q53** (tabela de rotas, *longest prefix match* — a regra de que, entre várias rotas que casam com o destino, o roteador usa a de máscara mais longa) foram contadas em 1.1f pelo mapa, mas o que elas cobram é cálculo de sub-rede e roteamento: ficam em **R09** e **R10**, com a teoria certa. Não as trouxe para cá, e digo isso aqui para você não procurá-las depois.
> - **2018·Q48** abre com *"O protocolo HTTP se refere ao nível de aplicação internet TCP/IP"* — vocabulário desta aula —, mas a pergunta é sobre HTTP, e as alternativas saíram corrompidas na extração do PDF (aparece "conexão FTP" onde o original quase certamente diz "conexão TCP"). Não uso questão com alternativa suspeita; ela fica para a aula de HTTP, conferida no PDF.
>
> **Então, da nossa ênfase, este assunto tem uma questão só de prova direta.** É por isso
> que a fonte que sustenta a aula é o **caderno CESGRANRIO 2023-2026**, de onde saem
> **8 questões** — BANESE 2025 (2), IPEA 2024 (2), CNU 2024, UNEMAT 2024, AgeRIO 2023 e a
> própria **TRANSPETRO 2023** (cargo Informática, mesma prova, mesmo dia).
> **9 questões reais no total, e nenhuma inédita** — passando de cinco questões da banca
> no assunto, questão escrita por mim só diluiria o treino no molde verdadeiro.
>
> **O molde:** enunciado definicional de 40 a 90 palavras que já descreve a camada
> corretamente, alternativa de uma a quatro palavras — os 56% da ênfase 4. Os distratores
> são quase todos **T2** (protocolo real da camada errada), **T4** (nomes certos na ordem
> trocada) e **T3** (definição verdadeira da camada errada).

> [!nota] Esta aula é maior que a fatia dela. Como distribuir a terça-feira.
> A fatia de R03 no calendário é de **45 min** (terça tem 90 min divididos entre R03 e
> R04). A teoria abaixo tem **7.538 palavras, 75 min de leitura de estudo**, medido com
> `python ferramentas/tamanho.py` — ==estoura a fatia em 45 min, o dobro dela==. Não
> encolhi: metade da aula é vocabulário, os nomes que a banca usa para as mesmas quatro
> camadas, e vocabulário não comprime sem virar lista solta.
>
> **A teoria se divide em três blocos, e só o primeiro é para hoje:**
>
> - **Seções 1 a 6** — o mecanismo: os dois modelos, as quatro camadas, o mapeamento e os campos que costuram a pilha. São **~60 min**, e é o que basta para resolver as 13 questões. **Leia hoje.**
> - **Seções 7, 8 e "Onde a banca derruba"** — três tabelas e seis pegadinhas, **~9 min**. São material de **releitura**, não de primeira leitura: leia na quarta-feira, no aquecimento, e de novo no bloco de sábado. Tabela rende relendo, não decorando de uma vez.
> - **"Onde treinar no TecConcursos"** — **~5 min**, no sábado, na hora de montar o filtro.
>
> Use os 90 min da terça assim:
>
> | | |
> |---|---|
> | **Aquecimento**: Q03 e Q04 de R01, de cabeça, sem reler nada | 10 min |
> | Teoria desta aula, **seções 1 a 6** | 60 min |
> | **Conferência**: Q01 e Q03 daqui, só para aferir | 8 min |
> | Checklist do fim | 5 min |
> | **Total** | **83 min** |
>
> **Consequência honesta: R04 não cabe na terça.** Sobram 7 minutos, que não dão para abrir
> outra aula. Não force — **R04 já vem meio resolvida por esta aula**: a
> seção 3.2 daqui entrega porta, socket, multiplexação, faixas da IANA e a diferença de
> serviço entre TCP e UDP, que é o miolo dela. Leia R04 na quarta, no lugar do aquecimento
> normal, e resolva as questões dela no bloco de sábado.
>
> **Q02 e Q04 a Q09 não são para hoje.** Q02 e Q03 abrem a sessão de quarta-feira; o resto
> é material do bloco de sábado. Responder sobre um texto que você acabou de ler mede
> memória de trabalho, não aprendizado.

---

## 1 · O problema: por que existem dois modelos, e por que a banca cobra os dois

Em R01 você viu o **modelo OSI** (*Open Systems Interconnection*, "interconexão de sistemas
abertos"), a norma **ISO/IEC 7498** de 1984, com sete camadas. Ele resolveu um problema
real: dar um vocabulário comum para descrever qualquer rede.

Só que o OSI nunca foi implementado. A pilha de protocolos OSI de verdade existiu — TP4
(*Transport Protocol class 4*, o transporte) e CLNP (*ConnectionLess Network Protocol*, a
camada 3), os equivalentes OSI do TCP e do IP —, foi comprada por alguns governos nos anos
1980 e morreu. **O que roda em toda máquina ligada à internet hoje é outra coisa: a
arquitetura TCP/IP**, cujo nome vem dos seus dois protocolos centrais, o **TCP**
(*Transmission Control Protocol*) e o **IP** (*Internet Protocol*).

E as duas nasceram ao contrário uma da outra. Este é o ponto que explica quase todos os
distratores deste assunto:

| | OSI | TCP/IP |
|---|---|---|
| Ordem dos acontecimentos | **O modelo veio primeiro**, os protocolos depois (e falharam) | **Os protocolos vieram primeiro**, o modelo é a descrição do que já funcionava |
| Quem publicou | ISO, comitê internacional, 1984 | **IETF**, em RFCs; a arquitetura foi consolidada na **RFC 1122** (1989) |
| Nº de camadas | 7 | **4** |
| Uso hoje | referência didática e vocabulário de prova | **implementação real**, no seu notebook agora |

> [!nota] Três siglas, definidas antes de seguir
> **IETF** (*Internet Engineering Task Force*): o grupo aberto que padroniza os protocolos
> da internet. Aparece em enunciado da TRANSPETRO — a Q42 de 2023 abre com
> *"O IETF criou um conjunto de protocolos, conhecido como IPsec"*.
> **RFC** (*Request for Comments*): o formato dos documentos publicados pelo IETF. Cada um
> tem um número: a RFC 791 define o IP, a 793 o TCP, a **1122** descreve a arquitetura em
> camadas que estudamos aqui.
> **ARPANET**: a rede do Departamento de Defesa americano, dos anos 1970, onde o TCP/IP foi
> desenvolvido e testado antes de existir modelo nenhum para descrevê-lo.

**O problema que a arquitetura TCP/IP resolve** é o mesmo do OSI — separar a comunicação em
camadas independentes — com uma exigência a mais, que é a razão de ela ter vencido:
==funcionar sobre qualquer tecnologia de enlace já existente, sem substituí-la==. O TCP/IP
não pediu que ninguém trocasse a rede: ele roda sobre Ethernet, sobre Wi-Fi, sobre linha
telefônica, sobre satélite. Foi projetado para interligar redes **diferentes** — daí o nome
da camada 3 dele ser *inter-rede*, e não "rede".

O que quebra sem isso: cada tecnologia de enlace teria seu próprio esquema de endereços e
sua própria noção de "destino", e uma máquina na Ethernet não conseguiria nomear uma máquina
na rede de satélite. O IP resolve isso impondo **um único espaço de endereços por cima de
todos os enlaces**, e delegando a cada enlace só o trecho local.

## 2 · O exemplo que atravessa a aula inteira

É o mesmo cenário de R01 e R02, de propósito: você já o conhece, e agora vai vê-lo pela
lente do outro modelo.

Você está num notebook na rede da TRANSPETRO e digita `http://www.transpetro.com.br` no
navegador. O **HTTP** (*HyperText Transfer Protocol*) é o protocolo com que o navegador pede
páginas ao servidor.

| Elemento | Valor |
|---|---|
| Seu notebook | IP `10.20.30.40/24`, MAC `A4:BB:6D:11:22:33` |
| Roteador de saída (*gateway* padrão) | IP `10.20.30.1`, MAC `00:1A:2B:3C:4D:5E` |
| Servidor web | IP `200.150.10.80`, porta `80` |
| Porta de origem sorteada pelo seu sistema | `51344` |

Dois termos da tabela, porque eles aparecem antes de terem seção própria. **MAC**
(*Media Access Control*) é o **endereço físico** de 48 bits gravado de fábrica na placa de
rede, escrito em 6 pares hexadecimais — é o endereço de camada mais baixa, e você o vê
inteiro na saída abaixo. **Gateway padrão** é o roteador para onde a máquina manda todo
pacote cujo destino **não** esteja na própria rede local; sem ele, o notebook só conversa
com quem está do mesmo lado do roteador.

E este é o artefato que a aula inteira vai desmontar — uma linha de `tcpdump`, o programa
que captura e imprime os quadros que passam na interface de rede:

```bash
$ sudo tcpdump -ni enp0s3 -e host 200.150.10.80
a4:bb:6d:11:22:33 > 00:1a:2b:3c:4d:5e, ethertype IPv4 (0x0800), length 74:
    10.20.30.40.51344 > 200.150.10.80.80: Flags [S], seq 1829403311, win 64240, length 0
```

Leia da esquerda para a direita e você está lendo a pilha TCP/IP de fora para dentro, uma
camada por trecho:

- `a4:bb:6d:11:22:33 > 00:1a:2b:3c:4d:5e` e `ethertype IPv4` → **camada de acesso à rede**;
- `10.20.30.40 > 200.150.10.80` → **camada de inter-rede**;
- `.51344 > .80` e `Flags [S]` → **camada de transporte**;
- e o `GET / HTTP/1.1` que vem no terceiro pacote → **camada de aplicação**.

Quatro camadas, quatro pedaços da mesma linha. Guarde esta linha; ela volta em todas as
seções.

## 3 · As quatro camadas do TCP/IP, uma a uma

A ordem oficial é **de baixo para cima**, igual à do OSI. Vou apresentar **de cima para
baixo**, que é a ordem em que os seus dados descem — e depois a tabela consolida.

### 3.1 · Camada de Aplicação

**O problema que resolve.** Depois que os bytes chegam à máquina certa e ao programa certo,
alguém precisa dizer o que eles **significam**. Sem esta camada, o servidor recebe 74 bytes
e não sabe se aquilo é um pedido de página, um e-mail ou uma consulta de nome.

**Como funciona por dentro.** Não é uma camada do sistema operacional:
==ela é o seu próprio programa==. O navegador, o servidor web, o cliente de e-mail. Cada
aplicação define seu
**protocolo de aplicação** — o formato exato das mensagens que ela troca com a aplicação
par do outro lado. HTTP define que a primeira linha é `MÉTODO caminho versão`; SMTP define
que o cliente diz `MAIL FROM:`; DNS define um formato binário de pergunta e resposta.

Aqui está a diferença estrutural mais cobrada de toda a aula: **esta única camada absorve
as camadas 7, 6 e 5 do OSI**. No modelo TCP/IP
==não existe camada de Sessão nem camada de Apresentação==.
As funções existem — o TLS cifra, o navegador negocia charset, a sessão HTTP
é mantida por cookie —, mas o modelo não lhes dá camada própria: quem quiser, implementa
dentro da aplicação.

**Exemplo concreto.** No nosso cenário, é isto que o navegador entrega para baixo — visto
pelo `curl`, um cliente HTTP de linha de comando que, com a opção `-v` (*verbose*), imprime
as linhas que ele envia e recebe:

```bash
$ curl -v http://www.transpetro.com.br/
*   Trying 200.150.10.80:80...
* Connected to www.transpetro.com.br (200.150.10.80) port 80
> GET / HTTP/1.1
> Host: www.transpetro.com.br
> User-Agent: curl/8.5.0
> Accept: */*
```

As linhas com `>` são a **PDU da camada de aplicação** — a *Protocol Data Unit*, o bloco que
uma camada entrega para a camada par do outro lado (R02, seção 3). Na aplicação ela se chama
simplesmente **mensagem**, ou **dados**. Repare que não há nenhum endereço IP nessas linhas:
o `Host:` é um **nome**, não um endereço. Quem transforma nome em endereço é o DNS, que é
outro protocolo desta mesma camada.

**Protocolos que moram aqui.** A tabela traz o nome por extenso de propósito: a banca
costuma escrever assim justamente para esconder a sigla que você reconheceria de imediato
(foi o que ela fez na Q04 desta aula).

| Sigla | Nome por extenso | Para quê |
|---|---|---|
| **HTTP** | *HyperText Transfer Protocol* | páginas web |
| **HTTPS** | HTTP sobre **TLS** (*Transport Layer Security*, sucessor do SSL) | o mesmo, cifrado e autenticado |
| **FTP** | *File Transfer Protocol* | transferência de arquivos |
| **SMTP** | *Simple Mail Transfer Protocol* | envio de e-mail |
| **POP3** / **IMAP** | *Post Office Protocol* / *Internet Message Access Protocol* | leitura de e-mail |
| **DNS** | *Domain Name System* | traduz nome em endereço IP |
| **DHCP** | *Dynamic Host Configuration Protocol* | entrega configuração de rede automaticamente |
| **SNMP** | *Simple Network Management Protocol* | gerência de rede |
| **LDAP** | *Lightweight Directory Access Protocol* | consulta a diretório |
| **Telnet** / **SSH** | — / *Secure Shell* | terminal remoto, sem e com cifra |
| **NFS** | *Network File System* | arquivos compartilhados em rede |
| **NTP** | *Network Time Protocol* | sincronização de relógio |

**Todos.** Se o nome do protocolo é conhecido de usuário final, a aposta certa é camada de
aplicação.

**Palavras que a banca usa:** *"nível de aplicação"*, *"aplicativos de alto nível"*,
*"processos de usuário"*, *"serviços oferecidos às aplicações"*, e o nome de qualquer
protocolo da lista acima.

**Confunde-se com:** a camada **6 (Apresentação)** do OSI, quando o enunciado fala de
criptografia ou de formato de dados. A separação: se a questão citar o **modelo OSI**,
criptografia é 6; se citar a **arquitetura TCP/IP**, criptografia é aplicação, porque a 6
não existe lá.

> [!analogia] O idioma da conversa
> A camada de aplicação é o **idioma** em que as duas pontas conversam. Duas pessoas ao
> telefone precisam falar a mesma língua; o telefone não liga para qual é.
> **Onde quebra:** idioma é uma coisa só, e aqui há dezenas de protocolos rodando ao mesmo
> tempo na mesma máquina — o que exige que a camada de baixo saiba **para qual deles**
> entregar cada bloco. Idioma nenhum precisa de número de porta; esta camada precisa.

### 3.2 · Camada de Transporte

**O problema que resolve.** O IP entrega na **máquina**. Mas na sua máquina há um navegador,
um cliente de e-mail e um cliente de DNS rodando ao mesmo tempo. Se a camada de baixo
entregasse "para o notebook `10.20.30.40`", o sistema não saberia qual programa deve receber.
Sem transporte, ==uma máquina só poderia ter uma conversa por vez==.

**Como funciona por dentro.** Duas funções, e a primeira é a que quase nunca é lembrada:

1. **Multiplexação e demultiplexação por porta.** **Porta** é um número de 16 bits (0 a 65.535) que identifica o processo dentro da máquina. O par (endereço IP, porta) chama-se **socket**. O TCP identifica uma conexão pelos **quatro** valores: IP de origem, porta de origem, IP de destino, porta de destino. É por isso que você pode ter duas abas abertas no mesmo site: mesmo IP, mesma porta de destino, **portas de origem diferentes**.
2. **Confiabilidade — opcional.** O **TCP** (*Transmission Control Protocol*) numera os bytes, exige confirmação (**ACK**, de *acknowledgement*), retransmite o que não for confirmado e controla o fluxo com **janela deslizante** — o mecanismo pelo qual o receptor anuncia quantos bytes ainda cabem no buffer dele, e o emissor não manda mais que isso. O **UDP** (*User Datagram Protocol*) não faz nada disso: põe porta de origem, porta de destino, tamanho e **checksum** (uma soma de verificação que só permite **detectar** que o conteúdo chegou corrompido, sem corrigir nem pedir de novo), e manda. Detalhe de R04.

**Exemplo concreto.** As portas do nosso cenário, vistas pelo `ss`, o comando Linux que
lista sockets:

```bash
$ ss -tn
State   Recv-Q  Send-Q      Local Address:Port      Peer Address:Port
ESTAB   0       0             10.20.30.40:51344    200.150.10.80:80
ESTAB   0       0             10.20.30.40:51350    200.150.10.80:80
```

Duas conexões, mesmo par de máquinas, mesma porta 80 do outro lado. O que as separa é
`51344` contra `51350` — as **portas efêmeras**, sorteadas pelo sistema na faixa alta
(no Linux, 32768–60999 por padrão).

Os números de porta são atribuídos pela **IANA** (*Internet Assigned Numbers Authority*) em
três faixas: **0–1023 bem conhecidas** (*well-known*: 80 HTTP, 443 HTTPS, 53 DNS, 25 SMTP,
22 SSH, 21 FTP-controle, 23 Telnet, 161 SNMP, 67/68 DHCP), **1024–49151 registradas**,
**49152–65535 dinâmicas/privadas**.

**A PDU:** **segmento**, no TCP; **datagrama** (ou *datagrama UDP*), no UDP.

**Palavras que a banca usa:** *"fim a fim"*, *"ponta a ponta"*, *"entre as extremidades"*,
*"orientado à conexão"*, *"controle de erro e de fluxo fim a fim"*, *"entrega ao processo"*,
*"porta"*. Guarde esta: nas quatro questões de caderno desta aula que pedem TCP,
==a expressão que decide é sempre "fim a fim" ou "orientado à conexão"==.

**Confunde-se com:** a camada de **enlace**, que faz controle de erro e de fluxo também —
mas entre nós **adjacentes**, não fim a fim (é a pegadinha nº 1 de R01). E com a camada de
**inter-rede**: o distrator clássico é oferecer o UDP "na camada de rede" porque ele é mais
simples que o TCP (foi exatamente a alternativa D da Q576 do CNU 2024, adiante).

> [!analogia] O ramal do prédio
> O IP é o endereço do prédio; a porta é o **ramal**. A portaria entrega o pacote no prédio;
> o ramal diz em qual sala.
> **Onde quebra:** ramal é atributo de quem recebe, e a **porta de origem é sorteada a cada
> conexão** — muda a cada aba do navegador. E o TCP identifica a conversa pela **quádrupla**
> inteira, não só pelo ramal do destino; dois prédios diferentes podem ligar para o mesmo
> ramal sem que as duas ligações se misturem.

### 3.3 · Camada de Inter-rede (Internet)

**Esta é a camada que mais aparece como distrator neste assunto, e por isso recebe o dobro
de espaço das outras — inclusive uma seção só para os nomes dela, a 4.**

**O problema que resolve.** Ethernet entrega dentro de um segmento local, usando endereço
MAC. Wi-Fi entrega dentro do alcance do rádio. Nenhuma das duas sabe alcançar uma máquina
que está do outro lado do país, em outra tecnologia. Sem esta camada,
==a rede acaba na parede==.

**Como funciona por dentro.** O **IP** (*Internet Protocol*, RFC 791) faz três coisas. Duas
versões dele convivem hoje: o **IPv4**, com endereços de 32 bits escritos em quatro números
decimais (`200.150.10.80`), que é o desta aula, e o **IPv6**, com 128 bits em hexadecimal,
que é assunto de R12. E a primeira das três funções é justamente a que mais se esquece:

1. **Decide se o destino é local ou remoto.** O **host** — qualquer máquina com endereço IP, em oposição ao roteador, que só repassa — aplica a **máscara de sub-rede** ao seu próprio IP e ao IP de destino. Máscara é o número que diz **quantos bits iniciais do endereço identificam a rede** (em `/24`, os 24 primeiros); o resto identifica a máquina dentro dela. Se os dois derem o mesmo resultado, o destino está na mesma rede e o pacote vai **direto** a ele; se derem resultados diferentes, o pacote vai para o **gateway padrão**. Isto é conteúdo de prova literal — é o ponto inteiro da questão do BANESE 2025 (Q06 desta aula).
2. **Encaminha, salto a salto.** Cada roteador olha o IP de destino, consulta a tabela de rotas e escolhe a saída. Só isso: sem conexão, sem confirmação, sem memória do que passou. O serviço do IP é ==não confiável e sem conexão== (*best effort*) por decisão de projeto — a confiabilidade fica no transporte, onde só as pontas precisam pagar por ela.
3. **Fragmenta**, quando o pacote é maior que a **MTU** (*Maximum Transmission Unit*, o maior **payload** — o conteúdo transportado, sem contar o cabeçalho — que aquele enlace aceita; 1500 bytes em Ethernet).

**A PDU:** **pacote**, ou **datagrama IP**. Cuidado: "datagrama" é usado tanto aqui quanto
no UDP.

**Exemplo concreto.** A decisão do item 1, no nosso cenário, é esta tabela:

```bash
$ ip route
default via 10.20.30.1 dev enp0s3 proto dhcp metric 100
10.20.30.0/24 dev enp0s3 proto kernel scope link src 10.20.30.40 metric 100
```

O destino `200.150.10.80` não casa com `10.20.30.0/24`, então cai na linha `default` e o
pacote vai para `10.20.30.1`. É por isso que, na linha do `tcpdump` da seção 2, o **MAC de
destino é o do roteador** (`00:1a:2b:3c:4d:5e`) enquanto o **IP de destino é o do servidor**
(`200.150.10.80`). Endereço de camada 3 aponta para o destino final; endereço de camada 2
aponta para o próximo salto.

**Outros protocolos desta camada, e por que estão aqui:**

- **ICMP** (*Internet Control Message Protocol*): mensagens de controle e erro do próprio IP — "destino inalcançável", "tempo excedido", o `ping`. Ele viaja **dentro** de um pacote IP (protocolo 1), o que faz gente jurar que é transporte. Não é: ==ICMP é da camada de inter-rede==, porque serve ao IP, não às aplicações. Caiu assim no IPEA 2024 (Q08).
- **ARP** (*Address Resolution Protocol*): descobre o MAC correspondente a um IP da rede local, perguntando em **broadcast** — uma transmissão endereçada a *todas* as máquinas do segmento de uma vez. Fica entre as duas camadas — no OSI a resposta esperada é **camada 2**; nas questões que falam em "rede TCP/IP", a banca aceita e cobra ARP como o protocolo que faz a **tradução de endereço lógico em físico** (AgeRIO 2023, Q09), sem exigir a camada.
- **IGMP** (*Internet Group Management Protocol*), que administra grupos **multicast** — entrega de uma cópia só para um **grupo** de destinatários inscritos, em vez de para todos (broadcast) ou para um só (**unicast**). Aparece quase sempre como distrator.

**Palavras que a banca usa:** *"encaminhamento"*, *"roteados da origem até o destino"*,
*"endereço lógico"*, *"controla a operação da sub-rede"*, *"melhor esforço"*,
*"sem conexão"*, *"tabela de rotas"*, *"gateway"*, e — atenção — tanto ==camada de rede== quanto
==camada de inter-rede==, que aqui são a mesma coisa.

**Confunde-se com:** a camada de **transporte** (o distrator "o UDP fica na camada de rede")
e com a de **enlace** (quem confunde endereço lógico com físico).

> [!analogia] A triagem dos Correios
> O centro de triagem olha só o CEP e decide para qual cidade o pacote segue. Não abre, não
> confere se chegou, não guarda cópia.
> **Onde quebra:** o CEP identifica um lugar fixo, e o IP identifica uma **interface**, que
> muda de valor quando a máquina troca de rede — e pode ser reescrito no meio do caminho
> pelo **NAT** (*Network Address Translation*, a tradução que o roteador faz entre o
> endereço privado da rede interna e o endereço público de saída).
> Além disso os Correios rastreiam a encomenda; o IP não guarda estado nenhum, e é
> exatamente por não guardar que ele escala.

### 3.4 · Camada de Acesso à Rede

**O problema que resolve.** Alguém tem que colocar os bits no cabo e tirá-los de lá, e cada
tecnologia faz isso de um jeito. Sem esta camada, o IP teria que conhecer voltagem de par
trançado, modulação de rádio e formato de quadro Ethernet — e mudaria a cada tecnologia
nova.

**Como funciona por dentro.** Ela pega o pacote IP, embrulha num **quadro** (*frame*) com o
**MAC** (*Media Access Control*, o endereço físico de 48 bits gravado na placa) de origem e
de destino, resolve a disputa pelo meio (quem transmite quando), acrescenta um código
detector de erro no fim — o **FCS** (*Frame Check Sequence*) — e transmite. **O quadro é
descartado e refeito a cada salto**; o pacote IP atravessa a viagem inteira.

Ela também carrega o campo que diz **para qual protocolo de cima entregar**: o
**EtherType**, de 16 bits, no quadro Ethernet. `0x0800` = IPv4, `0x0806` = ARP,
`0x86DD` = IPv6. É o que aparece escrito na nossa linha de `tcpdump`.

**A PDU:** **quadro** (*frame*). Abaixo dele, no fio, **bits**.

**Exemplo concreto.** A associação IP ↔ MAC que a camada usa para montar o quadro fica na
tabela ARP:

```bash
$ ip neigh
10.20.30.1 dev enp0s3 lladdr 00:1a:2b:3c:4d:5e REACHABLE
```

**Protocolos e padrões daqui:** Ethernet (padrão **IEEE** 802.3 — o
*Institute of Electrical and Electronics Engineers* é quem normaliza as tecnologias de
enlace), Wi-Fi (IEEE 802.11),
PPP (*Point-to-Point Protocol*, usado em enlaces ponto a ponto como linha discada e ADSL),
HDLC (*High-Level Data Link Control*, o padrão ISO de enquadramento em que o PPP se baseia)
e, em redes de operadora, Frame Relay e ATM (*Asynchronous Transfer Mode*).

**Palavras que a banca usa:** *"acesso ao meio"*, *"quadro"*, *"endereço físico"*,
*"nós adjacentes"*, *"enlace"*, *"mesma rede"*, *"interface de rede"*.

**Confunde-se com:** as camadas **1 e 2 do OSI** — porque é exatamente nelas que ela se
divide. E é aqui que mora a segunda diferença estrutural mais cobrada:
==o modelo TCP/IP não separa físico de enlace==;
a RFC 1122 trata a interface com a rede como uma coisa só e não
diz nada sobre voltagem ou conector.

> [!analogia] O trecho de caminhão
> Cada trecho da viagem tem seu veículo e sua regra própria — caminhão na estrada, barco no
> rio, moto na cidade. A carga é a mesma; o veículo troca em cada baldeação.
> **Onde quebra:** o motorista não reescreve o endereço da encomenda a cada baldeação, e
> aqui o **cabeçalho de camada 2 é jogado fora e refeito inteiro** em cada salto, com MACs
> novos. Nada do quadro sobrevive ao roteador — só o pacote que estava dentro.

## 4 · O ponto que decide a questão: os nomes de cada camada

**Esta é a seção de maior retorno da aula.** A CESGRANRIO quase nunca erra o conceito — ela
troca o **nome**. E, medindo as nove questões reais que estão no fim desta aula, a mesma
banca chama a mesma camada de coisas diferentes de um ano para o outro. (Na tabela abaixo,
**IPsec** — *IP Security* — é o conjunto de protocolos que cifra e autentica pacotes IP; ele
volta na seção 6 e no gabarito da Q12.)

| Camada TCP/IP | Nomes que a banca já usou, em prova | Onde apareceu |
|---|---|---|
| 4 · **Aplicação** | "camada de aplicação", "nível de aplicação", "nível de aplicação internet TCP/IP" | BANESE 2025; TRANSPETRO 2018·Q48 |
| 3 · **Transporte** | "camada de transporte", "nível de transporte" | TRANSPETRO 2018·Q45, 2023 (Informática) |
| 2 · **Inter-rede** | ==**"camada de inter-rede"**== · ==**"camada de rede"**== · "camada IP" | BANESE 2025 (inter-rede); IPEA 2024 (rede); IPsec, 2023·Q42 (camada IP) |
| 1 · **Acesso à rede** | "camada de enlace", "camada de acesso à rede", "host-rede" | — (só em distrator, até agora) |

E o conjunto inteiro também troca de nome: **"arquitetura TCP/IP"** (TRANSPETRO 2023·Q53 e
IPEA 2024), **"arquitetura de protocolos TCP/IP"** (BANESE 2025), **"arquitetura de
protocolos da Internet"** (BANESE 2025), **"arquitetura da internet"** (IPEA 2024),
**"modelo Internet"** (CNU 2024), **"pilha de protocolos da arquitetura TCP/IP"**
(BNDES 2024), **"rede TCP/IP"** (AgeRIO 2023).

> [!decore]
> **Regra prática:**
> ==nunca elimine uma alternativa porque o nome da camada "está errado"==.
> Se a questão for de TCP/IP, *camada de rede* e *camada de inter-rede* são a
> mesma coisa. Elimine pela **função** descrita, nunca pelo rótulo.
>
> A recíproca é a armadilha da Q43 de 2018: **"nível de internet" numa lista das sete
> camadas do OSI está errado**, porque ali o nome pertence ao outro modelo.

## 5 · O mapeamento, camada por camada

A tabela que a prova cobra. Repare que **nenhuma linha é uma correspondência de um para um
em todas as posições** — duas linhas juntam camadas do OSI, e é daí que sai quase todo
distrator.

| OSI | TCP/IP (4 camadas, RFC 1122) | PDU | Protocolos | Endereço usado |
|---|---|---|---|---|
| 7 Aplicação · 6 Apresentação · 5 Sessão | **Aplicação** | mensagem / dados | HTTP, DNS, SMTP, FTP, SSH, DHCP, SNMP | nome (`www.transpetro.com.br`) |
| 4 Transporte | **Transporte** | segmento (TCP) / datagrama (UDP) | TCP, UDP | porta (`51344`, `80`) |
| 3 Rede | **Inter-rede** (Internet) | pacote / datagrama IP | IP, ICMP, IGMP, (ARP) | IP (`10.20.30.40`) |
| 2 Enlace · 1 Física | **Acesso à rede** | quadro / bits | Ethernet, Wi-Fi, PPP, HDLC | MAC (`A4:BB:6D:11:22:33`) |

Três leituras que a banca cobra separadamente:

1. **7, 6 e 5 do OSI viram uma só.** ==No modelo TCP/IP não existem camadas de Sessão e de Apresentação.== Se a alternativa oferecer "camada de sessão" numa questão que diz explicitamente "arquitetura TCP/IP" ou "modelo Internet", ela está errada por existência, não por função.
2. **2 e 1 do OSI viram uma só.** O TCP/IP não distingue enlace de física.
3. **Transporte e Rede são as únicas com correspondência exata.** Por isso a pergunta mais fácil e mais frequente é *"a que camadas do OSI correspondem TCP e IP?"* — resposta **transporte e rede** (é a Q03 desta aula, do UNEMAT 2024).

> [!nota] A variante de cinco camadas
> Alguns autores (Tanenbaum, Kurose) usam um modelo **híbrido de cinco camadas** —
> Aplicação, Transporte, Rede, Enlace, Física — que é o TCP/IP com a última camada aberta em
> duas. **A CESGRANRIO não usou essa variante em nenhuma das questões deste caderno**: ela
> cobra o OSI de 7 ou o TCP/IP de 4. Se um enunciado disser "cinco camadas", é do híbrido
> que ele está falando, e a diferença é só essa.

### Onde a analogia da correspondência quebra

> [!analogia] A tradução entre duas línguas
> Mapear OSI e TCP/IP é como traduzir: cada termo de um lado tem seu equivalente do outro.
> **Onde quebra — e é ponto de prova:** tradução pressupõe que os dois textos digam a mesma
> coisa, e aqui eles **não dizem**. Três diferenças reais de conteúdo, não de rótulo:
>
> - O OSI separa formalmente **serviço**, **interface** e **protocolo**; o TCP/IP nasceu sem essa separação, porque os protocolos vieram antes.
> - A camada de rede do **OSI** oferece serviço **com e sem conexão**; a de **inter-rede do TCP/IP oferece só sem conexão**. Na camada de transporte é o contrário: o OSI original só previa serviço **orientado à conexão**, e o TCP/IP oferece **os dois** (TCP e UDP).
> - O OSI é uma norma que descreve o que uma rede *deveria* ser; o TCP/IP é a descrição do que uma rede **é**.

## 6 · Como a pilha sabe para quem entregar: os três campos que costuram as camadas

Esta é a parte mecânica que fecha o conceito de "pilha", e ela vale por três questões.

Na **descida**, cada camada acrescenta seu cabeçalho. Na **subida**, cada camada precisa
saber a qual protocolo da camada de cima entregar o conteúdo. Ela sabe porque **quem desceu
escreveu isso num campo**:

| Quem entrega | Campo do cabeçalho | Valores que a prova cobra |
|---|---|---|
| Acesso à rede → Inter-rede | **EtherType** (16 bits, no quadro Ethernet) | `0x0800` IPv4 · `0x0806` ARP · `0x86DD` IPv6 |
| Inter-rede → Transporte | **Protocol** (8 bits, no cabeçalho IPv4) | `1` ICMP · `6` **TCP** · `17` **UDP** · `50` ESP · `51` AH |
| Transporte → Aplicação | **porta de destino** (16 bits) | `80` HTTP · `443` HTTPS · `53` DNS · `22` SSH · `25` SMTP |

Os dois valores da linha do meio que ainda não apareceram:
**ESP** (*Encapsulating Security Payload*) e **AH** (*Authentication Header*) são os dois
protocolos do IPsec — o AH só
autentica, o ESP cifra o pacote inteiro. Guarde o par: ele cai nas duas provas da TRANSPETRO,
e o número próprio no campo `Protocol` é a prova de que os dois vivem na inter-rede.

Aplicando ao nosso pacote, na subida, dentro do servidor `200.150.10.80`:

1. A placa recebe o quadro, confere o FCS, lê `ethertype 0x0800` → **entrega ao IP**.
2. O IP confere que `200.150.10.80` é dele, lê o campo `Protocol = 6` → **entrega ao TCP**.
3. O TCP lê a porta de destino `80` e procura na tabela de sockets → **entrega ao processo do servidor web**.
4. O servidor web lê `GET / HTTP/1.1` e responde.

> [!decore]
> **6 é TCP, 17 é UDP, 1 é ICMP** — no campo *Protocol* do IP.
> **0x0800 é IPv4, 0x0806 é ARP** — no EtherType.
> São números pequenos e a banca gosta de distrator numérico vizinho (T8).

## 7 · Palavra do enunciado → conceito

| Se o enunciado disser | Ele está falando de | Não confunda com |
|---|---|---|
| "arquitetura TCP/IP", "modelo Internet", "arquitetura de protocolos da Internet" | a pilha de **4 camadas** | modelo OSI, de 7 |
| "camada de inter-rede", "camada IP" | a **camada 2 do TCP/IP** = camada 3 do OSI | a camada de enlace |
| "camada de rede", num enunciado de TCP/IP | também a **camada de inter-rede** | a "camada de rede" do OSI é a mesma; o rótulo não muda a resposta |
| "fim a fim", "ponta a ponta", "entre as extremidades", "orientado à conexão" | **camada de transporte**, e em geral **TCP** | enlace, que faz o mesmo entre nós adjacentes |
| "entrega não é confiável", "melhor esforço", "sem conexão", "encaminhamento" | **IP**, camada de inter-rede | UDP, que é não confiável mas é transporte |
| "endereço lógico de 32 bits" | **IP** (IPv4) | MAC, que é físico e de 48 bits |
| "endereço físico da interface de rede" | **MAC**, camada de acesso à rede | endereço IP |
| "traduzir o endereço lógico no físico" | **ARP** | DNS, que traduz nome em IP |
| "informar erros de transmissão", "destino inalcançável", "ping" | **ICMP**, camada de inter-rede | TCP, que trata erro fim a fim |
| "nível de aplicação", nome de protocolo conhecido | **camada de aplicação** | apresentação, que só existe no OSI |
| "controle de diálogo", "sintaxe e semântica" | camadas **5 e 6 do OSI** | não existem no TCP/IP — se a questão for de TCP/IP, a alternativa está errada por existência |
| "sete camadas", "níveis de protocolos" na lista | **OSI** | qualquer nome vindo do TCP/IP na lista é o erro plantado |

## 8 · Tabela comparativa: os pares que a banca troca

| | Camada de **inter-rede** (IP) | Camada de **transporte** (TCP/UDP) |
|---|---|---|
| Entrega para | a **máquina** (interface) | o **processo** (porta) |
| Endereço | IP, 32 bits (IPv4) | porta, 16 bits |
| Escopo | salto a salto, ao longo do caminho | **fim a fim**, só as pontas |
| Confiabilidade | nunca (melhor esforço) | TCP sim, UDP não |
| PDU | pacote / datagrama IP | segmento / datagrama UDP |
| Quem processa no meio do caminho | **todo roteador** | ninguém |

| | Camada de **acesso à rede** | Camada de **inter-rede** |
|---|---|---|
| Endereço | MAC, 48 bits, gravado na placa | IP, 32 bits, configurado |
| Alcance | um enlace, um salto | a internet inteira |
| Sobrevive ao roteador? | **não** — o quadro é refeito | **sim** — o pacote atravessa inteiro |
| Camadas do OSI que cobre | 1 e 2 | 3 |

## Onde a banca derruba

> [!pegadinha] "Nível de internet" numa lista das sete camadas do OSI
> Foi o gabarito inteiro da Q43 de 2018. A banca escreve as sete camadas do OSI na ordem
> certa e troca **só a última** por um nome do modelo TCP/IP. Nome correto, modelo errado.
> Leia a lista até o fim; o erro está sempre no último ou no penúltimo item, quando você já
> decidiu que a alternativa estava certa.

> [!pegadinha] "O UDP fica na camada de rede porque é mais simples"
> Alternativa D da Q576 do CNU 2024, quase palavra por palavra. Simplicidade não muda
> camada: ==TCP e UDP são os dois da camada de transporte==. O que muda é o serviço que cada
> um oferece dentro dela.

> [!pegadinha] ICMP no transporte
> ICMP viaja dentro de um pacote IP e fala de portas nas mensagens de erro — daí a
> tentação. Mas ele serve ao **IP**, não a aplicações, e não tem porta própria: é da
> **camada de inter-rede**. Vale a mesma resposta quando o enunciado disser "camada de rede
> da arquitetura TCP/IP".

> [!pegadinha] Sessão e Apresentação num enunciado de TCP/IP
> "com o suporte da camada de sessão" foi distrator no CNU 2024. Se o enunciado disse
> *arquitetura TCP/IP* ou *modelo Internet*, essas camadas **não existem** — a alternativa
> cai sem que você precise avaliar a função descrita.

> [!pegadinha] Confundir "não confiável" do IP com "não confiável" do UDP
> Os dois são não confiáveis, e a banca aproveita. A separação é o **escopo**: o IP não é
> confiável porque não confirma nada em salto nenhum; o UDP não é confiável porque não
> confirma **fim a fim**, embora entregue ao processo certo. Numa questão que diga "fim a
> fim", a resposta nunca é IP.

> [!pegadinha] O nome do modelo no enunciado decide onde fica a criptografia
> Enunciado de **OSI** → criptografia é camada **6, Apresentação**. Enunciado de **TCP/IP**
> → criptografia é **aplicação**, porque a 6 não existe ali. A mesma pergunta tem duas
> respostas certas, e quem escolhe é a primeira linha do enunciado.

## Questões

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

### Q02 · CESGRANRIO · TRANSPETRO 2023 (cargo Informática)

> [!fonte] Fonte: prova TRANSPETRO 2023, cargo Informática — do seu caderno CESGRANRIO
> Mesma empresa, mesmo ano e mesmo dia da nossa prova, para outro cargo. Interessa aqui por
> uma razão de vocabulário: o enunciado diz *"rede TCP/IP"* e, mesmo assim, oferece o **IP**
> como candidato a protocolo de transporte. É o teste puro do mapeamento.
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
> **Gabarito: D.** Confiável = **TCP**; não confiável = **UDP**. Os dois são da camada de
> transporte (seção 3.2).
>
> - **B** é a resposta certa com a **ordem invertida** — a armadilha para quem não confere o "respectivamente". **T4 (inversão de ordem)**.
> - **A**, **C** e **E** oferecem o **IP**, que é da camada de **inter-rede**, não de transporte. O próprio enunciado já disse "na camada de transporte", então o IP está eliminado antes de qualquer raciocínio sobre confiabilidade. **T2 (irmão taxonômico: protocolo real da camada errada)**.
>
> Aprenda a leitura rápida: em questão de transporte,
> ==toda alternativa que contiver IP, ICMP ou ARP já está errada==,
> porque os três são de inter-rede.

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

### Q04 · CESGRANRIO · BANESE 2025

> [!fonte] Fonte: prova BANESE 2025, Informática/Suporte — do seu caderno CESGRANRIO
> A questão mais recente da aula, e um bom exemplo de indexação enganosa: no caderno ela
> está catalogada em "Algoritmos de Codificação e de Detecção de Erros", mas o que ela cobra
> é a camada de transporte da arquitetura da Internet. Achei-a buscando pelo **vocabulário**
> do enunciado, não pelo nome do assunto.
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
> **Gabarito: C.** Três expressões do enunciado apontam para o **TCP**, e qualquer uma
> resolve: *"orientado à conexão"*, *"controle de erro e controle de fluxo"* e *"fim a fim"*.
>
> - **A, Internet Protocol** e **E, Internet Control Message Protocol** são da camada de **inter-rede**, e nenhum dos dois é orientado à conexão.
> - **D, Internet Group Message Protocol** — o nome real é *Internet **Group Management** Protocol* (IGMP), e ele também é de inter-rede. Nome levemente deformado: **T1** embutido num **T2**.
> - **B, User Datagram Protocol** é o irmão certo na camada certa e o distrator mais forte: ele é da camada de transporte, mas **não é orientado à conexão** e não faz controle de erro nem de fluxo.
>
> Tipo de distrator: **T2 (irmão taxonômico)**, com todos os nomes por extenso — truque
> comum da banca para esconder siglas que você reconheceria na hora. Treine ler
> "Transmission Control Protocol" e ver "TCP".

### Q05 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: prova IPEA 2024, Infraestrutura de Tecnologia da Informação — do seu caderno CESGRANRIO
> O mesmo conceito da Q04 atacado pelo outro lado: em vez de definir o transporte, o
> enunciado descreve **o que falta na camada de baixo**. É o argumento da seção 3.3 — o IP é
> não confiável de propósito — virado em questão.
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
> **Gabarito: C.** *"Fim a fim"* + *"controle de erro e de fluxo"* = **TCP**, sempre.
>
> As quatro erradas cobrem a pilha inteira, uma por função:
> **A, IP** é justamente o protocolo não confiável que o enunciado descreve no começo — quem
> lê rápido marca aqui achando que a pergunta é "quem entrega os pacotes".
> **D, ICMP** relata o erro, mas não corrige nem retransmite nada: é da inter-rede.
> **E, ARP** resolve endereço físico, não tem nada com entrega fim a fim.
> **B, UDP** é da camada certa e é o distrator forte, de novo: transporte sem confiabilidade.
>
> Tipo de distrator: **T2 (irmão taxonômico)** em todas — os cinco protocolos existem e são
> da mesma família. O discriminante escondido é a expressão **"fim a fim"**, que sozinha
> elimina IP, ICMP e ARP.

### Q06 · CESGRANRIO · BANESE 2025

> [!fonte] Fonte: prova BANESE 2025, Informática/Suporte — do seu caderno CESGRANRIO
> A única questão do conjunto que usa o termo ==camada de inter-rede== no enunciado, e a que
> cobra o que essa camada de fato **decide**: local ou remoto. Exige uma conta de máscara,
> feita passo a passo no comentário.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/3347868)

A arquitetura de protocolos TCP/IP define um conjunto de protocolos de comunicação usados
para interconectar dispositivos de rede na Internet. Esses protocolos de comunicação também
podem ser usados em uma rede privada de computadores. Suponha um computador W configurado
com o endereço IPv4 e a máscara 200.236.225.100/22, operando numa rede local na qual o
gateway padrão usa o endereço IPv4 200.236.224.1 e o gateway de borda da empresa usa o
endereço IPv4 200.236.230.1. Sabe-se que o gateway padrão tem uma outra interface de rede
ligada ponto a ponto com o gateway de borda. Nesse cenário, o computador W precisa enviar um
pacote para o computador Y, cujo endereço IPv4 é 200.236.226.150. Quando esse pacote estiver
preparado, a camada de inter-rede do computador W irá

- [ ] entregar o pacote para o gateway de borda.
- [x] entregar o pacote diretamente para o computador Y.
- [ ] entregar o pacote para o gateway padrão da rede local.
- [ ] acusar erro pois o gateway padrão não está na rede local do computador W.
- [ ] acusar erro pois o gateway padrão não está na rede local do computador Y.

> [!gabarito]-
> **Gabarito: B.** É o item 1 da seção 3.3, aplicado com números.
>
> `/22` significa que os 22 primeiros bits são de rede. Como 22 = 16 + 6, os dois primeiros
> octetos são fixos e o **terceiro octeto** tem só os 6 bits mais altos fixos — ou seja, ele
> varia em blocos de 4 (256 ÷ 2⁶ = 4). A faixa que contém 225 é **224 a 227**. Então a rede
> de W é:
>
> | | |
> |---|---|
> | Rede | `200.236.224.0/22` |
> | Faixa de hosts | `200.236.224.1` a `200.236.227.254` |
> | W | `200.236.225.100` — dentro |
> | **Y** | `200.236.226.150` — **dentro** |
> | Gateway padrão | `200.236.224.1` — dentro |
> | Gateway de borda | `200.236.230.1` — **fora** (230 > 227) |
>
> Y está na mesma rede que W. A camada de inter-rede compara o resultado da máscara nos dois
> endereços, vê que são iguais e **entrega direto**, sem passar por roteador nenhum. Só
> quando o destino cai fora é que o pacote vai para o gateway padrão.
>
> - **C** é a resposta de quem não fez a conta e assumiu que todo pacote passa pelo gateway. É o distrator principal.
> - **A** joga o pacote no gateway de borda, que W nem sabe que existe — o enunciado dá esse endereço só para poluir.
> - **D** e **E** são **T6 (termo certo com justificativa falsa)**: afirmam um erro que não ocorre, e a justificativa é factualmente falsa nas duas (o gateway padrão `.224.1` **está** na rede de W, e Y está na mesma rede).
>
> A conta de máscara é assunto de **R09**; aqui o que se cobra é **de quem é a decisão** —
> e a resposta é: da camada de inter-rede, em toda transmissão, antes de qualquer coisa.

### Q07 · CESGRANRIO · CNU 2024

> [!fonte] Fonte: prova CNU 2024, Bloco Temático 2 — do seu caderno CESGRANRIO
> A questão que mais depende desta aula em particular: três das cinco alternativas erram por
> **camada**, não por função. Aparece também em R02, por causa da alternativa (a); aqui o
> foco é outro.
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
> **Gabarito: E.** É a definição do UDP: **não orientado a conexão**, sem estado
> compartilhado entre as pontas.
>
> As quatro erradas, na ordem, são um resumo da aula:
>
> - **A** — a PDU do UDP não é *segmento*, é **datagrama**. Segmento é do TCP (seção 3.2). Repare que a alternativa acerta a camada e o modelo ("no modelo Internet", "camada de transporte") e erra só o nome da PDU: **T7 (variação mínima)**.
> - **B** — atribui ao UDP as garantias do TCP e ainda invoca a ==camada de sessão, que não existe no modelo Internet==. Erra duas vezes; a segunda é a que interessa nesta aula. **T3 + T1**.
> - **C** — descreve o TCP (conexão lógica, **full-duplex** = os dois lados transmitem ao mesmo tempo, ACK), e ainda planta *NAK* (*negative acknowledgement*, confirmação negativa, usada em outros protocolos para dizer "não recebi"), que o TCP não usa. **T3 (definição verdadeira do conceito errado)**.
> - **D** — o erro que a seção 3.2 antecipa palavra por palavra: ==o UDP não está na camada de rede==; ele e o TCP estão os dois no transporte. Simplicidade não muda camada. **T6 (termo certo, justificativa falsa: "por ser mais simples")**.

### Q08 · CESGRANRIO · IPEA 2024

> [!fonte] Fonte: prova IPEA 2024, Infraestrutura de Tecnologia da Informação — do seu caderno CESGRANRIO
> Cobra o ICMP como protocolo **da camada de rede da arquitetura TCP/IP** — o enunciado diz
> isso com todas as letras — e testa se você entendeu *quem* gera a mensagem de erro. Vale
> menos pela resposta e mais pela primeira linha.
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
> **Gabarito: E.** *Port Unreachable* significa "o pacote chegou na máquina certa, mas **não
> há processo escutando naquela porta**". Só quem pode saber disso é
> ==a máquina de destino==: porta é informação da camada de transporte, e os roteadores do
> caminho não
> olham o cabeçalho de transporte (seção 8, linha "quem processa no meio do caminho").
>
> As quatro erradas são todas **gateways**, e todas cometem o mesmo erro conceitual: pedir
> que um roteador conheça a tabela de sockets de outra máquina. **T2 (irmão taxonômico)**
> com uma pitada de **T7** — as quatro diferem entre si por uma palavra ("entrada", "saída",
> "borda do provedor do destinatário", "borda do provedor do remetente"), o que faz o
> candidato gastar o tempo comparando-as em vez de perceber que nenhuma serve.
>
> Guarde a associação da seção 3.3: **ICMP é da camada de inter-rede** (aqui chamada de
> "camada de rede"), mas as mensagens dele podem **citar** informação de transporte, porque
> o ICMP carrega os primeiros bytes do pacote que causou o erro. Citar não é pertencer.

### Q09 · CESGRANRIO · AgeRIO 2023

> [!fonte] Fonte: prova AgeRIO 2023, Tecnologia da Informação — do seu caderno CESGRANRIO
> A costura entre as duas camadas de baixo: endereço lógico de um lado, físico do outro, e o
> protocolo que faz a ponte. É a questão que fecha o "endereço de cada camada" da tabela da
> seção 5.
> [Ver no TecConcursos](https://www.tecconcursos.com.br/questoes/2462907)

Cada host recebe pelo menos um endereço lógico de 32 bits (endereço IPv4) para operar na
rede TCP/IP. No momento da transmissão física dos dados, é necessário fazer a tradução do
endereço IPv4 no respectivo endereço físico da interface de rede.

Para descobrir o endereço físico da interface de rede do host destino, o host de origem pode
usar o

- [ ] UDP
- [x] ARP
- [ ] ICMP
- [ ] IGMP
- [ ] TCP

> [!gabarito]-
> **Gabarito: B.** *Address Resolution Protocol*: pergunta em broadcast na rede local "quem
> tem o IP `10.20.30.1`?" e recebe de volta o MAC. É o protocolo que preenche a tabela do
> `ip neigh` da seção 3.4.
>
> - **A, UDP** e **E, TCP** são de transporte, e trabalham com **portas**, não com endereços.
> - **C, ICMP** e **D, IGMP** são da inter-rede, mas nenhum dos dois resolve endereço: o ICMP relata erro, o IGMP administra grupos multicast.
>
> Tipo de distrator: **T2 (irmão taxonômico)** puro — quatro protocolos reais da mesma pilha,
> nenhum com a função pedida. O discriminante é a expressão
> ==tradução do endereço lógico no físico==, que só o ARP faz.
>
> **Cuidado com a pergunta gêmea:** quem traduz **nome** em IP é o **DNS**; quem traduz **IP**
> em **MAC** é o **ARP**. A banca troca os dois com frequência.

## Figuras pendentes

**Nenhuma.** Todas as 13 questões desta aula têm enunciado e alternativas em texto — nenhuma
delas está marcada com `alt_em_imagem = S` nos índices. Não há nada para recortar de PDF.

## Onde treinar no TecConcursos

Matéria: **TI - Redes de Computadores**

**Filtro principal desta aula**

| | |
|---|---|
| Assunto | `Modelos de Referência de Redes` › **`Arquitetura TCP/IP`** |
| Hierarquia | `03.02` |
| Questões no acervo | 1560 |
| No seu caderno CESGRANRIO | 0 sob este rótulo — as questões estão espalhadas (ver abaixo) |

Marque também a banca **CESGRANRIO**. Este assunto é o exemplo perfeito do aviso do
`_MODELO.md`: **as questões estão indexadas sob outro rótulo**. Das 9 questões reais desta
aula, nenhuma está catalogada em "Arquitetura TCP/IP" — elas aparecem em "Modelo OSI",
"TCP e UDP", "ICMP", "ARP e RARP", "Máscara e Endereçamento IP" e até em "Algoritmos de
Codificação e de Detecção de Erros". Por isso, aqui, os complementos valem mais que o filtro
principal.

**Complementos, para o resto da semana**

| Assunto | Hierarquia | Questões | Por quê |
|---|---|---|---|
| `Modelos de Referência de Redes` › **`Modelo OSI`** | `03.01` | 2106 | Onde a banca de fato catalogou as questões de mapeamento; 7 no seu caderno, 3 na prova de 2018 |
| `Principais Protocolos de Redes` › **`TCP e UDP`** | `07.03` | 1495 | A camada de transporte é a mais cobrada da pilha; 4 no caderno, 1 na prova de 2018. É o filtro de **R04**, amanhã |
| `Principais Protocolos de Redes` › **`Protocolo IP`** › **`Conceitos e Especificações do IP`** | `07.02.01` | 1066 | A camada de inter-rede vista pelo protocolo; 7 no seu caderno, 4 delas da própria TRANSPETRO |
| `Conceitos Iniciais de Redes de Computadores` › **`Definição de Protocolo e Funcionamento Geral`** | `01.03` | 89 | Acervo pequeno e direto ao conceito de camada, serviço e protocolo. Bom para 15 min |
| `Modelos de Referência de Redes` › **`Endereço MAC e Subcamadas`** | `03.03` | 140 | Fecha a camada de acesso à rede, que é a menos cobrada e a menos estudada |

> [!checklist]
> - As quatro camadas do TCP/IP, de baixo para cima: **acesso à rede, inter-rede, transporte, aplicação**.
> - O que some no mapeamento: **sessão e apresentação** (viram aplicação); **física e enlace** (viram acesso à rede).
> - As duas correspondências exatas: **transporte ↔ transporte** e **rede ↔ inter-rede**.
> - "Camada de rede" e "camada de inter-rede" são **a mesma camada**; nunca elimine pelo nome.
> - "Nível de internet" numa lista do **OSI** é sempre erro plantado.
> - Endereço por camada: **nome → porta → IP → MAC**.
> - Os três campos que costuram a pilha: **EtherType** (`0x0800` IPv4, `0x0806` ARP), **Protocol** (`1` ICMP, `6` TCP, `17` UDP), **porta** (`80`, `443`, `53`).
> - ICMP e ARP são de **inter-rede**; TCP e UDP são de **transporte**; simplicidade não muda camada.
