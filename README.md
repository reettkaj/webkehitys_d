# Terveyspäiväkirja


## Kuvakaappaukset
<img width="1919" height="935" alt="Screenshot 2026-03-09 020856" src="https://github.com/user-attachments/assets/dd8e0bd4-0889-4ce5-936e-d18402fc86cd" />
<img width="1916" height="960" alt="Screenshot 2026-03-09 020913" src="https://github.com/user-attachments/assets/a6ff88b4-4b5f-4be1-8ccc-fa314e5b79d3" />
<img width="1906" height="963" alt="Screenshot 2026-03-09 020936" src="https://github.com/user-attachments/assets/4c8408f4-350f-4ff8-bee2-7eae332e658b" />
<img width="1871" height="855" alt="Screenshot 2026-03-09 020947" src="https://github.com/user-attachments/assets/8b35c4e9-1d2f-44f4-8e46-c9053cea1a71" />
<img width="1873" height="913" alt="Screenshot 2026-03-09 021015" src="https://github.com/user-attachments/assets/429b2f63-51b5-4bd5-92d8-b694fc1e6e31" />
<img width="1867" height="882" alt="Screenshot 2026-03-09 021045" src="https://github.com/user-attachments/assets/8c80d87f-a322-471f-9ff4-1a8d428bf179" />
<img width="1888" height="968" alt="Screenshot 2026-03-09 021125" src="https://github.com/user-attachments/assets/a2c01fdd-ccac-400b-9401-4831c1a850ea" />



## Tietokannan rakenne:

HealthDiary-tietokanta on toteutettu MariaDB-tietokantajärjestelmällä ja se tallentaa käyttäjien terveyteen ja hyvinvointiin liittyviä tietoja. Tietokanta koostuu kuudesta taulusta: users, diaryentries, exercises, meals, medications ja symptoms.
Users-taulu sisältää käyttäjien perustiedot, kuten käyttäjänimen, sähköpostin, salasanan, luontiajan ja käyttäjätason. Jokaisella käyttäjällä on yksilöllinen user_id, jota käytetään viiteavaimena muissa tauluissa.
Diaryentries-taulu tallentaa päivittäisiä hyvinvointitietoja, kuten mielialan, painon, unen määrän, energiatasot, veden juonnin ja stressitason.
Exercises-taulu sisältää liikuntasuorituksia, kuten liikunnan tyypin, keston, intensiteetin ja päivämäärän.
Meals-taulu tallentaa ateriatiedot, kuten aterian tyypin, kalorimäärän, kuvauksen ja päivämäärän.
Medications-taulu sisältää lääkityksiin liittyvät tiedot, kuten lääkkeen nimen, annostuksen ja käyttöajan.
Symptoms-taulu tallentaa käyttäjän kokemia oireita, niiden voimakkuuden (1–5), päivämäärän ja mahdolliset lisähuomiot.
Kaikki hyvinvointiin liittyvät taulut on yhdistetty users-tauluun user_id-viiteavaimen avulla, jolloin yhdellä käyttäjällä voi olla useita merkintöjä eri tauluissa.

## Listaus ja kuvaus kaikista toiminnallisuuksista, mitä olet toteuttanut:
- Login ja logout toiminnallisuus: vieraskäyttäjä voi rekisteröityä tai login sivustolle, ja kirjautunut käyttäjä voi kirjautua ulos logoutilla.
  Vieraskäyttäjä ei voi nähdä päiväkirjaa tai merkintöjä, vaan se vaatii kirjautumisen.
- Päiväkirjassa Merkinnät menevät tietokantaan, ja ne myös haetaan sieltä. Kaikki muut menevät tauluun diaryentries, ja exercises menee exercises tauluun, medications -medications tauluun, symptoms -symptoms tauluun, ja exercises -exercises tauluun.
- Frontendin toiminnallisuusperustuu responsiivisuuteen ja sivusto on interaktiivinen
- Sivusto tervehtii yläkulmassa kirjautunutta käyttäjää kirjautuneella käyttäjätunnuksella
- Päiväkirja -sivusto ohjaa automaattisesti login näyttöön

