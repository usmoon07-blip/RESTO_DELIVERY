@echo off
chcp 65001 >nul 2>nul
title RESTO - Tekshiruv
cd /d "%~dp0"
if not exist "package.json" goto NO_PROJECT
call npm run doctor
echo.
pause
exit /b

:NO_PROJECT
echo.
echo  XATOLIK: bu fayl notogri papkada turibdi.
echo  TEKSHIR.bat RESTO.bat bilan bitta papkada bolishi kerak.
echo.
pause
