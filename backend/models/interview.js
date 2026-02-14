const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: String, required: true },
  date: { type: Date, required: true },
  description: String,

  eligibility: {
    minDsa: { type: Number, default: 0 },
    minWebd: { type: Number, default: 0 },
    minReact: { type: Number, default: 0 }
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Interview = mongoose.model('Interview', interviewSchema);
module.exports = Interview;
