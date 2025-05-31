import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Conversation is required."],
      trim: true,
    },
    picture: {
      type: String,
      required: [true, "Picture is required."],
    },
    isGroup: {
      type: Boolean,
      required: true,
      default: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "Conversations", timestamps: true }
);

const Conversation = model("Conversation", conversationSchema);

export default Conversation;
