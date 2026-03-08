import {
  listFullDiaryByUser,
  findEntryById,
  addEntry,
  removeEntryById,
  updateEntryById,
  addExercise,
  addMeal,
  addSymptom,
  addMedication
} from "../models/entry-model.js";

// Hakee kirjautuneen käyttäjän kaikki päiväkirjamerkinnät
const getEntries = async (req, res) => {
  // haetaan kaikkien käyttäjien merkinnät
  //const result = await listAllEntries();

  // haetaan kirjautuneen (token) käyttäjän omat merkinnät
  // req.user tulee autentikointimiddlewaresta (tokenista)
  const result = await listFullDiaryByUser(req.user.user_id);

  // jos kysely onnistui, palautetaan tulos JSONina
  if (!result.error) {
    res.json(result);
  } else {
    // jos tapahtui virhe, palautetaan status 500 (server error)
    res.status(500);
    res.json(result);
  }
};

// Hakee yksittäisen päiväkirjamerkinnän ID:n perusteella
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

// Luo uuden päiväkirjamerkinnän
const postEntry = async (req, res) => {
  try {

    // haetaan kirjautuneen käyttäjän id tokenista
    const user_id = req.user.user_id;

    // puretaan lomakkeelta tullut data req.body:stä
    const {
      entry_date,
      mood,
      weight,
      sleep_hours,
      energy_level,
      water_liters,
      stress_level,
      exercise,
      meal,
      symptom,
      medication,
      notes
    } = req.body;

    // lisätään uusi entry päätauluun
    const result = await addEntry({
      user_id,
      entry_date,
      mood,
      weight,
      sleep_hours,
      energy_level,
      water_liters,
      stress_level,
      notes
    });

    // otetaan lisätyn merkinnän ID jatkokäsittelyä varten
    const entryId = result.entry_id;

    // jos käyttäjä lisäsi liikuntatiedon
    if (exercise) {
      await addExercise({
        entry_id: entryId,
        user_id,
        type: exercise,
        duration: 30,
        intensity: "medium",
        date: entry_date
      });
    }

    // jos käyttäjä lisäsi ateriatiedon
    if (meal) {
      await addMeal({
        entry_id: entryId,
        user_id,
        meal_date: entry_date,
        meal_type: "general",
        calories: 0,
        description: meal
      });
    }

    // jos käyttäjä lisäsi oireen
    if (symptom) {
      await addSymptom({
        entry_id: entryId,
        user_id,
        symptom_date: entry_date,
        symptom_name: symptom,
        severity: 1,
        notes: ""
      });
    }

    // jos käyttäjä lisäsi lääkityksen
    if (medication) {
      await addMedication({
        entry_id: entryId,
        user_id,
        name: medication,
        dosage: "unknown",
        frequency: "once",
        medication_date: entry_date
      });
    }

    // jos kaikki onnistui, palautetaan 201 Created
    res.status(201).json(result);

  } catch (error) {
    // virheenkäsittely jos tietokantaoperaatio epäonnistuu
    console.error("Error creating entry:", error);
    res.status(500).json({ error: "Failed to create entry" });
  }

};

// Päivittää olemassa olevan merkinnän
const putEntry = async (req, res) => {

  // otetaan merkinnän id URL-parametrista
  const entryId = req.params.id;

  // otetaan käyttäjän id tokenista
  const userId = req.user.user_id;

  // päivitetään merkintä tietokantaan
  const affectedRows = await updateEntryById(entryId, userId, req.body);

  if (affectedRows > 0) {
    // jos päivitys onnistui
    res.json({ message: 'entry updated' });
  } else {
    // jos merkintää ei löytynyt tai käyttäjällä ei ole oikeuksia
    res.status(404).json({ message: 'entry not found or not authorized' });
  }

};

// Poistaa merkinnän
const deleteEntry = async (req, res) => {

  // poistetaan merkintä id:n ja käyttäjän id:n perusteella
  const affectedRows = await removeEntryById(req.params.id, req.user.user_id);

  if (affectedRows > 0) {
    // jos poistaminen onnistui
    res.json({message: 'entry deleted'});
  } else {
    // jos merkintää ei löytynyt
    res.status(404).json({message: 'entry not found'});
  }
};

// viedään controller-funktiot käyttöön routerissa
export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};

// ChatGPT:tä hyödynnettiin:
// - Async controller -rakenteessa
// - Virheenkäsittelyn toteutuksessa
// - Pyyntöjen validoinnissa
// - Autentikoidun käyttäjän (req.user.user_id) yhdistämisessä tietokantaan