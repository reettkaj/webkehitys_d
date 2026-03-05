import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth-router.js';
import itemRouter from './routes/item-router.js';
import userRouter from './routes/user-router.js';
import requestLogger from './middlewares/logger.js';
import entryRouter from './routes/entry-router.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handlers.js';

const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// enable CORS
app.use(cors());

// parse JSON
app.use(express.json());

// static frontend
app.use('/', express.static('public'));

// logger
app.use(requestLogger);

// API root
app.get('/api', (req, res) => {
  res.send('Teacher example Health Diary API!');
});

// ROUTERS
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/items', itemRouter);

// 404
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});