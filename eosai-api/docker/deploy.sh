#! /bin/bash
docker build --no-cache -t planetek/cmems_api:$1 --build-arg branch=$1 .
