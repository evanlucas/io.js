#!/bin/bash

set -e

cd $(dirname $0)/../..

make test CORE_COVERAGE=1 || echo "Test suite failed with coverage."

echo "Generating coverage reports. This may take a bit."

istanbul report
