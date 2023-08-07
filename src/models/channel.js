import mongoose from "mongoose";

const channelShema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    members: {
      type: Array,
    },
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Channel", channelShema);
