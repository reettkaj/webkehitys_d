// HUOM: mokkidata on poistettu modelista
//import users from '../models/user-model.js';

import jwt from 'jsonwebtoken';
import {
  findUserByUsername,
  listAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser,
  insertUser
} from '../models/user-model.js';

import bcrypt from 'bcryptjs';


// TODO: lisää tietokantafunktiot user modeliin
// ja käytä niitä täällä

// TODO: refaktoroi tietokantafunktiolle
const getUsers = async (req, res) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
  // ÄLÄ IKINÄ lähetä salasanoja HTTP-vastauksessa
    // kaikki emailit sensuroitu esimerkki
    // users[i].email = 'sensored';


// TODO: getUserById
const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
// TODO: putUserById
const putUserById = async (req, res) => {
  // Authorization check
  if (parseInt(req.params.id) !== req.user.user_id) {
    return res.status(403).json({ error: 'You can update only your own account' });
  }

  try {
    const result = await updateUser(req.params.id, req.body);
    if (result === 0) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.json({ message: 'user updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TODO: deleteUserById
const deleteUserById = async (req, res) => {
  if (parseInt(req.params.id) !== req.user.user_id) {
    return res.status(403).json({ error: 'You can delete only your own account' });
  }

  try {
    const result = await deleteUser(req.params.id);
    if (result === 0) {
      return res.status(404).json({ error: 'user not found' });
    }
    res.json({ message: 'user deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Käyttäjän lisäys (rekisteröityminen)
// TODO: refaktoroi tietokantafunktiolle

// Käyttäjän lisäys (rekisteröityminen)

const postUser = async (req, res) => {
  const { username, password, email } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await insertUser({
    username,
    password: hashedPassword,
    email
  });

  res.status(201).json(user);
}; // ChatGPT - GPT-5 malli auttoi korjaamaan tämän

  // Uusilla käyttäjillä pitää olla kaikki vaaditut ominaisuudet tai palautetaan virhe

  // HUOM: ÄLÄ ikinä loggaa käyttäjätietoja ensimmäisten pakollisten testien jälkeen!!! (tietosuoja)
  //console.log('registering new user', newUser);


// Get user information stored inside token
const getMe = (req, res) => {
  res.json(req.user);
};


export {
  getUsers,
  getUserById,
  putUserById,
  deleteUserById,
  postUser,
  getMe,
  listAllUsers
};
// ChatGPT:tä hyödynnettiin:
// - Async/await-rakenteen toteutuksessa
// - MVC-rakenteen selkeyttämisessä
// - REST-rajapinnan statuskoodien (200, 201, 400, 404, 500) käytössä
// - Controllerin ja modelin yhdistämisessä
