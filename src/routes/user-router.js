import express from 'express';
import { body } from 'express-validator';

import {
  getUsers,
  getUserById,
  putUserById,
  deleteUserById,
  postUser,
  getMe
} from '../controllers/user-controller.js';

import { authenticateToken } from '../middlewares/authentication.js';

const userRouter = express.Router();

/*
Routes for /api/users
*/

// GET all users
// POST new user (register)
userRouter.route('/')
  .get(getUsers)
  .post(
    body('email').trim().isEmail(),
    body('username').trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body('password').trim().isLength({ min: 8 }),
    postUser
  );

/*
Routes for /api/users/me
Return user info from token
*/
userRouter.get('/me', authenticateToken, getMe);

/*
Routes for /api/users/:id
*/
userRouter.route('/:id')
  .get(getUserById)
  .put(authenticateToken, putUserById)
  .delete(authenticateToken, deleteUserById);

export default userRouter;


// ChatGPT:tä hyödynnettiin:
// - Reittien jakamisessa omiin router-tiedostoihin
// - RESTful-rakenteen (/api/users, /api/users/:id) toteutuksessa
// - route('/')-ketjutuksen ymmärtämisessä