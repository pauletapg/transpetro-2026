# TRANSPETRO 2026 — calendário de estudos

Analista de Sistemas Júnior · Ênfase 4 (Infraestrutura) · prova em **29/11/2026**.

Site estático com um servidor local mínimo. O computador escreve, o celular lê.
Sem banco de dados e sem biblioteca de terceiros: HTML, CSS, JavaScript e Python
da instalação padrão.

---

## O dia a dia

**Estudar** — dê dois cliques em `iniciar.bat`. Ele indexa as aulas, sobe o
servidor **minimizado** e abre o navegador. Abra a sessão do dia, siga os
tópicos, registre questões feitas e acertos, anote os erros.

**Publicar** — clique em **↑ Publicar** no topo da página. Ele grava o que
estiver pendente, faz o commit e envia para o GitHub; em cerca de um minuto o
celular mostra a versão nova. O `publicar.bat` faz o mesmo, fora do navegador.

> **Gravar ≠ Publicar.** Gravar escreve no arquivo do computador e acontece
> sozinho a cada alteração. Publicar manda para o GitHub — é só isso que o
> celular enxerga. Gravar sem publicar deixa o celular desatualizado.

**Parar** — `parar.bat`, ou feche a janela minimizada do servidor.

### Por que existe um servidor

Navegador nenhum lê arquivos do disco por `file://`, então o site precisa ser
servido. E o servidor resolve um segundo problema: **Brave e Firefox bloqueiam
a gravação direta em arquivo**. Com ele, a página manda o progresso para o
Python e o Python escreve — funciona em qualquer navegador.

| Onde | Grava? |
|---|---|
| Computador, com `iniciar.bat` rodando | **Sim**, em qualquer navegador |
| Computador, sem o servidor, no Chrome ou Edge | Sim, pela File System Access API |
| Computador, sem o servidor, no Brave ou Firefox | Não |
| Celular, pelo GitHub Pages | Não — de propósito |

O servidor escuta só em `127.0.0.1`: nada fica exposto na rede.

---

## Escrever uma aula

As aulas são **Markdown** e esta pasta é um vault do Obsidian. Escreva lá.

1. Copie `aulas/_MODELO.md` para a pasta da disciplina.
2. Dê um nome legível: `aulas/redes/Modelo OSI - as sete camadas.md`.
3. No frontmatter, ponha o **`id` do tópico**.

```yaml
---
id: R05
titulo: Topologias e meios físicos
resumo: O que você vai saber fazer ao terminar.
tempo: 90 min
---
```

**O `id` é a única coisa que liga o arquivo ao calendário.** Pasta e nome do
arquivo são livres — organize como quiser. A aula aparece na próxima vez que
você rodar o `iniciar.bat`.

### Regra das questões

Toda questão diz de onde veio, no próprio título:

```markdown
### Q01 · TRANSPETRO 2018 · questão 41
### Q05 · Inédita
```

**"Inédita" é obrigatório** quando a questão foi escrita a partir do perfil da
banca em vez de copiada de uma prova. Nunca fica implícito.

Toda aula lista as questões de **2018 e 2023** relacionadas ao assunto, com o
enunciado inteiro, e a teoria da aula é suficiente para resolvê-las. Para achar
essas questões:

```bash
python ferramentas\assuntos.py osi --provas
```

A ferramenta varre os índices `.csv` do projeto e devolve o **nome real do
assunto no TecConcursos** mais as questões de prova que caem nele. Use esse nome
na seção "Onde treinar no TecConcursos" da aula — não invente o nome do filtro.

### Callouts

Sintaxe do Obsidian. Fica bom lá e no site:

| Você escreve | Vira |
|---|---|
| `> [!banca]` | caixa verde — o que a CESGRANRIO cobra |
| `> [!pegadinha] Título` | caixa vermelha — a alternativa "quase certa" |
| `> [!nota]` | caixa azul — observação lateral |
| `> [!decore]` | caixa amarela — mnemônico, ordem, sigla |
| `> [!gabarito]-` | comentário recolhido, abre ao clicar |
| `> [!checklist]` | checklist de véspera |

Alternativas de questão são lista de tarefa — `[x]` marca a correta:

```markdown
- [ ] alternativa errada
- [x] alternativa correta
```

**A resposta certa não aparece destacada na tela** até você abrir o comentário.
No PDF, os comentários saem de perto das questões e viram um **caderno de
gabaritos** em página própria no fim — dá para responder no papel e conferir
depois.

