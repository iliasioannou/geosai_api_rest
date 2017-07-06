#! /bin/bash
docker build --no-cache -t planetek/cmems-api:$1 --build-arg branch=$1 .
