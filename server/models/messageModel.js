const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
  createdBy: { type: String, required: true },
  createdAt: { type: Date, required: true },
  message: { type: String, required: true },
});

module.exports = mongoose.model('Message', messagesSchema);
