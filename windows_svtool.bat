@echo off

set "TERSER_CMD=null /*terser-missing*/"
where terser >nul 2>nul
if %ERRORLEVEL% equ 0 set "TERSER_CMD='terser.cmd'"

set "ESCHECK_CMD=null /*es-check-missing*/"
where es-check >nul 2>nul
if %ERRORLEVEL% equ 0 set "ESCHECK_CMD='es-check.cmd'"

php -r "$f='app/svision/tools/svtool'; $c=file_get_contents($f); $c=str_replace('/^[ \t]*export[ \t]+default[ \t]+[^\n;]+;[ \t]*$/m', '/^[ \t]*export[ \t]+default[ \t]+[^\n;]+;[ \r\t]*$/m', $c); $c=str_replace(\"nodeBin('terser')\", \"%TERSER_CMD%\", $c); $c=str_replace(\"nodeBin('es-check')\", \"%ESCHECK_CMD%\", $c); file_put_contents($f, $c);"

php app\svision\tools\svtool %*

php -r "$f='app/svision/tools/svtool'; $c=file_get_contents($f); $c=str_replace('/^[ \t]*export[ \t]+default[ \t]+[^\n;]+;[ \r\t]*$/m', '/^[ \t]*export[ \t]+default[ \t]+[^\n;]+;[ \t]*$/m', $c); $c=str_replace(\"%TERSER_CMD%\", \"nodeBin('terser')\", $c); $c=str_replace(\"%ESCHECK_CMD%\", \"nodeBin('es-check')\", $c); file_put_contents($f, $c);"