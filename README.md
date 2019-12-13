# Web Projekti 2019 syksy - Sosiaalinen media urheilullisille ihmisille V.1.0

**Sisällys**
1. Johdanto
2. Määritelmät
3. Käyttöohje ja komennot
4. Rest api rajapinta
5. JSON-objektien skeemat
6. Kuvankaappaukset (projektista)
7. Jatkokehitysideat

____________

**1. Johdanto**

Projektityön tarkoituksena on luoda sosiaalinen alusta liikunnasta ja hyvinvoinnista kiinnostuneille ihmisille. Sen avulla eri tasoiset urheilijat voivat verkostoitua. Urheilusuoritusta kuvaillaan postauksen muodossa. Postaus on yksinkertaisimmillaan otsikko ja urheilusuorituksesta kuvaileva teksti.~~Jatkokehitysideana, käyttäjä voi kuvailla kuntosalitreenin yksityiskohtaisemmin valitsemalla mitä liikkeitä suoritti, millä painoilla sekä toistojen ja sarjojen lukumäärät.~~

Etusivulla vierailija voi luoda uuden tunnuksen, sekä selata etusivun pääsyötetteitä. Pääsyöte (feedi) on kooste kaikkien käyttäjien tekemistä postauksista uutuusjärjestyksessä. ~~Laajennuksena postauksia voisi ryhmitellä eri urheilulajeihin.~~

Profiilissa käyttäjä voi kertoa itsestään, mitä lajeja harrastaa, millä tasolla ja miten usein. Siellä sijaitsee myös listaus käyttäjän tekemistä postauksista. ~~Käyttäjien välinen interaktio, kuten muiden henkilöiden seuraaminen, ystävälista ja viestien lähettäminen muille käyttäjille ovat jatkokehitysideoita.~~
__________________

**2. Määritelmät**

* Versiot projektista:
  - Frontend versio: Reactin ja tyylien testailua varten tarkoitettu versio. Sisältää pienen paikallisen 'serverin'.
  - Backend versio: Rest apin ja mongon testailua varten koottu versio. Tähän versioon kootaan myös frontendista tuotantoversio versio.
  - Lopullinen versio: Backendista tuotantoversio versio, joka on imuroitu herokun palvelimelle.
* *Base URL:* Kaikille rest api jäsenille yhteinen osa URL:lää
  - Frontend testiversiossa: http://localhost:3000/
  - Backend testiversiossa: http://localhost:3003/
  - Lopullisessa versiossa: https://stayfit-app.herokuapp.com

____________________

**3. Käyttöohje ja komennot**\
Komennot on kutsuttava projektin juuresta

* Komennot Frontend versiossa:
  - `npm start`: Käynnistää projektin http://localhost:3000/ .
  - `npm run build`: Luo kansion build, johon on koottu frontend projektista tuotantoversio.
  - `npm run server`: Käynnistää frontendin testiserverin osoitteeseen http://localhost:3001/ . Serverin sisältö on projektin juuressa `./db.json` tiedostossa.
  - `npm run test`: Ajaa frontendin testit
  - `npm run eject`: "encapsulates all of the npm modules it is using internally, so that your package.json will be very clean and simple without you having to worry about it."
* Komennot backend versiossa:
  - `npm start`: Käynnistää projektin porttiin `3003`.
  - `npm run watch`: Käynnistäessä projekti tällä komennolla, ei tarvitse backend muutosten yhteydessä sulkea ja avata portti. Muutokset päivittyvät automaattisesti, toisin kuin `npm start` komennossa.
  - `npm run test`: Yhdistää backend projektin testitietokantaan ja ajaa sille määritellyt jest yksikkötestit.
  - `npm run lint`: Ajaa testin joka tarkistaa projektin oikein kirjoituksen.
  - `npm run build:ui`: Poistaa nykyisen build hakemiston ja rakentaa uuden frontend versiosta. *Huom! Polut pitää määritellä aina uudelleen, jos frontendin tai backendin hakemistosijainti on muuttunut.*
  - `npm run deploy:full`: Ajaa `npm run build:ui` skriptin sekä imuroi sovelluksen git-hakemistoon ja herokuun.
  - `npm run logs:prod`: Näyttää herokun konsolin. Käytännöllinen, kun sovellus kaatuilee herokussa.

**4. Rest api rajapinta**\
Taulukon osoitteet esitetään muodossa */api/posts/:id*. Esimerkiksi osoite https://stayfit-app.herokuapp.com/api/posts/5dea9ce77f2ea513d8c02d48 vastaa kuvausta.
- *Base url*: https://stayfit-app.herokuapp.com (ei kirjoiteta taulukkoon).
- Staattinen osa URL:lää: */api/posts* (kirjoitetaan aina samalla tavalla, eivät muutu).
- Dynaaminen osa URL:lää: */:id* (voi olla mikä tahansa kirjainmerkki yhdistelmä). URL esimerkissä 
```id = 5dea9ce77f2ea513d8c02d48.```\

