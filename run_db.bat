@echo off
echo Starting MariaDB Database...
cd %~dp0mariadb\mariadb-10.11.7-winx64\bin
.\mysqld.exe --datadir=..\data --port=3307 --console
pause
