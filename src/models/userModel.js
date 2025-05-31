import { Schema, model } from "mongoose";
import validate from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Please provide your name"] },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: [true, "User email already exists"],
      lowercase: true,
      validate: [validate.isEmail, "Please provide a valid email"],
    },
    picture: {
      type: String,
    },
    status: {
      type: String,
      default: "Hey there! I am using this app",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      maxlenth: [20, "Password must be at most 20 characters"],
    },
  },
  { collection: "users", timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {}
});

const User = model("User", userSchema);

export { userSchema };
export default User;
