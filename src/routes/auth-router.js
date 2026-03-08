import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByUsername } from '../models/user-model.js';

// Luodaan Express router kirjautumiselle
const authRouter = express.Router();

// POST /login endpoint käyttäjän kirjautumiseen
authRouter.post('/login', async (req, res) => {

  // Haetaan username ja password request bodysta
  const { username, password } = req.body;

  // Haetaan käyttäjä tietokannasta käyttäjänimen perusteella
  const user = await getUserByUsername(username);

  // Jos käyttäjää ei löydy → virhe
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Verrataan annettua salasanaa tietokannassa olevaan hashattuun salasanaan
  const passwordMatch = await bcrypt.compare(password, user.password);

  // Jos salasana ei täsmää → virhe
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Jos käyttäjä ja salasana ovat oikein → luodaan JWT token
  const token = jwt.sign(
    { user_id: user.user_id, username: user.username }, // payload
    process.env.JWT_SECRET, // salainen avain .env tiedostosta
    { expiresIn: '1h' } // token vanhenee 1 tunnissa
  );

  // Palautetaan token frontendille
  res.json({ token });
});

// Exportataan router käytettäväksi app.js / server.js tiedostossa
export default authRouter;

// Debug tulostus joka varmistaa että JWT_SECRET latautuu oikein
console.log("VERIFY SECRET:", process.env.JWT_SECRET);