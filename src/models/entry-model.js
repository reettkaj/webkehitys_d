// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?

// Tuodaan tietokantayhteys (MySQL connection pool)
import promisePool from '../utils/database.js';


// =============================
// Päiväkirjamerkintöjen haku
// =============================

// Hakee kaikki päiväkirjamerkinnät tietokannasta
const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');

    // sama sijoituslause perinteisemmin:
    //const result = await promisePool.query('SELECT * FROM DiaryEntries');
    //console.log('sql query result', result);
    //const rows = result[0];

    //console.log('rows', rows);

    // palautetaan kaikki rivit
    return rows;

  } catch (e) {

    // jos tietokantakysely epäonnistuu
    console.error('error', e.message);

    // palautetaan virhe controllerille
    return {error: e.message};
  }
};


// =============================
// Exercise taulu
// =============================

// Lisää uuden harjoituksen Exercises-tauluun
export const addExercise = async (exercise) => {

  // puretaan exercise-objektin kentät
  const { entry_id, user_id, type, duration, intensity, date } = exercise;

  // SQL-lause uuden harjoituksen lisäämiseksi
  const sql = `
  INSERT INTO Exercises (entry_id, user_id, type, duration, intensity, date)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  // suoritetaan prepared statement
  const [result] = await promisePool.execute(sql, [
    entry_id,
    user_id,
    type,
    duration,
    intensity,
    date
  ]);

  // palautetaan lisätyn rivin ID
  return result.insertId;
};


// =============================
// Symptoms taulu
// =============================

// Lisää oireen Symptoms-tauluun
export const addSymptom = async (symptom) => {

  const { entry_id, user_id, symptom_date, symptom_name, severity, notes } = symptom;

  const sql = `
  INSERT INTO Symptoms (entry_id, user_id, symptom_date, symptom_name, severity, notes)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    entry_id,
    user_id,
    symptom_date,
    symptom_name,
    severity,
    notes
  ]);

  return result.insertId;
};


// =============================
// Meals taulu
// =============================

// Lisää aterian Meals-tauluun
export const addMeal = async (meal) => {

  const { entry_id, user_id, meal_date, meal_type, calories, description } = meal;

  const sql = `
  INSERT INTO Meals (entry_id, user_id, meal_date, meal_type, calories, description)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    entry_id,
    user_id,
    meal_date,
    meal_type,
    calories,
    description
  ]);

  return result.insertId;
};


// =============================
// Medications taulu
// =============================

// Lisää lääkityksen Medications-tauluun
export const addMedication = async (med) => {

  const { entry_id, user_id, name, dosage, frequency, medication_date } = med;

  const sql = `
  INSERT INTO Medications (entry_id, user_id, name, dosage, frequency, medication_date)
  VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    entry_id,
    user_id,
    name,
    dosage,
    frequency,
    medication_date
  ]);

  return result.insertId;
};


// =============================
// Entryjen haku käyttäjän perusteella
// =============================

// Hakee kaikki tietyn käyttäjän päiväkirjamerkinnät
const listAllEntriesByUserId = async (id) => {
  try {

    const sql = 'SELECT * FROM DiaryEntries WHERE user_id = ?';

    // prepared statement SQL-injektion estämiseksi
    const [rows] = await promisePool.execute(sql, [id]);

    return rows;

  } catch (e) {

    console.error('error', e.message);
    return {error: e.message};

  }
};


// =============================
// Yksittäisen merkinnän haku
// =============================

// Hakee tietyn päiväkirjamerkinnän ID:n perusteella
const findEntryById = async (id) => {
  try {

    // prepared statement (turvallinen)
    const [rows] = await promisePool.execute(
      'SELECT * FROM DiaryEntries WHERE entry_id = ?',
      [id]
    );

    // turvaton tapa, mahdollistaa sql-injektiohaavoittuvuuden:
    //const [rows] = await promisePool.query('SELECT * FROM DiaryEntries WHERE entry_id =' + id);

    //console.log('rows', rows);

    // palautetaan ensimmäinen rivi
    return rows[0];

  } catch (e) {

    console.error('error', e.message);
    return {error: e.message};

  }
};


// =============================
// Full diary (JOIN query)
// =============================

// Tässä saadaan tehtyä Join query, minkä avulla nähdään nämäkin päiväkirjassa.
// ChatGPT - GPT -5 malli auttoi tämän tekemisessä

