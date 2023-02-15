@echo off
C:
cd C:\Users\MIAT\.node-red
@REM echo here is %cd%, the node-red root dir
echo ============================================================

call npm uninstall "@eric-w/node-red-dinkle-modbus"
if %ERRORLEVEL% NEQ 0 goto errorblock
echo ^> uninstall module ... ok=====================================

call npm install D:\WORKSPACEs\NODEJS\node-red-dinkle-modbus
if %ERRORLEVEL% NEQ 0 goto errorblock
echo ^> reinstall module ... ok=====================================

exit 0

:errorblock
echo ERROR...
exit 1