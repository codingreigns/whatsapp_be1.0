import createHttpError from "http-errors";
import logger from "../config/logger.config.js";
import {
  doesConversatioinsExists,
  createConversation,
  populateConversation,
  getUserConversations,
} from "../services/conversations.service.js";
import { findUser } from "../services/auth.service.js";

export const createOpenConversation = async (req, res, next) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;
    if (!receiverId) {
      logger.error(
        "please provide the user id you want to start conversation with"
      );
      throw createHttpError.BadGateway("Something went wrong");
    }
    // check if chats exists
    const existedConversations = await doesConversatioinsExists(
      senderId,
      receiverId
    );
    if (existedConversations) {
      res.json(existedConversations);
    } else {
      // let receiverUser = await findUser(receiverId);
      let conversationData = {
        name: "name",
        picture: "picture",
        isGroup: false,
        users: [senderId, receiverId],
      };
      const newConvo = await createConversation(conversationData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const conversations = await getUserConversations(userId);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};