const listFullDiaryByUser = async (user_id) => {

const sql = `
SELECT
d.entry_id,
d.entry_date,
d.mood,
d.weight,
d.sleep_hours,
d.energy_level,
d.water_liters,
d.stress_level,
d.notes,

GROUP_CONCAT(DISTINCT e.type) AS exercise,
GROUP_CONCAT(DISTINCT m.description) AS meal,
GROUP_CONCAT(DISTINCT s.symptom_name) AS symptom,
GROUP_CONCAT(DISTINCT md.name) AS medication

FROM DiaryEntries d

LEFT JOIN exercises e 
ON e.entry_id = d.entry_id

LEFT JOIN meals m 
ON m.entry_id = d.entry_id

LEFT JOIN symptoms s 
ON s.entry_id = d.entry_id

LEFT JOIN medications md
ON md.entry_id = d.entry_id

WHERE d.user_id = ?

GROUP BY d.entry_id
ORDER BY d.entry_date DESC
`;

const [rows] = await promisePool.execute(sql, [user_id]);

return rows;

};


// =============================
// Uuden merkinnän lisääminen
// =============================

const addEntry = async (entry) => {

  // Puretaan entry-objektista yksittäiset kentät
  const {
  user_id,
  entry_date,
  mood,
  weight,
  sleep_hours,
  energy_level,
  water_liters,
  stress_level,
  notes
  } = entry;

  // SQL-lause uuden rivin lisäämiseksi
  // Käytetään placeholder-merkkejä (?) SQL-injektion estämiseksi
  const sql = `
    INSERT INTO DiaryEntries 
    (user_id, entry_date, mood, weight, sleep_hours, energy_level, water_liters, stress_level, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  // Parametrit samassa järjestyksessä kuin SQL-lauseessa
  const params = [
  user_id,
  entry_date,
  mood,
  weight,
  sleep_hours,
  energy_level,
  water_liters,
  stress_level,
  notes
  ];

  try {

    // Suoritetaan tietokantakysely
    const result = await promisePool.execute(sql, params);

    // Palautetaan lisätyn rivin id
    // insertId tulee MySQL:n vastauksesta
    return {entry_id: result[0].insertId};

  } catch (e) {

    // Jos tapahtuu virhe, tulostetaan se konsoliin
    console.error('error', e.message);

    // Palautetaan virhe controllerille käsiteltäväksi
    return {error: e.message};

  }
};


// =============================
// Merkinnän poistaminen
// =============================

const removeEntryById = async (entryId, userId) => {

  // poistetaan merkintä vain jos se kuuluu käyttäjälle
  const sql = 'DELETE from DiaryEntries WHERE entry_id = ? AND user_id = ?';

  const [result] = await promisePool.execute(sql, [entryId, userId]);

  //console.log('remove entry by id', result);

  // palautetaan kuinka monta riviä poistettiin
  return result.affectedRows;
};


// =============================
// Merkinnän päivitys
// =============================

const updateEntryById = async (entryId, userId, entry) => {

  // puretaan päivitettävät kentät
  const {
    user_id,
    entry_date,
    mood,
    weight,
    sleep_hours,
    energy_level,
    water_liters,
    stress_level,
    notes
  } = entry;

  const sql = `
    UPDATE DiaryEntries
    SET entry_date = ?, mood = ?, weight = ?, sleep_hours = ?, notes = ?
    WHERE entry_id = ? AND user_id = ?
  `;

  const [result] = await promisePool.execute(sql, [
    entry_date,
    mood,
    weight,
    sleep_hours,
    notes,
    entryId,
    userId
  ]);

  // palautetaan päivitettyjen rivien määrä
  return result.affectedRows;
};


// Exportataan funktiot controllerin käyttöön
export {
  listAllEntries,
  findEntryById,
  addEntry,
  listAllEntriesByUserId,
  removeEntryById,
  updateEntryById,
  listFullDiaryByUser
};


// ChatGPT:tä hyödynnettiin:
// - SELECT- ja INSERT-lauseiden kirjoittamisessa
// - Prepared statement -rakenteen käytössä SQL-injektion estämiseksi
// - Kyselyiden tulosten käsittelyssä
// - Debuggaamisessa paljon!