FROM planetek/node-bower-compass-grunt:4
LABEL maintainer.name="ilias ioannou" \
      maintainer.email="ioannou@planetek.gr"
	  
ARG branch

RUN git clone -b $branch https://teamEreticoTfs:hIEMK-i=d@tfs.planetek.it/SBU-GS/pkz029_UU_CMEMS/_git/pkz029_UU_CMEMS_Api_Rest
WORKDIR pkh111_EOSAI_Api_Rest/cmems-api
RUN npm install --no-bin-links && grunt apidoc && grunt prod
WORKDIR dist

EXPOSE 3000
CMD ["node", "server.js"]