## Tiedossa olevat bugit/ongelmat:
- Päiväkirjamerkintää avatessa se ei enää ole keskellä näyttöä, vaan siirtyy yläkulmaan? Tuore ongelma, mutta helppo korjata, en vaan jaksa väsyneenä enää pikkukorjauksia
- Etusivulla kuva (ei hero) ei lataudu oikein ja se on nyt suurempi kuin mitä pitäisi, teksti menee liian lähelle sitä
- Värit ovat tekstissä "Taistele HYVINVOINTISI puolesta" liian sivulla ja ylhäällä, ja tekstiä on vaikea lukea koska se blendautuu vaaleaan taustaan; helppo korjata mutta en jaksa pieniä korjauksia nyt väsyneenä enää
- CSS ei ole nyt ihan se mitä alunperin olin tehnyt, joten vähän epäsiisti; helppo taas korjata mutta -||-

## Referenssit, tutoriaalit, grafiikkakirjastot:
  Tutoriaaleina käytin Ullan videoita, sekä katsoin youtubesta videoita joissain hankalemmissa debuggauskohdissa, en enää muista mitä katsoin ja kenen kanavalta, mutta debuggasin paljon
  ChatGPT:n avulla youtube videoiden tukena, jonka avulla sain tehokkaasti hoidettua ne. Käytetty opettajien materiaaleja avuksi ja pohjaksi omiin koodeihin: https://github.com/mattpe/hyte-web-dev/blob/main/README.md ja https://github.com/UllaSe/wsk-hyte-fe-material-k26/blob/main/README.md. 

## Tekoälyn käyttö:
Osaan koodista ollaan hyödynntetty ChatGPT GPT-5-mallia auttamaan koodin rakenteessa, selityksessä, muokkauksessa ja hahmottamaam koodia. Tätä mallia ollaan myös hyödynnetty debuggaamiseen, ja koodiongelmien korjauksiin.


---------------------------------------------------------------------TESTAUS-------------------------------------------------------------------------------

## Tehtävä 1:
Latasin koneelleni seuraavat työkalut seuraamalla ohjeita 0.1_asennukset.md tiedostosta:
- Robot Framework
- Browser Library
- Requests library
- CryptoLibrary
- Robotidy
  Ensin etsin oikeat komennot niiden lataamiseen, ja pistin komennot VScoden terminaaliin. Lataaminen oli helppoa, ja tässä on komennot jota käytin:
  pip install robotframework
  pip install robotframework-browser
  pip install robotframework-requests
  pip install --upgrade robotframework-crypto
  pip install robotframework-tidy

  Tein myös Github io -sivuston.


## Tehtävä 2:
Ajettu kirjautumistesti onnistuneesti; tehtävä tehtiin seuraamalla yksilötehtävien ohjeita. Oli helppo myös itse testata ennenkuin luki ohjeita eteenpäin.

<img width="1878" height="955" alt="image" src="https://github.com/user-attachments/assets/6aba4e6f-ce92-4497-be56-e3955dd3598c" />


## Tehtävä 3:
Tutkittu browser library ja tehty testaukset, seurattu ohjeita yksilötehtävien ohjeiden mukaan. Tietojen salaus ja salausavainten generointi tehty ohjeiden mukaisesti. Tehtävien tekeminen tuntui selkeältä ja ymmärrettävältä.

## Tehtävä 4:
Tässä tehtävässä tein Robot Framework -testin, joka simuloi käyttäjän toimintaa sovelluksessa. Testi avaa kirjautumissivun, kirjautuu sisään, siirtyy päiväkirjasivulle ja täyttää lomakkeen. Lopuksi testi lisää uuden päiväkirjamerkinnän ja tarkistaa, että se onnistui.

Testissä käytettiin BrowserLibrarya selaimen ohjaamiseen.

## Tehtävä 5: 
Tässä tehtävässä siirsin käyttäjätunnuksen ja salasanan pois testikoodista .env-tiedostoon. Näin tunnukset eivät näy suoraan koodissa. Tein Python-tiedoston (env_helper.py), joka lukee arvot .env-tiedostosta. Robot Framework -testi käyttää näitä arvoja kirjautumiseen. Tämä parantaa tietoturvaa ja helpottaa tunnusten hallintaa.

## Tehtävä 6:
Tässä tehtävässä käytin CryptoLibrarya tunnusten salaamiseen. Käyttäjätunnus ja salasana kryptattiin CryptoClient-työkalulla ja lisättiin testiin muodossa crypt:... Testin aikana CryptoLibrary purkaa arvot automaattisesti ja käyttää niitä kirjautumiseen. Tällä tavalla tunnukset eivät ole selkokielisinä testikoodissa.
