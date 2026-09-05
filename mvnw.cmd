@echo off
set DIRNAME=%~dp0
if exist "%DIRNAME%.maven\apache-maven-3.9.6\bin\mvn.cmd" (
  "%DIRNAME%.maven\apache-maven-3.9.6\bin\mvn.cmd" %*
) else (
  mvn %*
)
