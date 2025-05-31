import createHttpError from "http-errors";
import Message from "../models/messageModel.js";

export const createMessage = async (messageData) => {
  let newMessage = await Message.create(messageData);
  if (!newMessage) throw createHttpError.BadRequest("Something went wrong");
  return newMessage;
};

export const populateMessage = async (id) => {
  let message = await Message.findById(id)
    .populate({
      path: "sender",
      select: "name picture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name picture isGroup users",
      model: "Conversation",
      populate: {
        path: "users",
        select: "name email picture status",
        model: "User",
      },
    });
  if (!message) throw createHttpError.BadRequest("Something went wrong");
  return message;
};

export const getConvoMessages = async (convoId) => {
  const messages = await Message.find({ conversation: convoId })
    .populate("sender", "name picture email status")
    .populate("conversation");
  if (!messages) throw createHttpError.BadRequest("Something went wrong");
  return messages;
};
