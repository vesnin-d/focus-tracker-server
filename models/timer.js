const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timerSchema = new Schema(
  {
    remains: {
      type: Number,
      required: true
    },
    resumedAt: {
        type: Number
    },
    startedAt: {
        type: Number,
        required: true
    },
    isRunning: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timer', timerSchema);
