#! /bin/bash
docker build --no-cache -t planetek/eosai_api:$1 --build-arg branch=$1 .
