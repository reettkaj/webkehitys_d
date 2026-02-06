import promisePool from '../utils/database.js';


// TODO: lisää modelit ja muokkaa kontrollerit reiteille:
// GET /api/users - list all users
// GET /api/users/:id - get user by id
// POST /api/users - add a new user

// Huom: virheenkäsittely puuttuu
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
};

export {findUserByUsername};