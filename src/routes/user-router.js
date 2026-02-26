import express from 'express';
import {
  getMe,
  getUsers,
  postUser,
  getUserById,
  putUserById,
  deleteUserById
} from '../controllers/user-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

const userRouter = express.Router();

// Users resource endpoints
userRouter.route('/')
// GET all users
.get(authenticateToken, getUsers)
// POST new user
.post(postUser);

// Get user info based on token
userRouter.get('/me', authenticateToken, getMe);

// TODO: get user by id
// app.get('/api/users/:id');
// TODO: put user by id
// TODO: delete user by id
// User by id endpoints
userRouter.route('/:id')
  .get(getUserById)
  .put(authenticateToken, putUserById)
  .delete(authenticateToken, deleteUserById);

export default userRouter;


// ChatGPT:tä hyödynnettiin:
// - Reittien jakamisessa omiin router-tiedostoihin
// - RESTful-rakenteen (/api/users, /api/users/:id) toteutuksessa
// - route('/')-ketjutuksen ymmärtämisessä