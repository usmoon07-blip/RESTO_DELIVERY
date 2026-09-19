@echo off
chcp 65001 >nul 2>nul
title RESTO - Admin Panel
echo.
echo  Admin Panel brauzerda ochilmoqda...
echo.
echo    Manzil:  http://localhost:5174
echo    Parol:   .env faylidagi ADMIN_PASSWORD
echo.
echo  Agar sahifa ochilmasa - avval RESTO.bat ni ishga tushiring.
echo.
start "" "http://localhost:5174"
timeout /t 5 >nul
