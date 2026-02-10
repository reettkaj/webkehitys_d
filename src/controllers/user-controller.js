// HUOM: mokkidata on poistettu modelista
//import users from '../models/user-model.js';

import jwt from 'jsonwebtoken';
import {
  findUserByUsername,
  listAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser
} from '../models/user-model.js';

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
  try {
    const result = await updateUser(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json({message: 'user updated'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// TODO: deleteUserById
const deleteUserById = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json({message: 'user deleted'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Käyttäjän lisäys (rekisteröityminen)
// TODO: refaktoroi tietokantafunktiolle
const postUser = async (req, res) => {
  const {username, password, email} = req.body;

  if (!(username && password && email)) {
    return res.status(400).json({error: 'required fields missing'});
  }

  try {
    const result = await addUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
  // Uusilla käyttäjillä pitää olla kaikki vaaditut ominaisuudet tai palautetaan virhe

  // HUOM: ÄLÄ ikinä loggaa käyttäjätietoja ensimmäisten pakollisten testien jälkeen!!! (tietosuoja)
  //console.log('registering new user', newUser);

// Tietokantaversio valmis
const postLogin = async (req, res) => {
  const {username, password} = req.body;
  // haetaan käyttäjä-objekti käyttäjän nimen perusteella
  const user = await findUserByUsername(username);
  //console.log('postLogin user from db', user);
  if (user) {
    if (user.password === password) {
      delete user.password;
      // generate & sign token using a secret and expiration time
      // read from .env file
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.json({message: 'login ok', user, token});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};

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
  postLogin,
  getMe,
  listAllUsers
};
// ChatGPT:tä hyödynnettiin:
// - Async/await-rakenteen toteutuksessa
// - MVC-rakenteen selkeyttämisessä
// - REST-rajapinnan statuskoodien (200, 201, 400, 404, 500) käytössä
// - Controllerin ja modelin yhdistämisessä