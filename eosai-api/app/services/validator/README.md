# Validatore

Il codice del validatore qui presente è la copia di quello creato dal buil del progetto GIT **pkz019_SIC_Validator**

Effettuare il clone del progetto:
https://tfs.planetek.it/SBU-GS/pkz019_SIC_Monitoraggio_Marino_Costiero/_git/pkz019_SIC_Validator

spostarsi nella root e lanciare *grunt*

verrà creata la cartella dist.

Il cui contenuto va copiato in questa cartella.


Nel progetto delle API, che ingloba quello di validator, è necessario aggiungere le librerie:

npm install --save convert-excel-to-json
npm install --save json-schema-ref-parser
npm install --save z-schema
npm install --save fs