FROM planetek/node-bower-compass-grunt:4
LABEL maintainer.name="ilias ioannou" \
      maintainer.email="ioannou@planetek.gr"
	  
ARG branch

RUN git clone -b $branch https://tfs.planetek.it/Planetek%20Hellas/pkh111_EOSAI/_git/pkh111_EOSAI_Api_Rest
WORKDIR pkh111_EOSAI_Api_Rest/eosai-api
RUN npm install --no-bin-links && grunt apidoc && grunt prod
WORKDIR dist

EXPOSE 3000
CMD ["node", "server.js"]
