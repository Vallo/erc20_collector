#!/bin/bash

set -e
echo "${dirname}"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}/lib/" )" && pwd )"

command="$1"
shift 1

if [ ! -f "$DIR/$command" ]; then
  echo "File '$command' not found"
  exit 1
fi

 echo "npx babel-node $DIR/$command" "$@"
#npx babel-node "$DIR/$command" "$@"
