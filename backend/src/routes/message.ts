import express from 'express';
import MessageModel from '../models/messageModel';

const messageRouter = express.Router();

messageRouter.get('/message/list', async (req, res) => {
  const before = req.query.before as string | undefined;
  try {
    const messages = await MessageModel.list(before);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Listing messages failed.' });
  }
});

messageRouter.post('/message/new', async (req, res) => {
  const { author, content } = req.body as { author?: string; content?: string };
  console.log(author, content);
  if (!author || !content) {
    res.status(400).send('Body should contain author and content.');
    return;
  }

  try {
    const message = await MessageModel.createOne(author, content);
    res.json(message);
  } catch (error) {
    res.status(500).send('Creating sample message failed.');
  }
});

export default messageRouter;
