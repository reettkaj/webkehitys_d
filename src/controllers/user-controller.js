// HUOM: mokkidata on poistettu modelista
//import users from '../models/user-model.js';

import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator';

import {
  findUserByUsername,
  listAllUsers,
  findUserById,
  updateUser,
  deleteUser,
  insertUser
} from '../models/user-model.js';


// TODO: lisää tietokantafunktiot user modeliin
// ja käytä niitä täällä

// TODO: refaktoroi tietokantafunktiolle
const getUsers = async (req, res, next) => {
  try {
    const users = await listAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};
  // ÄLÄ IKINÄ lähetä salasanoja HTTP-vastauksessa
    // kaikki emailit sensuroitu esimerkki
    // users[i].email = 'sensored';


// TODO: getUserById
const getUserById = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      const error = new Error('user not found');
      error.status = 404;
      return next(error);
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
};


// TODO: putUserById
const putUserById = async (req, res, next) => {

  // Authorization check
  if (parseInt(req.params.id) !== req.user.user_id) {
    const error = new Error('You can update only your own account');
    error.status = 403;
    return next(error);
  }

  try {

    const result = await updateUser(req.params.id, req.body);

    if (result === 0) {
      const error = new Error('user not found');
      error.status = 404;
      return next(error);
    }

    res.json({ message: 'user updated' });

  } catch (error) {
    next(error);
  }
};


// TODO: deleteUserById
const deleteUserById = async (req, res, next) => {

  if (parseInt(req.params.id) !== req.user.user_id) {
    const error = new Error('You can delete only your own account');
    error.status = 403;
    return next(error);
  }

  try {

    const result = await deleteUser(req.params.id);

    if (result === 0) {
      const error = new Error('user not found');
      error.status = 404;
      return next(error);
    }

    res.json({ message: 'user deleted' });

  } catch (error) {
    next(error);
  }
};


// Käyttäjän lisäys (rekisteröityminen)
// TODO: refaktoroi tietokantafunktiolle

// Käyttäjän lisäys (rekisteröityminen)
const postUser = async (req, res, next) => {

  // validation errors can be retrieved from the request object (added by express-validator middleware)
  const errors = validationResult(req);

  // check if any validation errors
  if (!errors.isEmpty()) {
    const error = new Error('Invalid or missing fields');
    error.status = 400;
    return next(error);
  }

  try {

    const { username, password, email } = req.body;

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await insertUser({
      username,
      password: hashedPassword,
      email
    });

    res.status(201).json({
      message: 'new user added',
      user_id: user.user_id
    });

  } catch (error) {
    next(error);
  }
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
// - express-validator validoinnin lisäämisessä
// - error handler middleware -rakenteen refaktoroinnissa