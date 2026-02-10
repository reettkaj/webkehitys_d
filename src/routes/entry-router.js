import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
} from '../controllers/entry-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

const entryRouter = express.Router();

entryRouter.route('/')
  .get(getEntries)
  .post(authenticateToken, postEntry);

entryRouter.route('/:id').get(getEntryById);

export default entryRouter;