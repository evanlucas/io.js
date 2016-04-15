#!/bin/bash

set -e

cd $(dirname $0)/../..

if grep -q "lib-cov/internal/bootstrap_node.js" node.gyp; then
  echo "node.gyp already updated...skipping"
  exit 0
fi

sed -i ".orig" "s/'lib\//'lib-cov\//" node.gyp

echo "successfully updated node.gyp"
