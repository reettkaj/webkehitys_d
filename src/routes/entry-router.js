import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry
} from '../controllers/entry-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import { body, validationResult } from 'express-validator';

// Luodaan uusi Express-router diary entry -reiteille
const entryRouter = express.Router();

const validateEntry = [
  body('entry_date').notEmpty(),
  body('weight').optional().isNumeric(),
  body('sleep_hours').optional().isNumeric(),
  body('mood').optional().isString(),
  body('notes').optional().isString(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

/*
  GET    -> Hae kaikki päiväkirjamerkinnät
  POST   -> Lisää uusi merkintä (vaatii kirjautumisen / tokenin)
*/

entryRouter.route('/')
  .get(authenticateToken, getEntries) // Palauttaa kaikki merkinnät tietokannasta
  .post(
    authenticateToken,
    validateEntry,
    postEntry
  ); // Tarkistaa ensin JWT-tokenin, sitten lisää uuden merkinnän, käytetty ChatGPT:tä ymmärtämään

  /*
  Route: /api/entries/:id
  GET     -> Hae yksittäinen merkintä id:n perusteella
  PUT     -> Päivitä merkintä (vaatii kirjautumisen)
  DELETE  -> Poista merkintä (vaatii kirjautumisen)
*/

entryRouter.route('/:id')
  .get(getEntryById)
  .put(authenticateToken, putEntry)
  .delete(authenticateToken, deleteEntry);
  // Palauttaa yhden merkinnän id:n perusteella
  // Tarkistaa tokenin ja päivittää merkinnän
  // Tarkistaa tokenin ja poistaa merkinnän


export default entryRouter;