/**
 * Mock data and endpoints for users resource
 */

const users = [
  {
    id: 1,
    username: 'johndoe',
    password: 'password1',
    email: 'johndoe@example.com',
  },
  {
    id: 2,
    username: 'janedoe',
    password: 'password2',
    email: 'janedoe@example.com',
  },
  {
    id: 3,
    username: 'bobsmith',
    password: 'password3',
    email: 'bobsmith@example.com',
  },
];

const getUsers = (req, response) => {
  // ÄLÄ IKINÄ lähetä salasanoja HTTP-vastauksessa
  for (let i = 0; i < users.length; i++) {
    delete users[i].password;
    // kaikki emailit sensuroitu esimerkki
    // users[i].email = 'sensored';
  }
  response.json(users);
};

// Käyttäjän lisäys (rekisteröityminen)
const postUser = (pyynto, vastaus) => {
  const newUser = pyynto.body;
  // Uusilla käyttäjillä pitää olla kaikki vaaditut ominaisuudet tai palautetaan virhe
  // itse koodattu erittäin yksinkertainen syötteen validointi
  if (!(newUser.username && newUser.password && newUser.email)) {
    return vastaus.status(400).json({error: 'required fields missing'});
  }

  // HUOM: ÄLÄ ikinä loggaa käyttäjätietoja ensimmäisten pakollisten testien jälkeen!!! (tietosuoja)
  //console.log('registering new user', newUser);
  const newId = users[users.length - 1].id + 1;
  // luodaan uusi objekti, joka sisältää id-ominaisuuden ja kaikki newUserObjektin
  // ominaisuudet ja lisätään users-taulukon loppuun
  users.push({id: newId, ...newUser});
  delete newUser.password;
  console.log('users', users);
  vastaus.status(201).json({message: 'new user added', user_id: newId});
};

const postLogin = (req, res) => {
  const {username, password} = req.body;
  // haetaan käyttäjä-objekti käyttäjän nimen perusteella
  const userFound = users.find(user => username === user.username);
  if (userFound) {
    if (userFound.password === password) {
      delete userFound.password;
      return res.json({message: 'login ok', user: userFound});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};

// TODO: getUserById
// TODO: putUserById
// TODO: deleteUserById
//TODO: add users endpoints

// Hae käyttäjä ID:llä
const getUserById = (req, res) => {
  const id = Number(req.params.id);

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  // Ei lähetä salasanaa
  const { password, ...safeUser } = user;
  res.json(safeUser);
};


// Päivitä käyttäjä ID:llä
const putUserById = (req, res) => {
  const id = Number(req.params.id);
  const updatedData = req.body;

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'user not found' });
  }

  // Päivitetään vain annetut kentät
  users[userIndex] = {
    ...users[userIndex],
    ...updatedData,
    id, // id ei saa muuttua
  };

  // Ei palauta salasanaa
  const { password, ...safeUser } = users[userIndex];
  res.json({ message: 'user updated', user: safeUser });
};


// Poista käyttäjä ID:llä
const deleteUserById = (req, res) => {
  const id = Number(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'user not found' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'user deleted' });
};


export {
  getUsers,
  postUser,
  postLogin,
  getUserById,
  putUserById,
  deleteUserById
};