@echo off
chcp 65001 >nul 2>nul
title RESTO - Sozlamalar
cd /d "%~dp0"
if not exist "package.json" goto NO_PROJECT
node scripts/settings.js
echo.
pause
exit /b

:NO_PROJECT
echo.
echo  XATOLIK: bu fayl notogri papkada turibdi.
echo  SOZLAMALAR.bat RESTO.bat bilan bitta papkada bolishi kerak.
echo.
pause
