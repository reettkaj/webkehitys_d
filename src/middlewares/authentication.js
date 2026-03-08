import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Middleware joka tarkistaa onko käyttäjän JWT token validi
const authenticateToken = (req, res, next) => {

  // haetaan Authorization header requestista
  const authHeader = req.headers.authorization;

  // jos Authorization header puuttuu -> käyttäjä ei ole kirjautunut
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  // Authorization header on muodossa: "Bearer TOKEN"
  // split erottaa sanan Bearer ja itse tokenin
  const token = authHeader.split(' ')[1];

  // tarkistetaan token JWT_SECRET avaimella
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    // jos token ei ole validi tai se on vanhentunut
    if (err) {
      console.log('token verification failed', err);
      return res.sendStatus(403); // Forbidden
    }

    // jos token on validi -> käyttäjän tiedot tallennetaan requestiin
    // tätä voidaan käyttää myöhemmin controllerissa
    req.user = user;

    // siirrytään seuraavaan middlewareen tai route handleriin
    next();
  });
};

// exportataan middleware jotta sitä voidaan käyttää routeissa
export { authenticateToken };

// debug tulostus joka näyttää JWT salaisen avaimen
// auttaa varmistamaan että .env tiedosto latautuu oikein
console.log("VERIFY SECRET:", process.env.JWT_SECRET);