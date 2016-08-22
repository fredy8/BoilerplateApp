import express from 'express';
import errorHandlers from './errorHandlers';
import settings from '../settings'
import { db } from 'database';

const router = express.Router();

router.get('/', (req, res) => {
  const root = {
    _rels: {
      self: settings.apiUrl
    }
  };

  res.json(root);
});

router.use(...errorHandlers);

export default router;
