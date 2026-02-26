import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('token verification failed', err);
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

export { authenticateToken };

console.log("VERIFY SECRET:", process.env.JWT_SECRET);