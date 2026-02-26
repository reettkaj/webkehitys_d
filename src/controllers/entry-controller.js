import {listAllEntries, findEntryById, addEntry} from "../models/entry-model.js";

const getEntries = async (req, res) => {
  const entries = await listAllEntriesByUserId(req.user.user_id);
  res.json(entries);
};

const getEntryById = async (req, res) => {
  // Haetaan merkintä URL-parametrin id:n perusteella
  const entry = await findEntryById(req.params.id);

  if (entry) {
    // Jos merkintä löytyy, palautetaan se JSONina
    res.json(entry);
  } else {
    // Jos ei löydy, palautetaan 404 Not Found
    res.sendStatus(404);
  }
};

const postEntry = async (req, res) => {
  // Puretaan pyynnön body:sta tarvittavat kentät
  const {entry_date, mood, weight, sleep_hours, notes} = req.body;

  // user_id lisätään req-objektiin authenticateToken-middlewaresta
  const user_id = req.user.user_id;

  // Tarkistetaan että pakolliset tiedot löytyvät
  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {

    // Lisätään uusi merkintä tietokantaan
    const result = await addEntry({user_id, ...req.body});

    // Jos lisäys onnistui ja saatiin entry_id takaisin
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      // Jos tietokantavirhe
      res.status(500);
      res.json(result);
    }
  } else {
    // Jos validointi epäonnistuu, palautetaan 400 Bad Request
    res.sendStatus(400);
  }
};

const putEntry = async (req, res) => {
  const entryId = req.params.id;
  const userId = req.user.user_id;

  const affectedRows = await updateEntryById(entryId, userId, req.body);

  if (affectedRows > 0) {
    res.json({ message: 'entry updated' });
  } else {
    res.status(404).json({ message: 'entry not found or not authorized' });
  }
};

const deleteEntry = async (req, res) => {
  const affectedRows = await removeEntryById(req.params.id, req.user.user_id);
  if (affectedRows > 0) {
    res.json({message: 'entry deleted'});
  } else {
    res.status(404).json({message: 'entry not found'});
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};

// ChatGPT:tä hyödynnettiin:
// - Async controller -rakenteessa
// - Virheenkäsittelyn toteutuksessa
// - Pyyntöjen validoinnissa
// - Autentikoidun käyttäjän (req.user.user_id) yhdistämisessä tietokantaan