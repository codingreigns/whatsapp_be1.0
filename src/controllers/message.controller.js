import logger from "../config/logger.config.js";
import { updatedLatestMessage } from "../services/conversations.service.js";
import {
  createMessage,
  getConvoMessages,
  populateMessage,
} from "../services/message.service.js";

export const sendMessages = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { message, convoId, files } = req.body;
    if ((!message && !files) || !convoId) {
      logger.error("conversation id is required also files or message");
      return res.sendStatus(400);
    }
    const messageData = {
      sender: userId,
      message,
      conversation: convoId,
      files: files || [],
    };
    let newMessage = await createMessage(messageData);
    let populatedMessage = await populateMessage(newMessage._id);
    await updatedLatestMessage(convoId, newMessage);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { convoId } = req.params;
    if (!convoId) {
      logger.error("No conversation id was found in params");
      res.sendStatus(400);
    }
    const messages = await getConvoMessages(convoId);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
