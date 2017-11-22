#! /bin/bash
docker build --no-cache -t dockerhub.planetek.it/pkh111_eosai_api:$1 --build-arg branch=$1 .
