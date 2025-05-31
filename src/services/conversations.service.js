import createHttpError from "http-errors";
import Conversation from "../models/conversationModel.js";
import User from "../models/userModel.js";

export const doesConversatioinsExists = async (senderId, receiverId) => {
  let convos = await Conversation.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: receiverId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos) throw createHttpError.BadRequest("Something went wrong");
  //   populate message model
  convos = await User.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await Conversation.create(data);
  if (!newConvo) throw createHttpError.BadRequest("Something went wrong");
  return newConvo;
};

export const populateConversation = async (
  convoId,
  fieldToPopulate,
  fieldsToExclude
) => {
  const populatedConvo = await Conversation.findOne({ _id: convoId }).populate(
    fieldToPopulate,
    fieldsToExclude
  );
  if (!populatedConvo) throw createHttpError.BadGateway("Something went wrong");
  return populatedConvo;
};

export const getUserConversations = async (userId) => {
  let conversations;
  await Conversation.find({
    users: { $elemMatch: { $eq: userId } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((e) => {
      throw createHttpError.BadRequest("Somethin went wrong");
    });
  return conversations;
};

export const updatedLatestMessage = async (convoId, msg) => {
  const updatedConvo = await Conversation.findByIdAndUpdate(convoId, {
    latestMessage: msg,
  });
  if (!updatedConvo) throw createHttpError.BadRequest("Something went wrong");
  return updatedConvo;
};
