sudo npm install -g grunt
sudo npm install -g grunt-cli
npm install
bower install


---------------------------------------------------
Autenticazione

- Autenticarsi (la durata del token è di due ore)

    ```curl -vu cmemsClient:INsb0skEFM -X POST -F "clientId=cmemsClient" -F "clientSecret=INsb0skEFM" -F "grant_type=password" -F "username=ispra" -F "password=ispra123" http://localhost:3000/api/v1.0.0/oauth/token```


- Log out

    ```
    curl -H "Authorization: Bearer 1nRW+8pgOTKuETzxqp5QrCppqwW7FQHHI8J4TXzOSpw=" http://localhost:3000/api/v1.0.0/oauth/logout
    ```

- Richieste autenticate

	```
    curl -H "Authorization: Bearer 1nRW+8pgOTKuETzxqp5QrCppqwW7FQHHI8J4TXzOSpw=" http://localhost:3000/api/v1.0.0/oauth/users
    ```


Le API REST fanno uso delle seguenti librerie:
    - restify.js (http://restify.com/) per gli entry point REST
    - bookshelf.js (http://bookshelfjs.org/) come ORM per l'accesso a Postgresql

---------------------------------------------------
Specifiche API

Versioning delle API
    La versione delle API è inclusa nell'url della risorsa da richiamare.
    Fare riferimento a http://apigee.com/about/blog/technology/restful-api-design-tips-versioning

    http://<server>:<port>/api/vx/.....


--------------------------------------------------
Implementazione protocollo https

E' necessario eseguire prima la creazione delle chiavi private e dei certificati da utilizzare nel protocollo https.
La private-key che generiamo è del tipo self-signed, ossia il certificato associato lo creiamo sempre noi.
Per far questo è necessario procedere u due step:
1) ci auto certifichiamo come CA (certification authority) generando il relativo certificato
2) usiamo il certificato di CA per certificare la private-key da usare lato server nel protocollo https

Procediamo.


1) Creazione del certificato per il ruolo di auto-CA (certification authority)
Serve a creare un chiave private ed un certificato che serviranno per la generazione di un certificato da usare lato server con la chiave privata

		a) creazione della chiave privata del CA:
	lanciare il seguente comando con il quale associamo alla private key generata la password specificata nella riga di comando

		openssl genrsa -des3 -passout pass:pke114  -out ssl/ca/privateKey-CA.key 2048

	b) generazione del certificato relativo alla private key del CA

		openssl req -new -key ssl/ca/privateKey-CA.key -x509 -days 3650 -out ssl/ca/certificate-CA.crt -passin pass:pke114 -subj "/C=IT/ST=Italy/L=Bari/O=Planetek Italia s.r.l./CN=Planetek Italia s.r.l - CA"

	da notare la presenza della password associata alla private-key generata in precedenza

	c) visualizziamo il certificato creato

		openssl x509 -in ssl/ca/certificate-CA.crt -text -noout

	che mostra:

		Certificate:
			Data:
				Version: 3 (0x2)
				Serial Number: 14114123553198781395 (0xc3df7097806333d3)
			Signature Algorithm: sha256WithRSAEncryption
				Issuer: C=IT, ST=Italy, L=Bari, O=Planetek Italia s.r.l., CN=Planetek Italia s.r.l - CA
				Validity
					Not Before: Feb 15 13:53:45 2016 GMT
					Not After : Feb 12 13:53:45 2026 GMT
				Subject: C=IT, ST=Italy, L=Bari, O=Planetek Italia s.r.l., CN=Planetek Italia s.r.l - CA
				Subject Public Key Info:
					Public Key Algorithm: rsaEncryption
						Public-Key: (2048 bit)
						Modulus:
							00:b0:d3:75:0c:02:57:2d:2f:da:9c:af:20:29:ff:
							5b:b4:63:eb:b4:48:26:3c:5a:1b:9d:79:bc:a5:33:
							18:6d:ce:60:20:ca:c9:50:31:d7:f7:87:65:da:13:
							f3:bd:8a:c7:2e:60:08:12:7e:9f:57:e8:ae:97:db:
							8c:d5:82:67:c1:8f:dd:ae:52:0d:2b:52:21:7d:0b:
							66:2f:da:d3:5d:94:67:ee:a8:33:eb:56:c1:9c:49:
							41:d8:a4:6c:56:b0:fb:6f:80:8b:92:f3:ab:8d:7c:
							27:32:9a:10:1c:9c:7d:76:21:00:be:47:0e:87:3e:
							6c:89:5a:19:aa:73:c2:8c:61:3e:31:b7:5d:02:2c:
							57:b4:96:91:0f:a7:62:84:09:93:5a:1a:47:7a:5b:
							70:0d:13:bf:c0:c4:ba:91:15:ac:7d:23:cb:78:6d:
							e9:8b:1d:53:4b:23:33:0e:52:23:11:d4:f9:3c:b0:
							bd:9a:60:60:be:df:f8:e2:d2:1a:f9:b5:a0:5d:43:
							44:02:76:7e:67:13:97:9a:da:c8:6c:5b:c2:fc:45:
							0e:2d:f1:bc:c8:1f:2d:7f:f5:16:1e:99:4f:e8:3a:
							12:53:1c:a7:b8:f9:f7:1b:57:b0:1f:96:da:d1:eb:
							02:c5:c6:c6:3c:89:34:54:d4:e7:85:4e:e3:d4:16:
							fd:e1
						Exponent: 65537 (0x10001)
				X509v3 extensions:
					X509v3 Subject Key Identifier:
						F2:8B:63:F3:E2:06:C3:07:58:86:85:30:7C:A7:C3:2C:C8:13:03:B5
					X509v3 Authority Key Identifier:
						keyid:F2:8B:63:F3:E2:06:C3:07:58:86:85:30:7C:A7:C3:2C:C8:13:03:B5

					X509v3 Basic Constraints:
						CA:TRUE
			Signature Algorithm: sha256WithRSAEncryption
				 13:c2:b5:7d:8b:d8:50:b4:bb:14:93:fe:93:ee:6e:8d:f2:9f:
				 6f:bc:ac:a0:99:e7:8f:0b:c7:76:b6:63:35:24:98:25:29:1c:
				 68:0b:25:ee:53:3e:90:1a:63:a2:7e:69:27:08:74:94:3d:b8:
				 b1:da:97:53:fc:5d:e1:79:9c:65:46:9f:14:37:d8:66:80:02:
				 3d:77:aa:41:3c:4a:6b:6f:46:77:40:25:c8:15:ff:a1:a6:89:
				 4d:5c:05:91:33:da:56:25:8a:a4:6d:b3:0b:c9:cd:a4:92:67:
				 4e:8c:0b:4a:05:a8:41:16:52:07:3c:d7:6a:61:83:3a:04:1a:
				 4f:62:87:26:9c:95:06:eb:9b:82:da:e9:5c:f4:f8:46:b1:c2:
				 c5:2f:1e:a0:1f:2d:d1:02:67:2e:e3:ad:29:d9:63:67:ae:ee:
				 b7:d0:84:87:0b:25:ff:be:a9:1a:5c:2b:0f:db:57:04:98:5f:
				 9b:3f:15:22:0f:9c:d5:c2:c2:64:5f:8f:8f:8a:05:15:ae:72:
				 3b:ff:43:af:57:28:52:1d:af:95:70:2f:5f:06:2e:33:21:87:
				 bc:f5:75:87:32:bb:58:8f:17:32:27:a8:75:80:ed:c8:fd:55:
				 ca:37:98:d4:6b:36:b5:f2:1b:30:be:54:bf:ce:0e:3b:a9:84:
				 3a:ca:59:b8



