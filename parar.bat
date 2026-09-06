@echo off
title Parar servidor
cd /d "%~dp0"
taskkill /fi "WINDOWTITLE eq TRANSPETRO 2026 - servidor*" /f >nul 2>&1
if errorlevel 1 (
  echo  Nenhum servidor rodando.
) else (
  echo  Servidor encerrado.
)
timeout /t 2 >nul