Também funcionam tabelas, ` ``` ` para código, `**negrito**`, `*destaque*`,
`` `código` ``, `==marcação==` e HTML solto quando precisar.

O visual de todas as aulas vem de `assets/aula.css`.

---

## Banca, TRANSPETRO e ajuda

O botão **?** no topo abre três abas de referência, editáveis em
`info/*.md`:

- **Sobre a banca** — o molde dominante da CESGRANRIO, os números da TRANSPETRO
  contra o resto, os tipos de distrator recorrentes.
- **Sobre a TRANSPETRO** — estrutura da prova, o que mudou no edital de 2026,
  onde estiveram os pontos em 2018 e 2023.
- **Ajuda** — como o programa funciona.

## Ler offline no celular

Abra o site e toque em **⤓ Offline**. Ele baixa calendário e aulas; a partir daí
abre sem internet. Toque de novo depois de publicar aulas novas. Adicione à tela
de início e ele abre como aplicativo.

Só funciona em HTTPS ou localhost — no GitHub Pages, sim.

## Salvar em PDF

Dentro de qualquer aula, botão **⎙ PDF** → *Salvar como PDF*.

---

## Como está organizado

```
estudos-transpetro/
├─ index.html            o calendário
├─ aula.html             o visualizador de aula
├─ sw.js                 o que faz funcionar offline
├─ assets/
│  ├─ app.css / app.js   calendário: progresso, erros, gravação
│  ├─ aula.css/aula.js   aulas: visual, carregamento, gabaritos
│  ├─ md.js              renderizador Markdown (próprio, sem dependência)
│  └─ offline.js         botão de baixar tudo
├─ dados/
│  ├─ plano.json         as 12 semanas — o que estudar e quando
│  ├─ progresso.json     o que você já fez — versionado no git
│  └─ aulas.json         gerado: id do tópico -> caminho do arquivo
├─ aulas/
│  ├─ _MODELO.md         copie este
│  ├─ redes/ seguranca/ banco-de-dados/ ...
│  └─ redes/Modelo OSI - as sete camadas.md
├─ info/                 banca.md · transpetro.md · ajuda.md
├─ ferramentas/
│  ├─ servidor.py        serve os arquivos e grava o progresso
│  ├─ indexar.py         monta o dados/aulas.json
│  └─ assuntos.py        acha o assunto e as questões de prova
├─ iniciar.bat · parar.bat · publicar.bat
```

`plano.json` é o plano; `progresso.json` é a sua execução. Separados de
propósito: dá para reorganizar o plano sem perder o que já foi registrado.

---

## Publicar no GitHub

```bash
git init
git add -A
git commit -m "calendário de estudos TRANSPETRO 2026"
gh repo create transpetro-2026 --public --source=. --push
```

Depois, em **Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.
O endereço fica `https://SEU-USUARIO.github.io/transpetro-2026/`.

**Antes de tornar público, decida duas coisas:**

- O `.gitignore` já exclui os PDFs e os cadernos de questões. São material de
  terceiros e não devem ir para um repositório público.
- Suas anotações de erro ficam visíveis para quem tiver o endereço. Se isso
  incomodar, o repositório precisa ser privado — e o GitHub Pages em repositório
  privado exige conta Pro.

---

## Atalhos

| Tecla | No calendário | Na aula |
|---|---|---|
| `←` `→` | semana anterior / próxima | aula anterior / próxima |
| `Ctrl+S` | gravar | — |
| `Esc` | fechar o diálogo | — |

---

## Se algo quebrar

**"Modo leitura" no computador** — o servidor não está rodando. Feche a aba e
comece pelo `iniciar.bat`.

**"Não consegui ler os dados"** — você abriu o `index.html` com dois cliques.
Use o `iniciar.bat`.

**"Python nao encontrado"** — instale de [python.org](https://python.org) e
marque *Add Python to PATH* durante a instalação.

**Escrevi a aula e ela não apareceu** — falta o `id` no frontmatter, ou o índice
não foi regerado. Rode o `iniciar.bat` de novo, ou
`python ferramentas\indexar.py`.

**Gravei mas o celular não atualizou** — falta o `publicar.bat`. Gravar escreve
no disco; publicar manda para o GitHub. Se já publicou, toque em **⤓ Offline** no
celular para renovar a cópia.

**Perdi o progresso** — não perdeu. Cada alteração vai para o armazenamento do
navegador na hora, e a página recupera de lá se for mais recente que o arquivo.
Clique em **Gravar**.
