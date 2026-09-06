---
titulo: Ajuda
---

## O ciclo de um dia de estudo

1. **`iniciar.bat`** — indexa as aulas, sobe o servidor e abre o navegador.
2. Abra a sessão do dia, siga os tópicos, abra as aulas.
3. Registre os **acertos** e escreva as **observações**.
4. Cada questão errada vira um **erro** no painel — assunto, causa e tipo de
   distrator. Isso alimenta a revisão da semana 12.
5. **↑ Publicar** — no topo da página.

> [!nota] Gravar e Publicar são coisas diferentes
> **Gravar** escreve no arquivo do seu computador (`dados/progresso.json`).
> É automático: qualquer alteração é gravada sozinha em menos de um segundo.
>
> **↑ Publicar** manda esse arquivo para o GitHub. **É só isto que faz o
> celular ver a versão nova** — em cerca de um minuto.
>
> Se você grava mas nunca publica, o computador fica em dia e o celular
> continua mostrando a última versão publicada.

## Quem pode alterar o quê

| Onde | Pode gravar? |
|---|---|
| Computador, com o `iniciar.bat` rodando | **Sim**, em qualquer navegador |
| Computador, sem o servidor, no Chrome ou Edge | Sim, pela File System Access API |
| Computador, sem o servidor, no Brave ou Firefox | Não — só leitura |
| Celular, pelo GitHub Pages | Não — só leitura, de propósito |

O celular é leitura por decisão de projeto: se você anotasse lá, o computador
sobrescreveria na próxima gravação e você perderia o registro.

> [!nota]
> Se aparecer *"Modo leitura"* no computador, o servidor não está rodando. Feche
> a aba e comece pelo `iniciar.bat`. O Brave bloqueia a gravação direta em
> arquivo, então **no Brave o servidor é obrigatório** — mas com ele funciona
> normalmente.

## Escrever uma aula

1. Copie `aulas/_MODELO.md` para a pasta da disciplina.
2. Dê um nome legível: `aulas/redes/Modelo OSI - as sete camadas.md`.
3. No frontmatter, ponha o **`id` do tópico** — é só isso que liga o arquivo ao
   calendário. Pasta e nome do arquivo são livres.

```yaml
---
id: R05
titulo: Topologias e meios físicos
---
```

A aula aparece na próxima vez que você rodar o `iniciar.bat`.

## As questões nas aulas

Toda questão diz de onde veio: **prova e ano**, ou **"Inédita"** quando foi
escrita com base no perfil da banca. As aulas trazem, sempre que existirem, as
questões de **2018 e 2023** relacionadas ao assunto, com o enunciado inteiro — e
a teoria da aula é suficiente para resolvê-las.

O gabarito **não fica à vista**: responda primeiro, clique em *Comentário* depois.
No PDF, os comentários saem de perto das questões e viram um **caderno de
gabaritos** no fim do documento.

## Ler offline no celular

Abra o site e toque em **⤓ Offline**. Ele baixa calendário e aulas; a partir daí
abre sem internet. Toque de novo depois de publicar aulas novas.

Adicione à tela de início e ele abre como aplicativo.

## Salvar em PDF

Dentro de qualquer aula, botão **⎙ PDF** → *Salvar como PDF*.

## Atalhos

| Tecla | No calendário | Na aula |
|---|---|---|
| `←` `→` | semana anterior / próxima | aula anterior / próxima |
| `Ctrl+S` | gravar | — |
| `Esc` | fechar o diálogo | — |

## Se algo der errado

**"Não consegui ler os dados"** — você abriu o `index.html` com dois cliques.
Navegador nenhum lê arquivos assim, por segurança. Use o `iniciar.bat`.

**Escrevi a aula e ela não apareceu** — falta o `id` no frontmatter, ou o índice
não foi regerado. Rode o `iniciar.bat` de novo.

**Gravei mas o celular não atualizou** — falta o `publicar.bat`. Gravar escreve no
disco; publicar manda para o GitHub.

**Perdi o progresso** — não perdeu. Cada alteração vai para o armazenamento do
navegador na hora, e a página recupera de lá se for mais recente que o arquivo.
Clique em **Gravar**.
