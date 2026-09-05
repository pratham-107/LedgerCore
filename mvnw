#!/bin/sh
DIRNAME="$(dirname "$0")"
if [ -f "$DIRNAME/.maven/apache-maven-3.9.6/bin/mvn" ]; then
  exec "$DIRNAME/.maven/apache-maven-3.9.6/bin/mvn" "$@"
else
  exec mvn "$@"
fi
