import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import Session from '../models/Session';

const router = express.Router();

router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { content, keystrokes, pasteEvents } = req.body;
    
    const session = new Session({
      userId: req.userId,
      content,
      keystrokes,
      pasteEvents
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error saving session' });
  }
});

export default router;