const { Schema, model, Types } = require("mongoose");
const dayjs = require("dayjs");

const reactionsSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },

    reactionBody: {
      type: String,
      required: "Reaction is Required",
      maxlength: 280,
    },

    username: {
      type: String,
      required: "Username is Required",
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: (ts) => dayjs(ts).format("MM/DD/YYYY"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
    _id: false,
  }
);

const thoughtSchema = new Schema(
  {
    username: {
      type: String,
      required: "Username is Required",
    },

    thoughtText: {
      type: String,
      required: "Thought is Required",
      minlength: 1,
      maxlength: 280,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      get: (ts) => dayjs(ts).format("MM/DD/YYYY"),
    },

    reactions: [reactionsSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
