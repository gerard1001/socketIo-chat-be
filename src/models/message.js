import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String },
    },
    picture: {
      type: String,
      default: "",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