2) Creiamo il certificato della private-key da usare lato server nel protocollo https

	a) creiamo la private-key da utilizzare lato server

		openssl genrsa -out ssl/server/privateKey-Server.key 2048

		da notare l'assenza del parametro -des3 per non criptare la private-key con una password. In tal modo non sarà necessario fornire tale password ad ogni utilizzo della private-key, Ad esempio quando viene riavviato il server che la utilizza.


	b) creiamo la richiesta di certificato, per il dominio LOCALHOST, da fare alla CA creata in precedenza

		openssl req -new -key ssl/server/privateKey-Server.key -out ssl/server/certificateRequest-localhost.csr -subj "/C=IT/ST=Italy/L=Bari/O=Planetek Italia s.r.l./CN=localhost"

	c) ora come auto-CA prendiamo la richiesta di certificazione e generiamo il certificato in formato X.509 firmato con la chiave privata dell'auto-CA

		openssl x509 -req -in ssl/server/certificateRequest-localhost.csr -out ssl/server/certificate-localhost.crt -sha1 -CA ssl/ca/certificate-CA.crt -CAkey ssl/ca/privateKey-CA.key -CAcreateserial -days 2190 -passin pass:pke114


	facciamo la stessa cosa per i domini:
	- kim.planetek.it
	- metis.planetek.it

	per la richiesta di certificato:

		openssl req -new -key ssl/server/privateKey-Server.key -out ssl/server/certificateRequest-kim.planetek.it.csr -subj "/C=IT/ST=Italy/L=Bari/O=Planetek Italia s.r.l./CN=kim.planetek.it

		openssl req -new -key ssl/server/privateKey-Server.key -out ssl/server/certificateRequest-metis.planetek.it.csr -subj "/C=IT/ST=Italy/L=Bari/O=Planetek Italia s.r.l./CN=metis.planetek.it

	creazione del certificato a partire dalle richieste:

		openssl x509 -req -in ssl/server/certificateRequest-kim.planetek.it.csr -out ssl/server/certificate-kim.planetek.it.crt -sha1 -CA ssl/ca/certificate-CA.crt -CAkey ssl/ca/privateKey-CA.key -CAcreateserial -days 2190 -passin pass:pke114

		openssl x509 -req -in ssl/server/certificateRequest-metis.planetek.it.csr -out ssl/server/certificate-metis.planetek.it.crt -sha1 -CA ssl/ca/certificate-CA.crt -CAkey ssl/ca/privateKey-CA.key -CAcreateserial -days 2190 -passin pass:pke114
