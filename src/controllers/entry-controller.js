import {
  listAllEntriesByUserId,
  findEntryById,
  addEntry,
  removeEntryById,
  updateEntryById
} from "../models/entry-model.js";

const getEntries = async (req, res) => {
  // haetaan kaikkien käyttäjien merkinnät
  //const result = await listAllEntries();
  // haetaan kirjautuneen (token) käyttäjän omat merkinnät
  const result = await listAllEntriesByUserId(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500);
    res.json(result);
  }
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

  const user_id = req.user.user_id;

  const result = await addEntry({user_id, ...req.body});

  if (result.entry_id) {
    res.status(201);
    res.json({message: 'New entry added.', ...result});
  } else {
    res.status(500);
    res.json(result);
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