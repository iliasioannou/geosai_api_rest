FROM planetek/node-bower-compass-grunt:4
MAINTAINER Maurizio Cosmai <cosmai@planetek.it>
ARG branch

RUN git clone -b $branch https://teamEreticoTfs:hI#EMK-i=d@tfs.planetek.it/SBU-GS/pkz029_UU_CMEMS/_git/pkz029_UU_CMEMS_Api_Rest
WORKDIR pkz029_UU_CMEMS_Api_Rest/cmems-api
RUN npm install --no-bin-links && grunt apidoc && grunt prod
WORKDIR dist

EXPOSE 3000
CMD ["node", "server.js"]
