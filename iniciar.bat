@echo off
title TRANSPETRO 2026
cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
  echo.
  echo  Python nao encontrado. Instale em https://python.org
  echo  e marque "Add Python to PATH" durante a instalacao.
  echo.
  pause
  exit /b 1
)

start "TRANSPETRO 2026 - servidor" /min python ferramentas\servidor.py
exit
