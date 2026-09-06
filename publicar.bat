@echo off
title Publicar progresso
cd /d "%~dp0"
echo.
echo  Indexando aulas...
python ferramentas\indexar.py
echo.
git add -A
git commit -m "estudo: progresso de %date%"
git push
echo.
echo  Pronto. Em ~1 minuto o celular ja mostra a versao nova.
pause
