#EOSAI API REST

sudo npm install -g grunt
sudo npm install -g grunt-cli




Le API REST fanno uso delle seguenti librerie:
    - restify.js (http://restify.com/) per gli entry point REST
    - bookshelf.js (http://bookshelfjs.org/) come ORM per l'accesso a Postgresql

---------------------------------------------------
Specifiche API

Versioning delle API
    La versione delle API è inclusa nell'url della risorsa da richiamare.
    Fare riferimento a http://apigee.com/about/blog/technology/restful-api-design-tips-versioning

    http://<server>:<port>/api/version/.....