**Käyttäjä (user)**\
*base URL*: https://stayfit-app.herokuapp.com tai http://localhost3003

|Metodi |URL |Kuvaus |
|-------|-------|-------|
|GET|/api/users|Hakee kaikki käyttäjät tietokannasta|
|POST|/api/users|Luo uuden käyttäjän.|
|PUT|/api/users/:id|Etsi käyttäjän id:n avulla ja päivittää löydetyn käyttäjän tietokantaan|

**Päivitykset (posts)**\
*base URL*: https://stayfit-app.herokuapp.com tai http://localhost3003

|Metodi |URL |Kuvaus |
|-------|-------|-------|
|GET|/api/posts|Hakee kaikki postaukset tietokannasta|
|GET|/api/posts/:id|Hakee yksittäisen päivityksentietokannasta|
|POST|/api/posts|Luo uuden päivityksen. Pyynnön yhteydessä pitää lähettää token, jonka on saanut sisäänkirjautumisen yhteydessä.|
|PUT|/api/posts/:id|Päivittää päivityksen. *Ominaisuutta ei käytetä tässä projektin versiossa.*|
|DELETE|/api/posts/:id|Poistaa päivityksen, jos päivitys on kirjautuneen käyttäjän päivitys. *Ominaisuutta ei käytetä tässä projektin versiossa.*|

**Autentikaatio (login)**\
*base URL*: https://stayfit-app.herokuapp.com tai http://localhost3003

|Metodi |URL |Kuvaus |
|-------|-------|-------|
|POST|/api/login|Lähetettää sisäänkirjautumisen tiedot. Validoi tiedot. palauttaa vastauksena joko sisäänkirjautuneen henkilön tiedot, tai virheilmoituksen.|

**Muut (others)**\
*base URL*: https://stayfit-app.herokuapp.com tai http://localhost3003 \
Routet palauttava index.html tiedoston.

|Metodi |URL |Kuvaus |
|-------|-------|-------|
|GET|/|Renderöi etusivun.|
|GET|/about|Renderöi about sivun.|
|GET|/signin|Renderöi kirjautumislomakkeen|
|GET|/signup|Renderöi käyttäjänluomislomakkeen|
|GET|/users|Renderöi käyttäjien hakukentän|
|GET|/users/u/:id|Renderöi yksittäisen käyttäjän julkinen profiili|
|GET|/users/profile|Renderöi kirjautuneen käyttäjän profiili sivu|
|GET|/users/profile/edit|Renderöi profiilin muokkauslomakkeen|
|GET|/posts|Renderöi viimeisimmät tilapäivitykset.|
|GET|/posts/p/:id|Renderöi yksittäinen tilapäivitys|
|GET|/posts/new|Renderöi uuden päivityksen lomake|

[Esimerkkejä pyyntöjen rungoista](https://github.com/wesenbergg/webs2019-backend-project/tree/master/requests)\
[Esimerkki GET api/users vastauksesta](https://stayfit-app.herokuapp.com/api/users)\
[Esimerkki GET api/posts vastauksesta](https://stayfit-app.herokuapp.com/api/posts)\
[Esimerkki GET api/posts/:id vastauksesta](https://stayfit-app.herokuapp.com/api/posts/5dea9ce77f2ea513d8c02d48)
____________

**5. JSON-objektien skeemat**
Postaus (post)\
![Post schema](https://i.imgur.com/qrPDJvA.png)\
*Tilapäivityksen skeema (kuva 1).*\
Käyttäjä (user)\
![UserScema](https://i.imgur.com/8dHFUTF.png)\
*Käyttäjän skeema (kuva 2).*
_______
**6. Kuvankaappaukset (projektista)**\
Kuvankaappauksia projektista
![Front page](https://i.imgur.com/Tvd1uoB.jpg)
*Etusivu (kuva 3).*
![Posts](https://i.imgur.com/8gjsVAm.png)
*Sivu tilapäivityksille (kuva 4).*
![users](https://i.imgur.com/CifeErD.png)
*Käyttäjien hakusivu (kuva 5).*
_____
**7. Jatkokehitysideat**
- Käyttäjien välinen interaktio, kuten muiden henkilöiden seuraaminen, ystävälista ja viestien lähettäminen muille käyttäjille ovat jatkokehitysideoita.
- Laajennuksena postauksia voisi ryhmitellä eri urheilulajeihin
- käyttäjä voi kuvailla kuntosalitreenin yksityiskohtaisemmin valitsemalla mitä liikkeitä suoritti, millä painoilla sekä toistojen ja sarjojen lukumäärät.
_____